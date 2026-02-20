import { dayjs } from './dateHelpers'

export function workingHoursForDate(dateStr) {
  const wd = dayjs(dateStr).isoWeekday()
  if (wd === 6 || wd === 7) return 0
  if (wd === 5) return 7
  return 8
}
