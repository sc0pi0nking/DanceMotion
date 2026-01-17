import { getAdminUserWithPermissions, PERMISSIONS } from '@/lib/auth'
import { supabaseServer } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvHeaders = headers.map(h => `"${h}"`).join(',')

  const csvRows = data.map(row => {
    return headers
      .map(header => {
        const value = row[header]
        if (value === null || value === undefined) return '""'
        if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        return `"${String(value).replace(/"/g, '""')}"`
      })
      .join(',')
  })

  return [csvHeaders, ...csvRows].join('\n')
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAdminUserWithPermissions()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permission
    if (!user.permissions.includes(PERMISSIONS.AUDIT)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const action = searchParams.get('action')
    const targetType = searchParams.get('targetType')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const offset = (page - 1) * pageSize

    // Build query
    let query = supabaseServer
      .from('admin_audit_log')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (action) {
      query = query.eq('action', action)
    }

    if (targetType) {
      query = query.eq('target_type', targetType)
    }

    if (startDate) {
      query = query.gte('created_at', new Date(startDate).toISOString())
    }

    if (endDate) {
      query = query.lte('created_at', new Date(endDate).toISOString())
    }

    // Apply pagination
    query = query.range(offset, offset + pageSize - 1)

    // Check if export format requested
    const format = searchParams.get('format') // 'csv' or 'json'

    if (format === 'csv' || format === 'json') {
      // Get all logs for export (no pagination)
      let exportQuery = supabaseServer
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })

      if (action) exportQuery = exportQuery.eq('action', action)
      if (targetType) exportQuery = exportQuery.eq('target_type', targetType)
      if (startDate) exportQuery = exportQuery.gte('created_at', new Date(startDate).toISOString())
      if (endDate) exportQuery = exportQuery.lte('created_at', new Date(endDate).toISOString())

      const { data: exportData, error: exportError } = await exportQuery

      if (exportError) {
        return NextResponse.json({ error: 'Export failed' }, { status: 500 })
      }

      if (format === 'csv') {
        const csv = convertToCSV(exportData || [])
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`,
          },
        })
      }

      if (format === 'json') {
        return new NextResponse(JSON.stringify(exportData, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.json"`,
          },
        })
      }
    }

    const { data, count, error } = await query

    if (error) {
      console.error('Audit log query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch audit logs' },
        { status: 500 }
      )
    }

    // Transform data for display
    const transformedData = data.map((log: any) => ({
      id: log.id,
      userId: log.user_id,
      action: log.action,
      targetType: log.target_type,
      targetId: log.target_id,
      details: log.details,
      ipAddress: log.ip_address,
      createdAt: log.created_at,
    }))

    return NextResponse.json({
      data: transformedData,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    })
  } catch (error) {
    console.error('Audit API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
