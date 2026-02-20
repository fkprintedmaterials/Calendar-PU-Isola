import { useState, useCallback } from 'react'
import { buildMonthGrid, DAYS_SHORT, today, fmt } from '../../utils/dateHelpers'
import { getItalianHolidays, holidayName } from '../../utils/italianHolidays'
import { useEventsStore } from '../../store/eventsStore'
import { useSettingsStore } from '../../store/settingsStore'
import EventChip from './EventChip'
import EventModal from './EventModal'

export default function MonthView({ year, month }) {
  const cells = buildMonthGrid(year, month)
  const holidays = getItalianHolidays(year)
  const { settings } = useSettingsStore()
  // merge festivi locali
  const allHolidays = new Set([...holidays, ...(settings.local_holidays || [])])

  const { eventsForDate, getEventType } = useEventsStore()

  const [modal, setModal] = useState(null) // { date, event }
  const todayStr = today()

  const handleDayClick = useCallback((dateStr) => {
    setModal({ date: dateStr, event: null })
  }, [])

  const handleEventClick = useCallback((event) => {
    setModal({ date: event.start_date, event })
  }, [])

  return (
    <>
      {/* Intestazione giorni */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 0, marginBottom: 2,
        background: 'var(--surface)',
        borderRadius: 'var(--r-md) var(--r-md) 0 0',
        border: '1px solid var(--border)',
        borderBottom: 'none',
        overflow: 'hidden',
      }}>
        {DAYS_SHORT.map((d, i) => (
          <div key={d} style={{
            padding: '10px 0',
            textAlign: 'center',
            fontSize: 11, fontWeight: 600, letterSpacing: '.06em',
            textTransform: 'uppercase',
            color: i >= 5 ? 'var(--text-3)' : 'var(--text-2)',
            fontFamily: 'var(--font-mono)',
            borderRight: i < 6 ? '1px solid var(--border-light)' : 'none',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Griglia giorni */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        border: '1px solid var(--border)',
        borderRadius: '0 0 var(--r-md) var(--r-md)',
        overflow: 'hidden',
        background: 'var(--border)',
        gap: 1,
      }}>
        {cells.map((day, idx) => {
          if (!day) return (
            <div key={`empty-${idx}`} style={{ background: 'var(--bg-alt)', minHeight: 110 }} />
          )

          const dateStr = fmt(day)
          const isToday = dateStr === todayStr
          const isHoliday = allHolidays.has(dateStr)
          const isWeekend = [6,7].includes(day.isoWeekday())
          const hName = isHoliday ? holidayName(dateStr, year) : null
          const dayEvents = eventsForDate(dateStr)

          return (
            <div
              key={dateStr}
              onClick={() => handleDayClick(dateStr)}
              style={{
                background: isHoliday
                  ? '#fff5f5'
                  : isWeekend ? 'var(--bg-alt)' : 'var(--surface)',
                minHeight: 110,
                padding: '6px 8px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background .1s',
              }}
              onMouseEnter={e => {
                if (!isHoliday) e.currentTarget.style.background = 'var(--surface-2)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isHoliday
                  ? '#fff5f5'
                  : isWeekend ? 'var(--bg-alt)' : 'var(--surface)'
              }}
            >
              {/* Numero giorno */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{
                  width: 24, height: 24,
                  borderRadius: isToday ? '50%' : 4,
                  background: isToday ? 'var(--navy)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: isToday ? 700 : (isHoliday ? 600 : 400),
                  color: isToday ? '#fff' : isHoliday ? 'var(--red)' : isWeekend ? 'var(--text-3)' : 'var(--text)',
                  fontFamily: 'var(--font-mono)',
                  flexShrink: 0,
                }}>
                  {day.date()}
                </span>

                {/* Nome festivo */}
                {hName && (
                  <span style={{
                    fontSize: 9, color: 'var(--red)', fontWeight: 600,
                    letterSpacing: '.04em', textTransform: 'uppercase',
                    textAlign: 'right', lineHeight: 1.2, maxWidth: 70,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {hName}
                  </span>
                )}
              </div>

              {/* Barra festivo */}
              {isHoliday && (
                <div style={{
                  height: 2, borderRadius: 1, background: 'var(--red)',
                  opacity: .3, marginBottom: 4,
                }} />
              )}

              {/* Chip eventi (max 3 visibili) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {dayEvents.slice(0, 3).map(ev => (
                  <EventChip
                    key={ev.id}
                    event={ev}
                    eventType={getEventType(ev.event_type_id)}
                    onClick={handleEventClick}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div style={{ fontSize: 10, color: 'var(--text-3)', paddingLeft: 6 }}>
                    +{dayEvents.length - 3} altri
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {modal && (
        <EventModal
          date={modal.date}
          event={modal.event}
          onClose={() => setModal(null)}
          onSaved={() => { /* Il refetch avviene nel CalendarPage */ }}
        />
      )}
    </>
  )
}
