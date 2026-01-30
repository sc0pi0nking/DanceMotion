import { supabaseServer } from './supabase'

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

/**
 * Calculate user engagement metrics
 */
export async function getEngagementMetrics(daysBack: number = 7): Promise<EngagementMetrics> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    const startDateStr = startDate.toISOString().split('T')[0]

    // Fetch session data
    const { data: sessions, error } = await supabaseServer.rpc('get_session_metrics', {
      p_start_date: startDateStr,
    })

    if (error) {
      console.error('Error fetching session metrics:', error)
      return {
        bounceRate: 0,
        avgSessionDuration: 0,
        pageViewsPerSession: 0,
        returnVisitorRate: 0,
        conversionEvents: 0,
      }
    }

    // Calculate metrics from sessions
    let totalSessions = 0
    let singlePageSessions = 0
    let totalSessionDuration = 0
    let totalPageViews = 0
    let returningVisitors = 0
    let uniqueSessionIds = new Set<string>()
    let conversionCount = 0

    if (sessions) {
      sessions.forEach((session: any) => {
        totalSessions++
        uniqueSessionIds.add(session.session_hash)
        totalSessionDuration += session.session_duration || 0
        totalPageViews += session.page_count || 1

        if ((session.page_count || 1) === 1) {
          singlePageSessions++
        }

        if (session.visit_count > 1) {
          returningVisitors++
        }

        if (session.conversion_event) {
          conversionCount++
        }
      })
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
          ? Math.round((totalPageViews / totalSessions) * 10) / 10
          : 0,
      returnVisitorRate:
        uniqueSessionIds.size > 0
          ? Math.round((returningVisitors / uniqueSessionIds.size) * 100)
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
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    const startDateStr = startDate.toISOString().split('T')[0]

    // Fetch event pageview data
    const { data: eventData, error } = await supabaseServer.rpc('get_event_popularity', {
      p_start_date: startDateStr,
    })

    if (error) {
      console.error('Error fetching event popularity:', error)
      return []
    }

    if (!eventData) return []

    return eventData.map((event: any) => ({
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      pageViews: event.page_views || 0,
      uniqueVisitors: event.unique_visitors || 0,
      clickThroughRate: event.page_views > 0 ? Math.round((event.ctr_clicks / event.page_views) * 100) : 0,
      conversionRate: event.page_views > 0 ? Math.round((event.conversions / event.page_views) * 100) : 0,
    }))
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
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    const startDateStr = startDate.toISOString().split('T')[0]

    // Fetch performance data
    const { data: perfData, error } = await supabaseServer.rpc('get_performance_metrics', {
      p_start_date: startDateStr,
    })

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
      totalLoadTime += metric.page_load_time || 0
      totalFCP += metric.fcp || 0
      totalLCP += metric.lcp || 0
      totalCLS += metric.cls || 0

      if (metric.device_type === 'mobile') {
        mobileLoadTime += metric.page_load_time || 0
        mobileCount++
      } else if (metric.device_type === 'desktop') {
        desktopLoadTime += metric.page_load_time || 0
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
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    const startDateStr = startDate.toISOString().split('T')[0]

    // Fetch group engagement data
    const { data: groupData, error } = await supabaseServer.rpc('get_group_engagement', {
      p_start_date: startDateStr,
    })

    if (error) {
      console.error('Error fetching group engagement:', error)
      return []
    }

    if (!groupData) return []

    return groupData.map((group: any) => ({
      groupId: group.id,
      groupName: group.name,
      pageViews: group.page_views || 0,
      uniqueVisitors: group.unique_visitors || 0,
      avgTimeOnPage: group.avg_time_on_page || 0,
      engagementRate:
        group.page_views > 0
          ? Math.round((group.unique_visitors / group.page_views) * 100)
          : 0,
    }))
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
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    const startDateStr = startDate.toISOString().split('T')[0]

    const { data: referrerData, error } = await supabaseServer.rpc('get_traffic_sources', {
      p_start_date: startDateStr,
    })

    if (error) {
      console.error('Error fetching traffic sources:', error)
      return {}
    }

    const sources: Record<string, number> = {}
    if (referrerData) {
      referrerData.forEach((item: any) => {
        sources[item.source] = item.count || 0
      })
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
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    const startDateStr = startDate.toISOString().split('T')[0]

    const { data: flowData, error } = await supabaseServer.rpc('get_user_flows', {
      p_start_date: startDateStr,
    })

    if (error) {
      console.error('Error fetching user flows:', error)
      return []
    }

    if (!flowData) return []

    return flowData
      .map((flow: any) => ({
        path: flow.current_page,
        nextPage: flow.next_page,
        count: flow.transition_count || 0,
      }))
      .sort((a: { count: number }, b: { count: number }) => b.count - a.count)
      .slice(0, 20) // Top 20 transitions
  } catch (error) {
    console.error('Error getting user flows:', error)
    return []
  }
}
