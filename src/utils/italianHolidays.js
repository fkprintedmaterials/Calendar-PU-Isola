import dayjs from 'dayjs'

function easterDate(year) {
  const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4
  const f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30
  const i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7
  const m=Math.floor((a+11*h+22*l)/451)
  const mo=Math.floor((h+l-7*m+114)/31), dy=((h+l-7*m+114)%31)+1
  return dayjs(`${year}-${String(mo).padStart(2,'0')}-${String(dy).padStart(2,'0')}`)
}

export function getItalianHolidays(year) {
  const e = easterDate(year)
  return new Set([
    `${year}-01-01`,`${year}-01-06`,`${year}-04-25`,`${year}-05-01`,
    `${year}-06-02`,`${year}-08-15`,`${year}-11-01`,`${year}-12-08`,
    `${year}-12-25`,`${year}-12-26`,
    e.format('YYYY-MM-DD'), e.add(1,'day').format('YYYY-MM-DD'),
  ])
}

export function holidayName(dateStr, year) {
  const e = easterDate(year)
  const map = {
    [`${year}-01-01`]:'Capodanno', [`${year}-01-06`]:'Epifania',
    [e.format('YYYY-MM-DD')]:'Pasqua', [e.add(1,'day').format('YYYY-MM-DD')]:'Pasquetta',
    [`${year}-04-25`]:'Liberazione', [`${year}-05-01`]:'Festa Lavoratori',
    [`${year}-06-02`]:'Festa Repubblica', [`${year}-08-15`]:'Ferragosto',
    [`${year}-11-01`]:'Tutti i Santi', [`${year}-12-08`]:'Immacolata',
    [`${year}-12-25`]:'Natale', [`${year}-12-26`]:'S. Stefano',
  }
  return map[dateStr] || null
}
