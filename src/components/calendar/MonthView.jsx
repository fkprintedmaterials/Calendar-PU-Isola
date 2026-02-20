import { useState, useCallback } from 'react'
import { buildMonthGrid, DAYS_SHORT, today, fmt } from '../../utils/dateHelpers'
import { getItalianHolidays, holidayName } from '../../utils/italianHolidays'
import { useEventsStore } from '../../store/eventsStore'
import EventChip from './EventChip'
import EventModal from './EventModal'

export default function MonthView({ year, month, onRefresh }) {
  const cells    = buildMonthGrid(year, month)
  const holidays = getItalianHolidays(year)
  const todayStr = today()
  const { eventsForDate, getEventType } = useEventsStore()
  const [modal, setModal] = useState(null)

  const openDay   = useCallback((d) => setModal({ date:d, event:null }), [])
  const openEvent = useCallback((e) => setModal({ date:e.start_date, event:e }), [])

  return (
    <>
      {/* Intestazione giorni */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', background:'var(--surface)', border:'1px solid var(--border)', borderBottom:'none', borderRadius:'var(--r-md) var(--r-md) 0 0', overflow:'hidden' }}>
        {DAYS_SHORT.map((d,i) => (
          <div key={d} style={{ padding:'10px 0', textAlign:'center', fontSize:11, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color: i>=5?'var(--text-3)':'var(--text-2)', fontFamily:'var(--font-mono)', borderRight: i<6?'1px solid var(--border-light)':'none' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Griglia */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', border:'1px solid var(--border)', borderRadius:'0 0 var(--r-md) var(--r-md)', overflow:'hidden', background:'var(--border)', gap:1 }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`e${idx}`} style={{ background:'var(--bg-alt)', minHeight:110 }} />
          const ds       = fmt(day)
          const isToday  = ds === todayStr
          const isHol    = holidays.has(ds)
          const isWknd   = [6,7].includes(day.isoWeekday())
          const hName    = isHol ? holidayName(ds, year) : null
          const dayEvs   = eventsForDate(ds)

          return (
            <div key={ds} onClick={() => openDay(ds)}
              style={{ background: isHol?'#fff5f5': isWknd?'var(--bg-alt)':'var(--surface)', minHeight:110, padding:'6px 8px', cursor:'pointer', transition:'background .1s' }}
              onMouseEnter={e => { if(!isHol) e.currentTarget.style.background='var(--surface-2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = isHol?'#fff5f5':isWknd?'var(--bg-alt)':'var(--surface)' }}
            >
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{
                  width:24, height:24, borderRadius: isToday?'50%':4,
                  background: isToday?'var(--navy)':'transparent',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:12, fontWeight: isToday?700: isHol?600:400,
                  color: isToday?'#fff': isHol?'var(--red)': isWknd?'var(--text-3)':'var(--text)',
                  fontFamily:'var(--font-mono)',
                }}>{day.date()}</span>
                {hName && <span style={{ fontSize:9, color:'var(--red)', fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase', textAlign:'right', lineHeight:1.2, maxWidth:70, fontFamily:'var(--font-mono)' }}>{hName}</span>}
              </div>
              {isHol && <div style={{ height:2, borderRadius:1, background:'var(--red)', opacity:.3, marginBottom:4 }} />}
              <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                {dayEvs.slice(0,3).map(ev => (
                  <EventChip key={ev.id} event={ev} eventType={getEventType(ev.event_type_id)} onClick={openEvent} />
                ))}
                {dayEvs.length > 3 && <div style={{ fontSize:10, color:'var(--text-3)', paddingLeft:6 }}>+{dayEvs.length-3} altri</div>}
              </div>
            </div>
          )
        })}
      </div>

      {modal && <EventModal date={modal.date} event={modal.event} onClose={() => setModal(null)} onSaved={onRefresh} />}
    </>
  )
}
