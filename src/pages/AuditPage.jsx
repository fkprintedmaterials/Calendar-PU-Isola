import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { dayjs } from '../utils/dateHelpers'

const ACTION = {
  INSERT: { label:'Inserimento',  bg:'#ecfdf5', color:'#059669', icon:'＋' },
  UPDATE: { label:'Modifica',     bg:'#eff6ff', color:'#2563eb', icon:'✎'  },
  DELETE: { label:'Eliminazione', bg:'#fef2f2', color:'#dc2626', icon:'✕'  },
}

function parseUA(ua) {
  if (!ua) return { browser:'n/d', os:'' }
  let browser = 'Browser'
  if      (ua.includes('Edg/'))    browser = 'Edge'
  else if (ua.includes('OPR'))     browser = 'Opera'
  else if (ua.includes('Chrome'))  browser = 'Chrome'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Safari'))  browser = 'Safari'
  let os = ''
  if      (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS'))  os = 'macOS'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('Linux'))   os = 'Linux'
  return { browser, os }
}

export default function AuditPage() {
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState({ action:'', table:'', ip:'' })

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('audit_log').select('*').order('created_at', { ascending:false }).limit(500)
    setLogs(data || [])
    setLoading(false)
  }

  const tables   = [...new Set(logs.map(l => l.table_name))]
  const filtered = logs.filter(l =>
    (!filter.action || l.action === filter.action) &&
    (!filter.table  || l.table_name === filter.table) &&
    (!filter.ip     || (l.ip_address||'').includes(filter.ip))
  )

  const upd = (k,v) => setFilter(f => ({ ...f, [k]:v }))

  return (
    <div className="animate-fade">
      <div style={{ marginBottom:20, display:'flex', alignItems:'baseline', gap:12 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:600 }}>Audit Log</h1>
        <span style={{ fontSize:12, color:'var(--text-3)' }}>Tutte le modifiche · dati anonimi</span>
      </div>

      {/* Filtri */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', padding:'14px 16px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', marginBottom:16 }}>
        <div style={{ flex:'1 1 130px' }}>
          <label>Azione</label>
          <select value={filter.action} onChange={e=>upd('action',e.target.value)}>
            <option value="">— tutte —</option>
            {Object.entries(ACTION).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div style={{ flex:'1 1 160px' }}>
          <label>Tabella</label>
          <select value={filter.table} onChange={e=>upd('table',e.target.value)}>
            <option value="">— tutte —</option>
            {tables.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ flex:'1 1 130px' }}>
          <label>IP</label>
          <input value={filter.ip} onChange={e=>upd('ip',e.target.value)} placeholder="es. 192.168" />
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
          <button className="btn btn-ghost btn-sm" onClick={()=>setFilter({action:'',table:'',ip:''})}>✕ Reset</button>
          <button className="btn btn-ghost btn-sm" onClick={load}>↻ Aggiorna</button>
        </div>
      </div>

      <div style={{ fontSize:12, color:'var(--text-3)', marginBottom:10 }}>
        {filtered.length} eventi{logs.length!==filtered.length?` su ${logs.length} totali`:''}
      </div>

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', overflow:'hidden' }}>
        {loading
          ? <div style={{ padding:40, textAlign:'center', color:'var(--text-3)' }}>Caricamento…</div>
          : filtered.length === 0
            ? <div style={{ padding:40, textAlign:'center', color:'var(--text-3)' }}>Nessun evento trovato.</div>
            : (
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'var(--surface-2)' }}>
                    {['Data e ora','Azione','Dettaglio','IP','Browser'].map(h => (
                      <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', color:'var(--text-3)', borderBottom:'1px solid var(--border)', fontFamily:'var(--font-mono)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(log => {
                    const act = ACTION[log.action] || { label:log.action, bg:'#f9f9f9', color:'#666', icon:'·' }
                    const ua  = parseUA(log.user_agent)
                    return (
                      <tr key={log.id} style={{ borderBottom:'1px solid var(--border-light)' }}
                        onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
                        onMouseLeave={e=>e.currentTarget.style.background=''}>
                        <td style={{ padding:'10px 14px', whiteSpace:'nowrap' }}>
                          <div style={{ fontSize:12, fontFamily:'var(--font-mono)', color:'var(--text-2)' }}>{dayjs(log.created_at).format('DD/MM/YYYY')}</div>
                          <div style={{ fontSize:11, color:'var(--text-3)' }}>{dayjs(log.created_at).format('HH:mm:ss')}</div>
                        </td>
                        <td style={{ padding:'10px 14px' }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 8px', borderRadius:20, background:act.bg, color:act.color, fontSize:11, fontWeight:600 }}>{act.icon} {act.label}</span>
                          <div style={{ fontSize:10, color:'var(--text-3)', fontFamily:'var(--font-mono)', marginTop:3 }}>{log.table_name}</div>
                        </td>
                        <td style={{ padding:'10px 14px', maxWidth:260 }}>
                          <div style={{ fontSize:12, color:'var(--text-2)' }}>{log.description || '—'}</div>
                        </td>
                        <td style={{ padding:'10px 14px', whiteSpace:'nowrap' }}>
                          <span style={{ fontSize:11, fontFamily:'var(--font-mono)', color: log.ip_address?'var(--text-2)':'var(--text-3)' }}>{log.ip_address||'n/d'}</span>
                        </td>
                        <td style={{ padding:'10px 14px' }}>
                          <div style={{ fontSize:11, color:'var(--text-2)' }}>{ua.browser}</div>
                          <div style={{ fontSize:10, color:'var(--text-3)' }}>{ua.os}</div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )
        }
      </div>
    </div>
  )
}
