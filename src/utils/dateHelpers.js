import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export { dayjs }

export const MONTHS_IT = [
  'Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
  'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'
]

export const DAYS_SHORT = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom']
export const DAYS_FULL  = ['Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica']

/** Cella della griglia mese: [lunedì..domenica] per 6 righe */
export function buildMonthGrid(year, month) {
  // month è 0-based (come JS Date)
  const firstDay = dayjs(`${year}-${String(month + 1).padStart(2,'0')}-01`)
  // isoWeekday: 1=Lun … 7=Dom
  const startOffset = firstDay.isoWeekday() - 1
  const daysInMonth = firstDay.daysInMonth()
  const cells = []

  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(dayjs(`${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`))
  }
  // Riempi fino a 42 celle (6 righe × 7)
  while (cells.length < 42) cells.push(null)
  return cells
}

export const fmt = (d, format = 'YYYY-MM-DD') => dayjs(d).format(format)
export const today = () => dayjs().format('YYYY-MM-DD')
export const isWeekend = (d) => { const wd = dayjs(d).isoWeekday(); return wd === 6 || wd === 7 }
