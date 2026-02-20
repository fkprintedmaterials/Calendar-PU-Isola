import { dayjs } from './dateHelpers'

/**
 * Ore lavorative per una data.
 * Lun–Gio = 8h, Ven = 7h, Sab/Dom = 0
 */
export function workingHoursForDate(dateStr) {
  const wd = dayjs(dateStr).isoWeekday() // 1=Lun…7=Dom
  if (wd === 6 || wd === 7) return 0
  if (wd === 5) return 7   // Venerdì
  return 8                  // Lun–Gio
}

/** Totale ore lavorative in un range (estremi inclusi), esclude festivi */
export function totalWorkingHours(startStr, endStr, holidays = new Set()) {
  let cursor = dayjs(startStr)
  const end  = dayjs(endStr)
  let total  = 0
  while (cursor.isSameOrBefore(end, 'day')) {
    const ds = cursor.format('YYYY-MM-DD')
    if (!holidays.has(ds)) total += workingHoursForDate(ds)
    cursor = cursor.add(1, 'day')
  }
  return total
}
