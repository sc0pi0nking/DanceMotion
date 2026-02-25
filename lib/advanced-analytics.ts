import { supabaseServer } from './supabase'
import { tiles } from './site-data'

export interface EngagementMetrics {
  bounceRate: number // Percentage of single-page sessions
  avgSessionDuration: number // Seconds
  pageViewsPerSession: number
  returnVisitorRate: number // Percentage
  conversionEvents: number // Contact forms, signups, etc.
}

export interface EventPopularity {
  eventId: string
  eventName: string
  eventDate: string
  pageViews: number
  uniqueVisitors: number
  clickThroughRate: number // Percentage
  conversionRate: number // Percentage
}

export interface PerformanceMetrics {
  avgPageLoadTime: number // Milliseconds
  avgFirstContentfulPaint: number // Milliseconds
  avgLargestContentfulPaint: number // Milliseconds
  avgCumulativeLayoutShift: number
  mobileVsDesktopLoadTime: {
    mobile: number
    desktop: number
  }
}

export interface GroupEngagement {
  groupId: string
  groupName: string
  pageViews: number
  uniqueVisitors: number
  avgTimeOnPage: number // Seconds
  engagementRate: number // Percentage
}

interface AnalyticsPageviewRow {
  session_hash: string
  path: string
  referrer: string | null
  device_type: string | null
  browser: string | null
  created_at: string
}

function getStartDate(daysBack: number): Date {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysBack)
  return startDate
}

function slugifyText(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

async function fetchPageviews(daysBack: number): Promise<AnalyticsPageviewRow[]> {
  const startDate = getStartDate(daysBack)

  const { data, error } = await supabaseServer
    .from('analytics_pageviews')
    .select('session_hash, path, referrer, device_type, browser, created_at')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching pageviews:', error)
    return []
  }

  return (data || []) as AnalyticsPageviewRow[]
}

function buildSessionMap(pageviews: AnalyticsPageviewRow[]) {
  const sessions = new Map<
    string,
    {
      first: number
      last: number
      pageCount: number
      dates: Set<string>
      hasConversion: boolean
      rows: AnalyticsPageviewRow[]
    }
  >()

  for (const row of pageviews) {
    const timestamp = new Date(row.created_at).getTime()
    const dateKey = row.created_at.slice(0, 10)

    if (!sessions.has(row.session_hash)) {
      sessions.set(row.session_hash, {
        first: timestamp,
        last: timestamp,
        pageCount: 0,
        dates: new Set<string>(),
        hasConversion: false,
        rows: [],
      })
    }

    const session = sessions.get(row.session_hash)!
    session.first = Math.min(session.first, timestamp)
    session.last = Math.max(session.last, timestamp)
    session.pageCount += 1
    session.dates.add(dateKey)
    session.rows.push(row)

    if (row.path.includes('/formulare') || row.path.includes('/api/contact') || row.path.includes('/api/event-requests')) {
      session.hasConversion = true
    }
  }

  return sessions
}

/**
 * Calculate user engagement metrics
 */
export async function getEngagementMetrics(daysBack: number = 7): Promise<EngagementMetrics> {
  try {
    const pageviews = await fetchPageviews(daysBack)
    const sessions = buildSessionMap(pageviews)

    const totalSessions = sessions.size
    let singlePageSessions = 0
    let totalSessionDuration = 0
    let returningVisitors = 0
    let conversionCount = 0

    for (const [, session] of sessions) {
      if (session.pageCount === 1) singlePageSessions++
      totalSessionDuration += Math.max(0, Math.round((session.last - session.first) / 1000))
      if (session.dates.size > 1) returningVisitors++
      if (session.hasConversion) conversionCount++
    }

    return {
      bounceRate:
        totalSessions > 0
          ? Math.round((singlePageSessions / totalSessions) * 100)
          : 0,
      avgSessionDuration:
        totalSessions > 0
          ? Math.round(totalSessionDuration / totalSessions)
          : 0,
      pageViewsPerSession:
        totalSessions > 0
          ? Math.round((pageviews.length / totalSessions) * 10) / 10
          : 0,
      returnVisitorRate:
        totalSessions > 0
          ? Math.round((returningVisitors / totalSessions) * 100)
          : 0,
      conversionEvents: conversionCount,
    }
  } catch (error) {
    console.error('Error calculating engagement metrics:', error)
    return {
      bounceRate: 0,
      avgSessionDuration: 0,
      pageViewsPerSession: 0,
      returnVisitorRate: 0,
      conversionEvents: 0,
    }
  }
}

/**
 * Get most popular events
 */
export async function getEventPopularity(daysBack: number = 30): Promise<EventPopularity[]> {
  try {
    const startDate = getStartDate(daysBack)
    const startDateStr = startDate.toISOString().split('T')[0]

    const [pageviews, eventsResult] = await Promise.all([
      fetchPageviews(daysBack),
      supabaseServer
        .from('events')
        .select('id, title, date')
        .eq('is_published', true)
        .gte('date', startDateStr)
        .order('date', { ascending: true })
        .limit(100),
    ])

    if (eventsResult.error) {
      console.error('Error fetching events for popularity:', eventsResult.error)
      return []
    }

    const events = eventsResult.data || []

    return events
      .map((event: any) => {
        const eventSlug = slugifyText(event.title || '')
        const related = pageviews.filter((pv) => {
          const path = pv.path || ''
          return (
            path.includes(`/termine/${event.id}`) ||
            path.includes(`/termine/${eventSlug}`) ||
            path.includes(String(event.id))
          )
        })

        const uniqueSessions = new Set(related.map((entry) => entry.session_hash)).size
        const conversionSessions = new Set(
          related
            .filter((entry) => entry.path.includes('/formulare') || entry.path.includes('/api/event-requests'))
            .map((entry) => entry.session_hash)
        ).size

        return {
          eventId: event.id,
          eventName: event.title,
          eventDate: event.date,
          pageViews: related.length,
          uniqueVisitors: uniqueSessions,
          clickThroughRate: 0,
          conversionRate: related.length > 0 ? Math.round((conversionSessions / related.length) * 100) : 0,
        }
      })
      .filter((event) => event.pageViews > 0 || event.uniqueVisitors > 0)
  } catch (error) {
    console.error('Error getting event popularity:', error)
    return []
  }
}

/**
 * Get performance metrics from Web Vitals tracking
 */
export async function getPerformanceMetrics(daysBack: number = 7): Promise<PerformanceMetrics> {
  try {
    const startDate = getStartDate(daysBack)

    const { data: perfData, error } = await supabaseServer
      .from('performance_metrics')
      .select('data, device_type')
      .gte('created_at', startDate.toISOString())

    if (error) {
      console.error('Error fetching performance metrics:', error)
      return {
        avgPageLoadTime: 0,
        avgFirstContentfulPaint: 0,
        avgLargestContentfulPaint: 0,
        avgCumulativeLayoutShift: 0,
        mobileVsDesktopLoadTime: {
          mobile: 0,
          desktop: 0,
        },
      }
    }

    if (!perfData || perfData.length === 0) {
      return {
        avgPageLoadTime: 0,
        avgFirstContentfulPaint: 0,
        avgLargestContentfulPaint: 0,
        avgCumulativeLayoutShift: 0,
        mobileVsDesktopLoadTime: {
          mobile: 0,
          desktop: 0,
        },
      }
    }

    let totalLoadTime = 0
    let totalFCP = 0
    let totalLCP = 0
    let totalCLS = 0
    let mobileLoadTime = 0
    let desktopLoadTime = 0
    let mobileCount = 0
    let desktopCount = 0

    perfData.forEach((metric: any) => {
      const data = metric.data || {}
      const pageLoadTime = Number(data.pageLoadTime || 0)
      const fcp = Number(data.fcp || 0)
      const lcp = Number(data.lcp || 0)
      const cls = Number(data.cls || 0)

      totalLoadTime += pageLoadTime
      totalFCP += fcp
      totalLCP += lcp
      totalCLS += cls

      if (metric.device_type === 'mobile') {
        mobileLoadTime += pageLoadTime
        mobileCount++
      } else if (metric.device_type === 'desktop') {
        desktopLoadTime += pageLoadTime
        desktopCount++
      }
    })

    const count = perfData.length
    return {
      avgPageLoadTime: Math.round(totalLoadTime / count),
      avgFirstContentfulPaint: Math.round(totalFCP / count),
      avgLargestContentfulPaint: Math.round(totalLCP / count),
      avgCumulativeLayoutShift: Math.round((totalCLS / count) * 1000) / 1000,
      mobileVsDesktopLoadTime: {
        mobile: mobileCount > 0 ? Math.round(mobileLoadTime / mobileCount) : 0,
        desktop: desktopCount > 0 ? Math.round(desktopLoadTime / desktopCount) : 0,
      },
    }
  } catch (error) {
    console.error('Error getting performance metrics:', error)
    return {
      avgPageLoadTime: 0,
      avgFirstContentfulPaint: 0,
      avgLargestContentfulPaint: 0,
      avgCumulativeLayoutShift: 0,
      mobileVsDesktopLoadTime: {
        mobile: 0,
        desktop: 0,
      },
    }
  }
}

/**
 * Get group/class engagement metrics
 */
export async function getGroupEngagement(daysBack: number = 30): Promise<GroupEngagement[]> {
  try {
    const pageviews = await fetchPageviews(daysBack)
    const sessions = buildSessionMap(pageviews)

    const pathDurations = new Map<string, { totalSeconds: number; count: number }>()

    for (const [, session] of sessions) {
      const sorted = [...session.rows].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )

      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i]
        const next = sorted[i + 1]
        const deltaSeconds = Math.max(
          0,
          Math.min(
            1800,
            Math.round(
              (new Date(next.created_at).getTime() - new Date(current.created_at).getTime()) / 1000
            )
          )
        )

        const existing = pathDurations.get(current.path) || { totalSeconds: 0, count: 0 }
        existing.totalSeconds += deltaSeconds
        existing.count += 1
        pathDurations.set(current.path, existing)
      }
    }

    return tiles.map((group) => {
      const matching = pageviews.filter((pv) => (pv.path || '').includes(`/gruppen/${group.slug}`))
      const uniqueVisitors = new Set(matching.map((item) => item.session_hash)).size

      let durationTotal = 0
      let durationCount = 0
      for (const [path, stats] of pathDurations.entries()) {
        if (path.includes(`/gruppen/${group.slug}`)) {
          durationTotal += stats.totalSeconds
          durationCount += stats.count
        }
      }

      const pageViews = matching.length
      const avgTimeOnPage = durationCount > 0 ? Math.round(durationTotal / durationCount) : 0

      return {
        groupId: group.slug,
        groupName: group.title,
        pageViews,
        uniqueVisitors,
        avgTimeOnPage,
        engagementRate: pageViews > 0 ? Math.round((uniqueVisitors / pageViews) * 100) : 0,
      }
    })
  } catch (error) {
    console.error('Error getting group engagement:', error)
    return []
  }
}

/**
 * Calculate traffic sources breakdown
 */
export async function getTrafficSources(daysBack: number = 7): Promise<Record<string, number>> {
  try {
    const pageviews = await fetchPageviews(daysBack)
    const sources: Record<string, number> = {}

    for (const pageview of pageviews) {
      const referrer = (pageview.referrer || '').toLowerCase()

      let source = 'Direct'
      if (!referrer) source = 'Direct'
      else if (referrer.includes('google')) source = 'Google'
      else if (referrer.includes('facebook')) source = 'Facebook'
      else if (referrer.includes('instagram')) source = 'Instagram'
      else if (referrer.includes('youtube')) source = 'YouTube'
      else if (referrer.includes('whatsapp')) source = 'WhatsApp'
      else source = 'Other'

      sources[source] = (sources[source] || 0) + 1
    }

    return sources
  } catch (error) {
    console.error('Error getting traffic sources:', error)
    return {}
  }
}

/**
 * Get user flow/path analysis
 */
export async function getUserFlows(
  daysBack: number = 7
): Promise<Array<{ path: string; nextPage: string; count: number }>> {
  try {
    const pageviews = await fetchPageviews(daysBack)
    const sessions = buildSessionMap(pageviews)
    const transitions = new Map<string, number>()

    for (const [, session] of sessions) {
      const sorted = [...session.rows].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )

      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i]
        const next = sorted[i + 1]

        const delta = new Date(next.created_at).getTime() - new Date(current.created_at).getTime()
        if (delta <= 30 * 60 * 1000) {
          const key = `${current.path}___${next.path}`
          transitions.set(key, (transitions.get(key) || 0) + 1)
        }
      }
    }

    return Array.from(transitions.entries())
      .map(([key, count]) => {
        const [path, nextPage] = key.split('___')
        return { path, nextPage, count }
      })
      .sort((a: { count: number }, b: { count: number }) => b.count - a.count)
      .slice(0, 20) // Top 20 transitions
  } catch (error) {
    console.error('Error getting user flows:', error)
    return []
  }
}
