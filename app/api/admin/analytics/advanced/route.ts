import { NextRequest, NextResponse } from 'next/server'
import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import {
  getEngagementMetrics,
  getEventPopularity,
  getPerformanceMetrics,
  getGroupEngagement,
} from '@/lib/advanced-analytics'

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getAdminUserWithPermissions()
    if (!currentUser || !currentUser.permissions.includes(PERMISSIONS.ANALYTICS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '7', 10)

    // Fetch all advanced metrics in parallel
    const [engagement, events, performance, groups] = await Promise.all([
      getEngagementMetrics(days),
      getEventPopularity(days * 4), // Events span is longer
      getPerformanceMetrics(days),
      getGroupEngagement(days * 4),
    ])

    return NextResponse.json({
      engagement,
      events,
      performance,
      groups,
    })
  } catch (error) {
    console.error('Error fetching advanced analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
