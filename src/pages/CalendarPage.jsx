import { useState, useEffect, useCallback } from 'react'
import { dayjs } from '../utils/dateHelpers'
import { useEventsStore } from '../store/eventsStore'
import CalendarNav from '../components/calendar/CalendarNav'
import MonthView from '../components/calendar/MonthView'

export default function CalendarPage() {
  const now = dayjs()
  const [year,  setYear]  = useState(now.year())
  const [month, setMonth] = useState(now.month())
  const { fetchEvents, eventTypes, loading } = useEventsStore()

  const load = useCallback(() => {
    const m  = String(month + 1).padStart(2,'0')
    const s  = dayjs(`${year}-${m}-01`).subtract(7,'day').format('YYYY-MM-DD')
    const e  = dayjs(`${year}-${m}-01`).add(1,'month').add(7,'day').format('YYYY-MM-DD')
    fetchEvents(s, e)
  }, [year, month])

  useEffect(() => { load() }, [load])

  const goNext  = () => month===11 ? (setYear(y=>y+1), setMonth(0))   : setMonth(m=>m+1)
  const goPrev  = () => month===0  ? (setYear(y=>y-1), setMonth(11))  : setMonth(m=>m-1)
  const goToday = () => { setYear(now.year()); setMonth(now.month()) }

  return (
    <div className="animate-fade">
      {/* Legenda */}
      {eventTypes.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16, padding:'10px 14px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r-md)' }}>
          <Dot color="var(--red)" label="Festivo" />
          {eventTypes.map(t => <Dot key={t.id} color={t.color} icon={t.icon} label={t.name} />)}
        </div>
      )}
      <CalendarNav year={year} month={month} onPrev={goPrev} onNext={goNext} onToday={goToday} />
      {loading && <div style={{ textAlign:'center', padding:20, color:'var(--text-3)', fontSize:13 }}>Caricamento eventi…</div>}
      <MonthView year={year} month={month} onRefresh={load} />
    </div>
  )
}

function Dot({ color, icon, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'var(--text-2)' }}>
      <div style={{ width:10, height:10, borderRadius:2, background:color, flexShrink:0 }} />
      {icon && <span style={{ fontSize:11 }}>{icon}</span>}
      {label}
    </div>
  )
}
