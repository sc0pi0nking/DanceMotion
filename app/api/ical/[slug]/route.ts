import { fetchAllEvents } from '@/lib/events-db'
import { fetchGroupBySlug } from '@/lib/groups-db'
import { buildICalendar } from '@/lib/ical'

// GET - RFC 5545 iCal feed. slug = 'all' or a group slug (optionally with .ics suffix)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const raw = (await params).slug
    const slug = raw.replace(/\.ics$/i, '').toLowerCase()

    let calName = 'Alle Termine'
    let filterTerms: string[] | null = null

    if (slug !== 'all') {
      const group = await fetchGroupBySlug(slug)
      if (!group) {
        return new Response('Gruppe nicht gefunden', { status: 404 })
      }
      calName = group.name
      filterTerms = [slug, group.name.toLowerCase()]
    }

    const events = await fetchAllEvents()
    const selected = filterTerms
      ? events.filter((e) =>
          (e.groups || []).some((g) => filterTerms!.includes(String(g).toLowerCase()))
        )
      : events

    const ics = buildICalendar(`DanceMotion – ${calName}`, selected)

    return new Response(ics, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `inline; filename="dancemotion-${slug}.ics"`,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('GET /api/ical/[slug] error:', error)
    return new Response('Kalender konnte nicht erstellt werden', { status: 500 })
  }
}
