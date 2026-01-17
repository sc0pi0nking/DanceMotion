import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'

// GET: Fetch analytics data for dashboard
export async function GET(req: NextRequest) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.ANALYTICS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const range = searchParams.get('range') || '7' // Default 7 days
    const daysBack = parseInt(range, 10)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    const startDateStr = startDate.toISOString().split('T')[0]

    // 1. Aggregate current day data first (might not be in daily table yet)
    await supabaseServer.rpc('aggregate_daily_analytics')

    // 2. Fetch daily aggregates
    const { data: dailyData, error: dailyError } = await supabaseServer
      .from('analytics_daily')
      .select('*')
      .gte('date', startDateStr)
      .order('date', { ascending: true })

    if (dailyError) {
      console.error('Error fetching daily analytics:', dailyError)
    }

    // 3. Calculate totals
    const totals = {
      pageViews: 0,
      uniqueVisitors: 0,
      desktop: 0,
      mobile: 0,
      tablet: 0,
    }

    const chartData: { date: string; views: number; visitors: number }[] = []

    if (dailyData) {
      dailyData.forEach((day) => {
        totals.pageViews += day.page_views || 0
        totals.uniqueVisitors += day.unique_visitors || 0
        totals.desktop += day.desktop_visits || 0
        totals.mobile += day.mobile_visits || 0
        totals.tablet += day.tablet_visits || 0

        chartData.push({
          date: day.date,
          views: day.page_views || 0,
          visitors: day.unique_visitors || 0,
        })
      })
    }

    // 4. Calculate top pages across period
    const topPagesMap = new Map<string, number>()
    dailyData?.forEach((day) => {
      const pages = day.top_pages as Array<{ path: string; views: number }> || []
      pages.forEach((p) => {
        topPagesMap.set(p.path, (topPagesMap.get(p.path) || 0) + p.views)
      })
    })
    const topPages = Array.from(topPagesMap.entries())
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // 5. Calculate top referrers
    const referrerMap = new Map<string, number>()
    dailyData?.forEach((day) => {
      const refs = day.referrer_sources as Array<{ referrer: string; count: number }> || []
      refs.forEach((r) => {
        referrerMap.set(r.referrer, (referrerMap.get(r.referrer) || 0) + r.count)
      })
    })
    const topReferrers = Array.from(referrerMap.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // 6. Device breakdown percentages
    const totalDevices = totals.desktop + totals.mobile + totals.tablet
    const devices = {
      desktop: totalDevices > 0 ? Math.round((totals.desktop / totalDevices) * 100) : 0,
      mobile: totalDevices > 0 ? Math.round((totals.mobile / totalDevices) * 100) : 0,
      tablet: totalDevices > 0 ? Math.round((totals.tablet / totalDevices) * 100) : 0,
    }

    // 7. Live visitors (last 5 minutes - approximation)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { count: liveVisitors } = await supabaseServer
      .from('analytics_pageviews')
      .select('session_hash', { count: 'exact', head: true })
      .gte('created_at', fiveMinutesAgo)

    return NextResponse.json({
      totals: {
        pageViews: totals.pageViews,
        uniqueVisitors: totals.uniqueVisitors,
        liveVisitors: liveVisitors || 0,
      },
      chartData,
      topPages,
      topReferrers,
      devices,
    })
  } catch (error) {
    console.error('Analytics GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
