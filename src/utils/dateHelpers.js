import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isoWeek)
dayjs.extend(isSameOrBefore)
export { dayjs }

export const MONTHS_IT  = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
export const DAYS_SHORT = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom']

export function buildMonthGrid(year, month) {
  const first  = dayjs(`${year}-${String(month+1).padStart(2,'0')}-01`)
  const offset = first.isoWeekday() - 1
  const cells  = []
  for (let i=0; i<offset; i++) cells.push(null)
  for (let d=1; d<=first.daysInMonth(); d++)
    cells.push(dayjs(`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`))
  while (cells.length < 42) cells.push(null)
  return cells
}

export const fmt   = (d, f='YYYY-MM-DD') => dayjs(d).format(f)
export const today = () => dayjs().format('YYYY-MM-DD')
