import dayjs from 'dayjs'

/** Calcola la data di Pasqua per un dato anno (algoritmo anonimo gregoriano) */
function easterDate(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)   // 1-based
  const day   = ((h + l - 7 * m + 114) % 31) + 1
  return dayjs(`${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`)
}

/**
 * Restituisce un Set di stringhe "YYYY-MM-DD" con tutti i festivi nazionali italiani
 * per l'anno indicato, inclusa Pasqua e Pasquetta.
 */
export function getItalianHolidays(year) {
  const easter = easterDate(year)
  const easterMonday = easter.add(1, 'day')

  const fixed = [
    `${year}-01-01`, // Capodanno
    `${year}-01-06`, // Epifania
    `${year}-04-25`, // Liberazione
    `${year}-05-01`, // Festa dei Lavoratori
    `${year}-06-02`, // Festa della Repubblica
    `${year}-08-15`, // Ferragosto
    `${year}-11-01`, // Tutti i Santi
    `${year}-12-08`, // Immacolata Concezione
    `${year}-12-25`, // Natale
    `${year}-12-26`, // Santo Stefano
  ]

  return new Set([
    ...fixed,
    easter.format('YYYY-MM-DD'),
    easterMonday.format('YYYY-MM-DD'),
  ])
}

/** Restituisce il nome del festivo per una data stringa, o null */
export function holidayName(dateStr, year) {
  const easter = easterDate(year)
  const easterMonday = easter.add(1, 'day')

  const names = {
    [`${year}-01-01`]: 'Capodanno',
    [`${year}-01-06`]: 'Epifania',
    [easter.format('YYYY-MM-DD')]: 'Pasqua',
    [easterMonday.format('YYYY-MM-DD')]: 'Pasquetta',
    [`${year}-04-25`]: 'Liberazione',
    [`${year}-05-01`]: 'Festa Lavoratori',
    [`${year}-06-02`]: 'Festa Repubblica',
    [`${year}-08-15`]: 'Ferragosto',
    [`${year}-11-01`]: 'Tutti i Santi',
    [`${year}-12-08`]: 'Immacolata',
    [`${year}-12-25`]: 'Natale',
    [`${year}-12-26`]: 'S. Stefano',
  }
  return names[dateStr] || null
}
