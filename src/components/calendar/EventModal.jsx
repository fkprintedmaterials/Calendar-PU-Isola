import { useState } from 'react'
import { useEventsStore } from '../../store/eventsStore'
import { useAuthStore } from '../../store/authStore'
import { dayjs } from '../../utils/dateHelpers'

export default function EventModal({ date, event, onClose, onSaved }) {
  const { eventTypes, createEvent, deleteEvent } = useEventsStore()
  const { persons } = useAuthStore()
  const isView = !!event

  const [form, setForm] = useState({
    title:         event?.title         || '',
    event_type_id: event?.event_type_id || eventTypes[0]?.id || '',
    start_date:    event?.start_date    || date || dayjs().format('YYYY-MM-DD'),
    end_date:      event?.end_date      || date || dayjs().format('YYYY-MM-DD'),
    notes:         event?.notes         || '',
  })
  const [selPersons, setSelPersons] = useState([])
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  const upd = (k,v) => setForm(f => ({ ...f, [k]:v }))
  const tog = (id)  => setSelPersons(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id])

  const handleSave = async () => {
    if (!form.title.trim())          return setError('Inserisci un titolo.')
    if (!form.event_type_id)         return setError('Seleziona un tipo evento.')
    if (form.end_date < form.start_date) return setError('Data fine precedente a data inizio.')
    setSaving(true); setError('')
    try { await createEvent(form, selPersons); onSaved?.(); onClose() }
    catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirm(`Eliminare "${event.title}"?`)) return
    await deleteEvent(event); onSaved?.(); onClose()
  }

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(18,24,38,.55)', backdropFilter:'blur(4px)',
    }}>
      <div onClick={e=>e.stopPropagation()} className="animate-scale" style={{
        background:'var(--surface)', borderRadius:'var(--r-lg)', width:520, maxWidth:'95vw', maxHeight:'90vh',
        boxShadow:'var(--shadow-lg)', border:'1px solid var(--border)', overflow:'hidden',
        display:'flex', flexDirection:'column',
      }}>
        {/* Header */}
        <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--surface-2)' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:600 }}>
            {isView ? event.title : `Nuovo Evento · ${dayjs(form.start_date).format('D MMM YYYY')}`}
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', color:'var(--text-3)' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding:'18px 22px', overflowY:'auto', flex:1, display:'flex', flexDirection:'column', gap:13 }}>
          {error && <div style={{ background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:'var(--r-sm)', padding:'8px 12px', color:'#b91c1c', fontSize:12 }}>{error}</div>}

          {!isView && <>
            <div><label>Titolo *</label><input value={form.title} onChange={e=>upd('title',e.target.value)} placeholder="es. Audit AXA" /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div><label>Data inizio *</label><input type="date" value={form.start_date} onChange={e=>upd('start_date',e.target.value)} /></div>
              <div><label>Data fine *</label><input type="date" value={form.end_date} onChange={e=>upd('end_date',e.target.value)} /></div>
            </div>
            <div>
              <label>Tipo evento *</label>
              <select value={form.event_type_id} onChange={e=>upd('event_type_id',e.target.value)}>
                <option value="">— seleziona —</option>
                {eventTypes.map(t=><option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
              </select>
            </div>
            <div><label>Note</label><textarea value={form.notes} onChange={e=>upd('notes',e.target.value)} rows={2} style={{ resize:'vertical' }} /></div>
            <div>
              <label style={{ marginBottom:8 }}>Partecipanti</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {persons.map(p => {
                  const sel = selPersons.includes(p.id)
                  return (
                    <button key={p.id} onClick={()=>tog(p.id)} style={{
                      display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:20,
                      background: sel ? (p.color||'var(--navy)') : 'var(--bg-alt)',
                      color: sel ? '#fff' : 'var(--text-2)',
                      border:`1px solid ${sel ? (p.color||'var(--navy)') : 'var(--border)'}`,
                      fontSize:12, fontWeight: sel?600:400, cursor:'pointer',
                      fontFamily:'var(--font-body)', transition:'all .12s',
                    }}>
                      <span style={{ width:16, height:16, borderRadius:'50%', background:p.color||'#6b7280', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'#fff', fontWeight:700 }}>
                        {p.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                      </span>
                      {p.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </>}

          {isView && (
            <div style={{ fontSize:13, color:'var(--text-2)', display:'flex', flexDirection:'column', gap:8 }}>
              <div><strong>Date:</strong> {event.start_date} → {event.end_date}</div>
              {event.notes && <div><strong>Note:</strong> {event.notes}</div>}
              {(event.event_participants?.length > 0) && (
                <div>
                  <strong>Partecipanti:</strong>{' '}
                  {event.event_participants.map(p => p.persons?.name).filter(Boolean).join(', ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'12px 22px', borderTop:'1px solid var(--border)', display:'flex', justifyContent: isView?'space-between':'flex-end', alignItems:'center', background:'var(--surface-2)' }}>
          {isView && <button onClick={handleDelete} className="btn btn-sm" style={{ background:'#fef2f2', color:'var(--red)', border:'1px solid #fca5a5' }}>🗑 Elimina</button>}
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Chiudi</button>
            {!isView && <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving?'Salvo…':'✓ Salva'}</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
