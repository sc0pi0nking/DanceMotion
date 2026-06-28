import type { Event } from './supabase'

// RFC 5545 text escaping
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

// RFC 5545 line folding (max 75 octets per line, continuation with leading space)
function foldLine(line: string): string {
  if (line.length <= 75) return line
  const chunks: string[] = []
  let current = line
  // First line up to 75 chars, subsequent lines up to 74 (leading space counts)
  chunks.push(current.slice(0, 75))
  current = current.slice(75)
  while (current.length > 0) {
    chunks.push(' ' + current.slice(0, 74))
    current = current.slice(74)
  }
  return chunks.join('\r\n')
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function utcStamp(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  )
}

// Europe/Berlin VTIMEZONE (CET/CEST)
const BERLIN_VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Berlin',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
]

function buildVEvent(event: Event, dtstamp: string): string[] {
  const lines: string[] = ['BEGIN:VEVENT']
  lines.push(`UID:${event.id}@dancemotion-eschweiler.de`)
  lines.push(`DTSTAMP:${dtstamp}`)

  const dateCompact = event.date.replace(/-/g, '')
  if (event.time && /^\d{2}:\d{2}/.test(event.time)) {
    const [h, m] = event.time.split(':')
    const start = `${dateCompact}T${h}${m}00`
    // assume 2h duration for timed events
    const endHour = (parseInt(h, 10) + 2) % 24
    const end = `${dateCompact}T${pad(endHour)}${m}00`
    lines.push(`DTSTART;TZID=Europe/Berlin:${start}`)
    lines.push(`DTEND;TZID=Europe/Berlin:${end}`)
  } else {
    // all-day event
    const d = new Date(event.date + 'T00:00:00Z')
    const next = new Date(d.getTime() + 24 * 60 * 60 * 1000)
    const nextCompact =
      next.getUTCFullYear().toString() +
      pad(next.getUTCMonth() + 1) +
      pad(next.getUTCDate())
    lines.push(`DTSTART;VALUE=DATE:${dateCompact}`)
    lines.push(`DTEND;VALUE=DATE:${nextCompact}`)
  }

  lines.push(`SUMMARY:${escapeText(event.title)}`)

  const locationParts = [event.location, event.city].filter(Boolean)
  if (locationParts.length > 0) {
    lines.push(`LOCATION:${escapeText(locationParts.join(', '))}`)
  }
  if (event.note) {
    lines.push(`DESCRIPTION:${escapeText(event.note)}`)
  }
  if (event.category) {
    lines.push(`CATEGORIES:${escapeText(event.category)}`)
  }

  lines.push('END:VEVENT')
  return lines
}

/**
 * Build an RFC 5545 compliant iCalendar (.ics) feed.
 */
export function buildICalendar(calName: string, events: Event[]): string {
  const dtstamp = utcStamp(new Date())

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DanceMotion Eschweiler//Termine//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(calName)}`,
    'X-WR-TIMEZONE:Europe/Berlin',
    ...BERLIN_VTIMEZONE,
  ]

  for (const event of events) {
    lines.push(...buildVEvent(event, dtstamp))
  }

  lines.push('END:VCALENDAR')

  return lines.map(foldLine).join('\r\n') + '\r\n'
}
