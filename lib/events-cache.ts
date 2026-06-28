import { unstable_cache } from 'next/cache'
import { fetchUpcomingEvents, fetchPastEvents } from './events-db'

/**
 * Server-seitig gecachte Event-Loader für die RSC Public Pages.
 * Tag 'events' wird von den Admin-Event-Routes (POST/PUT/DELETE) via
 * revalidateTag('events') invalidiert, sobald sich Events ändern.
 */
export function getUpcomingEvents(limit?: number) {
  return unstable_cache(
    () => fetchUpcomingEvents(limit),
    ['events-upcoming', String(limit ?? 'all')],
    { tags: ['events'], revalidate: 3600 }
  )()
}

export function getPastEvents(limit?: number) {
  return unstable_cache(
    () => fetchPastEvents(limit),
    ['events-past', String(limit ?? 'all')],
    { tags: ['events'], revalidate: 3600 }
  )()
}
