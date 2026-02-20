import { MONTHS_IT } from '../../utils/dateHelpers'

export default function CalendarNav({ year, month, view, onPrev, onNext, onViewChange, onToday }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
    }}>
      {/* Titolo */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 22, fontWeight: 600, color: 'var(--text)',
        marginRight: 'auto',
        letterSpacing: '-.02em',
      }}>
        {MONTHS_IT[month]}
        <span style={{ fontWeight: 300, color: 'var(--text-3)', marginLeft: 8, fontSize: 18 }}>
          {year}
        </span>
      </div>

      {/* View toggle */}
      <div style={{
        display: 'flex', background: 'var(--bg-alt)',
        border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
        padding: 3, gap: 2,
      }}>
        {['month','week','day'].map(v => (
          <button key={v} onClick={() => onViewChange(v)}
            style={{
              padding: '5px 12px', borderRadius: 4, border: 'none',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
              background: view === v ? 'var(--navy)' : 'transparent',
              color: view === v ? '#fff' : 'var(--text-2)',
              transition: 'all .15s',
            }}>
            {{ month: 'Mese', week: 'Settimana', day: 'Giorno' }[v]}
          </button>
        ))}
      </div>

      <button className="btn btn-ghost btn-sm" onClick={onToday}>Oggi</button>
      <button className="btn btn-ghost btn-sm btn-icon" onClick={onPrev} title="Mese precedente">◀</button>
      <button className="btn btn-ghost btn-sm btn-icon" onClick={onNext} title="Mese successivo">▶</button>
    </div>
  )
}
