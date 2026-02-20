import { MONTHS_IT } from '../../utils/dateHelpers'

export default function CalendarNav({ year, month, onPrev, onNext, onToday }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
      <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, marginRight:'auto', letterSpacing:'-.02em' }}>
        {MONTHS_IT[month]}
        <span style={{ fontWeight:300, color:'var(--text-3)', marginLeft:8, fontSize:18 }}>{year}</span>
      </div>
      <button className="btn btn-ghost btn-sm" onClick={onToday}>Oggi</button>
      <button className="btn btn-ghost btn-sm btn-icon" onClick={onPrev}>◀</button>
      <button className="btn btn-ghost btn-sm btn-icon" onClick={onNext}>▶</button>
    </div>
  )
}
