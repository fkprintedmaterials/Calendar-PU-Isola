import { useState, useEffect, useCallback } from 'react'
import { dayjs } from '../utils/dateHelpers'
import { useEventsStore } from '../store/eventsStore'
import CalendarNav from '../components/calendar/CalendarNav'
import MonthView from '../components/calendar/MonthView'

export default function CalendarPage() {
  const now = dayjs()
  const [year,  setYear]  = useState(now.year())
  const [month, setMonth] = useState(now.month()) // 0-based
  const [view,  setView]  = useState('month')

  const { fetchEvents, eventTypes, loading } = useEventsStore()

  const loadEvents = useCallback(() => {
    const start = dayjs(`${year}-${String(month + 1).padStart(2,'0')}-01`).subtract(7, 'day').format('YYYY-MM-DD')
    const end   = dayjs(`${year}-${String(month + 1).padStart(2,'0')}-01`).add(1, 'month').add(7, 'day').format('YYYY-MM-DD')
    fetchEvents(start, end)
  }, [year, month])

  useEffect(() => { loadEvents() }, [loadEvents])

  const goNext = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }
  const goPrev = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const goToday = () => { setYear(now.year()); setMonth(now.month()) }

  return (
    <div className="animate-fade">
      {/* Legenda tipi evento */}
      {eventTypes.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16,
          padding: '10px 14px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
        }}>
          {/* Festivi sempre presenti */}
          <LegendItem color="var(--red)" label="Festivo" />
          {eventTypes.map(t => (
            <LegendItem key={t.id} color={t.color} icon={t.icon} label={t.name} />
          ))}
        </div>
      )}

      <CalendarNav
        year={year} month={month} view={view}
        onPrev={goPrev} onNext={goNext}
        onViewChange={setView} onToday={goToday}
      />

      {loading && (
        <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-3)', fontSize: 13 }}>
          Caricamento eventi…
        </div>
      )}

      {view === 'month' && (
        <MonthView year={year} month={month} onRefresh={loadEvents} />
      )}

      {view !== 'month' && (
        <Placeholder view={view} />
      )}
    </div>
  )
}

function LegendItem({ color, icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-2)' }}>
      <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
      {icon && <span style={{ fontSize: 11 }}>{icon}</span>}
      {label}
    </div>
  )
}

function Placeholder({ view }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)', padding: 60, textAlign: 'center',
      color: 'var(--text-3)',
    }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>🚧</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 6 }}>
        Vista {view === 'week' ? 'Settimana' : 'Giorno'} — Fase 5
      </div>
      <div style={{ fontSize: 13 }}>Disponibile nel prossimo aggiornamento.</div>
    </div>
  )
}
