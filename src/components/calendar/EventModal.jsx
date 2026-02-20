import { useState, useEffect } from 'react'
import { useEventsStore } from '../../store/eventsStore'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'
import { dayjs } from '../../utils/dateHelpers'

export default function EventModal({ date, event, onClose, onSaved }) {
  const { eventTypes, createEvent, deleteEvent } = useEventsStore()
  const { person, isAdmin } = useAuthStore()
  const admin = isAdmin()

  const [persons, setPersons] = useState([])
  const [form, setForm] = useState({
    title: event?.title || '',
    event_type_id: event?.event_type_id || eventTypes[0]?.id || '',
    start_date: event?.start_date || date || dayjs().format('YYYY-MM-DD'),
    end_date: event?.end_date || date || dayjs().format('YYYY-MM-DD'),
    notes: event?.notes || '',
  })
  const [selectedPersons, setSelectedPersons] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('persons').select('id, name, color, role').eq('active', true).order('name')
      .then(({ data }) => setPersons(data || []))
  }, [])

  const togglePerson = (id) => setSelectedPersons(p =>
    p.includes(id) ? p.filter(x => x !== id) : [...p, id]
  )

  const handleSave = async () => {
    if (!form.title.trim()) return setError('Inserisci un titolo.')
    if (!form.event_type_id) return setError('Seleziona un tipo evento.')
    setSaving(true); setError('')
    try {
      await createEvent(
        { ...form, created_by: person?.id },
        selectedPersons
      )
      onSaved?.()
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!event?.id) return
    if (!confirm(`Eliminare "${event.title}"?`)) return
    await deleteEvent(event.id)
    onSaved?.(); onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(18,24,38,.6)', backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div
        className="animate-scale"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: 'var(--r-lg)',
          width: 520, maxWidth: '95vw', maxHeight: '90vh',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header modal */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--surface-2)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
            {event ? 'Dettaglio Evento' : `Nuovo Evento · ${dayjs(form.start_date).format('D MMM YYYY')}`}
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: 18, cursor: 'pointer',
            color: 'var(--text-3)', lineHeight: 1, padding: 4,
          }}>✕</button>
        </div>

        {/* Corpo */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 'var(--r-sm)', padding: '8px 12px', color: '#b91c1c', fontSize: 12 }}>
              {error}
            </div>
          )}

          <div>
            <label>Titolo *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="es. Audit AXA" disabled={!!event} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label>Data inizio *</label>
              <input type="date" value={form.start_date}
                onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} disabled={!!event} />
            </div>
            <div>
              <label>Data fine *</label>
              <input type="date" value={form.end_date}
                onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} disabled={!!event} />
            </div>
          </div>

          <div>
            <label>Tipo evento *</label>
            <select value={form.event_type_id}
              onChange={e => setForm(f => ({ ...f, event_type_id: e.target.value }))} disabled={!!event}>
              <option value="">— seleziona —</option>
              {eventTypes.map(t => (
                <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Note</label>
            <textarea value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2} disabled={!!event}
              style={{ resize: 'vertical' }} />
          </div>

          {/* Partecipanti */}
          <div>
            <label style={{ marginBottom: 8 }}>Partecipanti</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {persons.map(p => {
                const sel = selectedPersons.includes(p.id)
                return (
                  <button key={p.id} onClick={() => !event && togglePerson(p.id)}
                    disabled={!!event}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 20, cursor: event ? 'default' : 'pointer',
                      background: sel ? (p.color || 'var(--navy)') : 'var(--bg-alt)',
                      color: sel ? '#fff' : 'var(--text-2)',
                      border: `1px solid ${sel ? (p.color || 'var(--navy)') : 'var(--border)'}`,
                      fontSize: 12, fontWeight: sel ? 600 : 400,
                      transition: 'all .15s',
                    }}>
                    <span style={{
                      width: 16, height: 16, borderRadius: '50%',
                      background: p.color || '#6b7280',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 8, color: '#fff', fontWeight: 700,
                    }}>
                      {p.name.split(' ').map(w => w[0]).join('').slice(0,2)}
                    </span>
                    {p.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer modal */}
        {!event && (
          <div style={{
            padding: '14px 24px', borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--surface-2)',
          }}>
            {event && admin ? (
              <button className="btn btn-ghost btn-sm" onClick={handleDelete}
                style={{ color: 'var(--red)' }}>
                🗑 Elimina
              </button>
            ) : <div />}
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={onClose}>Annulla</button>
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvataggio…' : '✓ Salva evento'}
              </button>
            </div>
          </div>
        )}
        {event && admin && (
          <div style={{
            padding: '14px 24px', borderTop: '1px solid var(--border)',
            display: 'flex', justifyContent: 'flex-end',
            background: 'var(--surface-2)',
          }}>
            <button className="btn btn-sm" onClick={handleDelete}
              style={{ background: '#fef2f2', color: 'var(--red)', border: '1px solid #fca5a5' }}>
              🗑 Elimina evento
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
