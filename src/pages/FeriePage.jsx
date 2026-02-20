import { useState, useEffect, useMemo } from 'react'
import { useVacationsStore } from '../store/vacationsStore'
import { useAuthStore }      from '../store/authStore'
import { useSettingsStore }  from '../store/settingsStore'
import { getItalianHolidays } from '../utils/italianHolidays'
import { workingHoursForDate } from '../utils/workingHours'
import { dayjs, MONTHS_IT }   from '../utils/dateHelpers'

const TYPES = {
  ferie:     { label:'Ferie',        color:'#059669', bg:'#ecfdf5', icon:'🌴' },
  smart:     { label:'Smart Working', color:'#2563eb', bg:'#eff6ff', icon:'🏠' },
  trasferta: { label:'Trasferta',    color:'#d97706', bg:'#fffbeb', icon:'✈️' },
  permesso:  { label:'Permesso',     color:'#7c3aed', bg:'#f5f3ff', icon:'🕐' },
}
const YEAR     = new Date().getFullYear()
const HOLIDAYS = getItalianHolidays(YEAR)

export default function FeriePage() {
  const { entries, loading, fetchAll, insert, remove } = useVacationsStore()
  const { persons }  = useAuthStore()
  const { settings } = useSettingsStore()

  const [selPerson, setSelPerson] = useState('')
  const [showForm,  setShowForm]  = useState(false)
  const [tab,       setTab]       = useState('inserimento')

  useEffect(() => { fetchAll() }, [])

  const stats = useMemo(() => persons.map(p => {
    const mine  = entries.filter(e => e.person_id === p.id)
    const byType = {}
    Object.keys(TYPES).forEach(t => { byType[t] = mine.filter(e=>e.type===t).reduce((s,e)=>s+Number(e.hours),0) })
    const totalFerie = byType.ferie || 0
    const target     = p.vacation_target_h || 160
    return { person:p, byType, totalFerie, target, pct: Math.min(100, Math.round(totalFerie/target*100)) }
  }), [persons, entries])

  const myEntries = entries.filter(e => e.person_id === selPerson).sort((a,b) => a.date.localeCompare(b.date))
  const myStats   = stats.find(s => s.person.id === selPerson)

  return (
    <div className="animate-fade">
      {/* Header + tab */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:600 }}>Ferie & Assenze</h1>
        <TabSwitch value={tab} onChange={setTab} options={[['inserimento','✏️ Inserimento'],['riepilogo','📊 Riepilogo Team']]} />
      </div>

      {tab === 'inserimento' && (
        <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:20, alignItems:'start' }}>
          {/* Lista persone */}
          <PersonList persons={persons} selected={selPerson} onSelect={id => { setSelPerson(id); setShowForm(false) }} />

          {/* Pannello destra */}
          {!selPerson
            ? <EmptyState text="Seleziona una persona per vedere e inserire le sue assenze" />
            : <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                {myStats && <TargetCard stats={myStats} />}
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowForm(v=>!v)}>
                    {showForm ? '✕ Chiudi' : '＋ Nuova assenza'}
                  </button>
                </div>
                {showForm && (
                  <InsertForm personId={selPerson}
                    hoursLunGio={settings.working_hours_lun_gio||8}
                    hoursVen={settings.working_hours_ven||7}
                    onSave={async (p, keepOpen) => { if (p === null) { setShowForm(false); return }; await insert(p); if (!keepOpen) setShowForm(false) }}
                    onCancel={() => setShowForm(false)}
                  />
                )}
                <EntriesList entries={myEntries} onRemove={remove} loading={loading} />
              </div>
          }
        </div>
      )}

      {tab === 'riepilogo' && <TeamTab stats={stats} loading={loading} />}
    </div>
  )
}

/* ─── PERSON LIST ─────────────────────────────────────────── */
function PersonList({ persons, selected, onSelect }) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
      <div style={{ padding:'10px 16px', borderBottom:'1px solid var(--border)', fontSize:11, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--text-3)', fontFamily:'var(--font-mono)' }}>Seleziona persona</div>
      <div style={{ padding:8 }}>
        {persons.map(p => (
          <button key={p.id} onClick={() => onSelect(p.id)} style={{
            display:'flex', alignItems:'center', gap:10, width:'100%', padding:'8px 10px',
            borderRadius:'var(--r-sm)', border:'none',
            background: selected===p.id ? 'var(--navy)' : 'transparent',
            color:      selected===p.id ? '#fff' : 'var(--text)',
            cursor:'pointer', transition:'all .12s', fontFamily:'var(--font-body)', textAlign:'left',
          }}
          onMouseEnter={e => { if(selected!==p.id) e.currentTarget.style.background='var(--bg-alt)' }}
          onMouseLeave={e => { if(selected!==p.id) e.currentTarget.style.background='transparent' }}
          >
            <Avatar name={p.name} color={p.color} size={28} />
            <div>
              <div style={{ fontSize:13, fontWeight: selected===p.id?600:400 }}>{p.name}</div>
              <div style={{ fontSize:10, opacity:.7 }}>{p.role}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── TARGET CARD ─────────────────────────────────────────── */
function TargetCard({ stats: { byType, totalFerie, target, pct } }) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'18px 20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div style={{ fontWeight:600, fontSize:14 }}>Ferie {YEAR}</div>
        <div style={{ fontSize:13, color:'var(--text-3)' }}>
          <span style={{ fontWeight:700, color:'var(--text)', fontSize:18 }}>{totalFerie}h</span> / {target}h target
        </div>
      </div>
      <div style={{ height:8, background:'var(--bg-alt)', borderRadius:4, overflow:'hidden', marginBottom:10 }}>
        <div style={{ height:'100%', borderRadius:4, width:`${pct}%`, transition:'width .4s ease', background: pct>=100?'#059669': pct>=70?'#d97706':'var(--navy)' }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--text-3)', marginBottom:12 }}>
        <span>{pct}% utilizzato</span>
        <span>{Math.max(0,target-totalFerie)}h rimanenti</span>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
        {Object.entries(TYPES).map(([k,m]) => byType[k]>0 && (
          <span key={k} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:20, background:m.bg, color:m.color, fontSize:11, fontWeight:500 }}>
            {m.icon} {m.label}: <strong>{byType[k]}h</strong>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── INSERT FORM ─────────────────────────────────────────── */
function InsertForm({ personId, hoursLunGio, hoursVen, onSave, onCancel }) {
  const [rangeMode, setRangeMode] = useState(false)
  const [date,      setDate]      = useState(dayjs().format('YYYY-MM-DD'))
  const [dateTo,    setDateTo]    = useState(dayjs().format('YYYY-MM-DD'))
  const [type,      setType]      = useState('ferie')
  const [hours,     setHours]     = useState('')
  const [notes,     setNotes]     = useState('')
  const [error,     setError]     = useState('')
  const [saving,    setSaving]    = useState(false)

  // Auto-set hours for single day
  useEffect(() => {
    if (rangeMode) return
    if (!date) return
    if (HOLIDAYS.has(date)) { setHours('0'); return }
    const h = workingHoursForDate(date)
    setHours(h > 0 ? String(h) : '')
  }, [date, rangeMode])

  // Single-day helpers
  const isHol  = !rangeMode && HOLIDAYS.has(date)
  const isWknd = !rangeMode && date && [6,7].includes(dayjs(date).isoWeekday())
  const maxH   = !rangeMode && date ? workingHoursForDate(date) : 8

  // Range preview: compute all working days between date and dateTo
  const rangeWorkDays = useMemo(() => {
    if (!rangeMode || !date || !dateTo) return []
    const start = dayjs(date)
    const end   = dayjs(dateTo)
    if (end.isBefore(start)) return []
    const days = []
    let cur = start
    while (!cur.isAfter(end)) {
      const d = cur.format('YYYY-MM-DD')
      const wd = cur.isoWeekday() // 1=Mon … 7=Sun
      if (wd <= 5 && !HOLIDAYS.has(d)) {
        days.push({ date: d, hours: workingHoursForDate(d) })
      }
      cur = cur.add(1, 'day')
    }
    return days
  }, [rangeMode, date, dateTo])

  const rangeTotalHours = rangeWorkDays.reduce((s,d)=>s+d.hours, 0)

  const save = async () => {
    setError('')
    if (rangeMode) {
      if (!date || !dateTo)          return setError('Seleziona date di inizio e fine.')
      if (dayjs(dateTo).isBefore(dayjs(date))) return setError('La data fine deve essere >= data inizio.')
      if (!rangeWorkDays.length)     return setError('Nessun giorno lavorativo nel periodo selezionato.')
      setSaving(true)
      try {
        for (const d of rangeWorkDays) {
          await onSave({ person_id:personId, date:d.date, hours:d.hours, type, notes:notes||null }, true)
        }
        onSave(null, false) // signal done
      } catch(e) {
        setError(e.message.includes('unique') ? 'Alcune voci esistono già per le date selezionate.' : e.message)
        setSaving(false)
      }
    } else {
      if (!date)            return setError('Seleziona una data.')
      if (isHol || isWknd)  return setError('Il giorno è festivo o weekend.')
      const h = parseFloat(hours)
      if (isNaN(h)||h<=0)   return setError('Inserisci le ore.')
      if (h > maxH)         return setError(`Max ${maxH}h per questo giorno.`)
      setSaving(true)
      try { await onSave({ person_id:personId, date, hours:h, type, notes:notes||null }) }
      catch(e) { setError(e.message.includes('unique') ? 'Esiste già una voce di questo tipo per questa data.' : e.message); setSaving(false) }
    }
  }

  return (
    <div className="animate-fade" style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'18px 20px' }}>
      {/* Title + mode toggle */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ fontWeight:600, fontSize:14 }}>Nuova assenza</div>
        <div style={{ display:'flex', background:'var(--bg-alt)', border:'1px solid var(--border)', borderRadius:'var(--r-sm)', padding:2, gap:1 }}>
          {[['single','📅 Giorno singolo'],['range','📆 Range date']].map(([k,l]) => {
            const active = (k==='single') !== rangeMode
            return (
              <button key={k} onClick={()=>{ setRangeMode(k==='range'); setError('') }}
                style={{ padding:'4px 12px', borderRadius:3, border:'none', fontSize:11, fontWeight:500, cursor:'pointer',
                  background: active?'var(--navy)':'transparent', color: active?'#fff':'var(--text-2)', fontFamily:'var(--font-body)', transition:'all .15s' }}>
                {l}
              </button>
            )
          })}
        </div>
      </div>

      {error && <div style={{ background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:'var(--r-sm)', padding:'8px 12px', color:'#b91c1c', fontSize:12, marginBottom:12 }}>{error}</div>}

      <div style={{ display:'grid', gridTemplateColumns: rangeMode ? '1fr 1fr 1fr' : '1fr 1fr 1fr', gap:12, marginBottom:12 }}>
        {/* Date fields */}
        {rangeMode ? (
          <>
            <div>
              <label>Da *</label>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
            </div>
            <div>
              <label>A *</label>
              <input type="date" value={dateTo} min={date} onChange={e=>setDateTo(e.target.value)} />
            </div>
          </>
        ) : (
          <div>
            <label>Data *</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
            {isHol  && <div style={{ fontSize:10, color:'var(--red)', marginTop:3 }}>⚠ Giorno festivo</div>}
            {isWknd && !isHol && <div style={{ fontSize:10, color:'var(--text-3)', marginTop:3 }}>Weekend</div>}
          </div>
        )}

        <div>
          <label>Tipo *</label>
          <select value={type} onChange={e=>setType(e.target.value)}>
            {Object.entries(TYPES).map(([k,m]) => <option key={k} value={k}>{m.icon} {m.label}</option>)}
          </select>
        </div>

        {!rangeMode && (
          <div>
            <label>Ore * <span style={{ color:'var(--text-3)', fontWeight:400 }}>(max {maxH}h)</span></label>
            <input type="number" min="0.5" max={maxH} step="0.5" value={hours} onChange={e=>setHours(e.target.value)} placeholder={`es. ${maxH}`} />
          </div>
        )}
      </div>

      {/* Range preview */}
      {rangeMode && date && dateTo && (
        <div style={{ marginBottom:12 }}>
          {dayjs(dateTo).isBefore(dayjs(date))
            ? <div style={{ padding:'10px 14px', background:'#fef2f2', borderRadius:'var(--r-sm)', fontSize:12, color:'#b91c1c' }}>⚠ La data fine deve essere successiva alla data inizio.</div>
            : rangeWorkDays.length === 0
              ? <div style={{ padding:'10px 14px', background:'#fef2f2', borderRadius:'var(--r-sm)', fontSize:12, color:'#b91c1c' }}>Nessun giorno lavorativo nel periodo (solo weekend/festivi).</div>
              : (
                <div style={{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:'var(--r-sm)', padding:'12px 14px' }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'#0369a1', marginBottom:8 }}>
                    📋 Anteprima: {rangeWorkDays.length} giorni lavorativi — {rangeTotalHours}h totali
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                    {rangeWorkDays.map(d => (
                      <span key={d.date} style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'2px 8px', background:'#e0f2fe', color:'#0369a1', borderRadius:12, fontSize:11, fontFamily:'var(--font-mono)' }}>
                        {dayjs(d.date).format('ddd DD/MM')} <strong>{d.hours}h</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )
          }
        </div>
      )}

      <div style={{ marginBottom:14 }}>
        <label>Note (opzionale)</label>
        <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="es. ferie estive" />
      </div>
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>Annulla</button>
        <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}>
          {saving ? 'Salvo…' : rangeMode && rangeWorkDays.length > 0 ? `✓ Salva ${rangeWorkDays.length} giorni` : '✓ Salva'}
        </button>
      </div>
    </div>
  )
}

/* ─── ENTRIES LIST ────────────────────────────────────────── */
function EntriesList({ entries, onRemove, loading }) {
  const [deleting, setDeleting] = useState(null)
  if (loading) return <div style={{ padding:20, textAlign:'center', color:'var(--text-3)' }}>Caricamento…</div>
  if (!entries.length) return <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'32px 20px', textAlign:'center', color:'var(--text-3)' }}>Nessuna assenza inserita.</div>

  const byMonth = {}
  entries.forEach(e => { const m=e.date.slice(0,7); if(!byMonth[m]) byMonth[m]=[]; byMonth[m].push(e) })

  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
      {Object.entries(byMonth).map(([month, mes]) => {
        const [y,m] = month.split('-')
        return (
          <div key={month}>
            <div style={{ padding:'8px 16px', background:'var(--surface-2)', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:12, fontWeight:600, color:'var(--text-2)' }}>{MONTHS_IT[parseInt(m)-1]} {y}</span>
              <span style={{ fontSize:11, fontFamily:'var(--font-mono)', color:'var(--text-3)' }}>{mes.reduce((s,e)=>s+Number(e.hours),0)}h</span>
            </div>
            {mes.map((e,i) => {
              const meta = TYPES[e.type] || TYPES.ferie
              return (
                <div key={e.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', borderBottom: i<mes.length-1?'1px solid var(--border-light)':'none' }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:meta.color, flexShrink:0 }} />
                  <div style={{ fontSize:12, fontFamily:'var(--font-mono)', color:'var(--text-3)', minWidth:80 }}>{dayjs(e.date).format('ddd DD/MM')}</div>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:20, background:meta.bg, color:meta.color, fontSize:11, fontWeight:500 }}>{meta.icon} {meta.label}</span>
                  <div style={{ fontSize:13, fontWeight:600 }}>{e.hours}h</div>
                  {e.notes && <div style={{ fontSize:11, color:'var(--text-3)', flex:1 }}>{e.notes}</div>}
                  <button onClick={async () => { if(!confirm('Eliminare questa voce?')) return; setDeleting(e.id); await onRemove(e); setDeleting(null) }}
                    disabled={deleting===e.id}
                    style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--text-3)', cursor:'pointer', fontSize:14, padding:'2px 6px', borderRadius:4, transition:'color .1s' }}
                    onMouseEnter={ev=>ev.currentTarget.style.color='var(--red)'}
                    onMouseLeave={ev=>ev.currentTarget.style.color='var(--text-3)'}
                  >{deleting===e.id?'…':'🗑'}</button>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

/* ─── TEAM TAB ────────────────────────────────────────────── */
function TeamTab({ stats, loading }) {
  if (loading) return <div style={{ padding:40, textAlign:'center', color:'var(--text-3)' }}>Caricamento…</div>
  const cols = ['180px','1fr','80px','80px','90px','80px','90px']
  const heads = ['Persona','Avanzamento ferie','🌴 Ferie','🏠 Smart','✈️ Trasferta','🕐 Permesso','Target']

  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ display:'grid', gridTemplateColumns:cols.join(' '), padding:'10px 16px', background:'var(--surface-2)', borderBottom:'1px solid var(--border)', gap:0 }}>
        {heads.map(h => <div key={h} style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', color:'var(--text-3)', fontFamily:'var(--font-mono)', textAlign: h==='Persona'||h==='Avanzamento ferie'?'left':'right' }}>{h}</div>)}
      </div>

      {/* Righe */}
      {stats.map(({ person:p, byType, totalFerie, target, pct }) => (
        <div key={p.id} style={{ display:'grid', gridTemplateColumns:cols.join(' '), padding:'12px 16px', borderBottom:'1px solid var(--border-light)', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Avatar name={p.name} color={p.color} size={28} />
            <div>
              <div style={{ fontSize:13, fontWeight:500 }}>{p.name}</div>
              <div style={{ fontSize:10, color:'var(--text-3)' }}>{p.department}</div>
            </div>
          </div>
          <div style={{ paddingRight:20 }}>
            <div style={{ height:6, background:'var(--bg-alt)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:3, width:`${pct}%`, background: pct>=100?'#059669':pct>=70?'#d97706':'var(--navy)', transition:'width .4s ease' }} />
            </div>
            <div style={{ fontSize:10, color:'var(--text-3)', marginTop:3 }}>{totalFerie}h / {target}h ({pct}%)</div>
          </div>
          {['ferie','smart','trasferta','permesso'].map(t => (
            <div key={t} style={{ textAlign:'right', fontSize:13, fontFamily:'var(--font-mono)', color: byType[t]>0?'var(--text)':'var(--text-3)', fontWeight: byType[t]>0?500:400 }}>
              {byType[t]>0 ? `${byType[t]}h` : '—'}
            </div>
          ))}
          <div style={{ textAlign:'right', fontSize:12, color:'var(--text-3)', fontFamily:'var(--font-mono)' }}>{target}h</div>
        </div>
      ))}

      {/* Totali */}
      <div style={{ display:'grid', gridTemplateColumns:cols.join(' '), padding:'10px 16px', background:'var(--surface-2)', gap:0 }}>
        <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', color:'var(--text-3)', fontFamily:'var(--font-mono)' }}>Totali team</div>
        <div />
        {['ferie','smart','trasferta','permesso'].map(t => {
          const tot = stats.reduce((s,x)=>s+(x.byType[t]||0),0)
          return <div key={t} style={{ textAlign:'right', fontSize:13, fontFamily:'var(--font-mono)', fontWeight:700, color: tot>0?'var(--text)':'var(--text-3)' }}>{tot>0?`${tot}h`:'—'}</div>
        })}
        <div />
      </div>
    </div>
  )
}

/* ─── UTILS ──────────────────────────────────────────────── */
function Avatar({ name, color, size=28 }) {
  const init = (name||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:color||'#6b7280', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.36, fontWeight:700, color:'#fff' }}>{init}</div>
  )
}

function TabSwitch({ value, onChange, options }) {
  return (
    <div style={{ display:'flex', background:'var(--bg-alt)', border:'1px solid var(--border)', borderRadius:'var(--r-sm)', padding:3, gap:2 }}>
      {options.map(([k,l]) => (
        <button key={k} onClick={()=>onChange(k)} style={{ padding:'6px 14px', borderRadius:4, border:'none', fontSize:12, fontWeight:500, cursor:'pointer', transition:'all .15s', background: value===k?'var(--navy)':'transparent', color: value===k?'#fff':'var(--text-2)', fontFamily:'var(--font-body)' }}>{l}</button>
      ))}
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'60px 40px', textAlign:'center', color:'var(--text-3)' }}>
      <div style={{ fontSize:32, marginBottom:12 }}>👈</div>
      <div style={{ fontSize:13 }}>{text}</div>
    </div>
  )
}
