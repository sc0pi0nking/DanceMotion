'use client'

import { getAdminSession } from '@/lib/auth'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Filter, X, Download, AlertCircle } from 'lucide-react'

interface AuditLog {
  id: string
  userId: string
  action: string
  targetType: string
  targetId: string | null
  details: any
  ipAddress: string | null
  createdAt: string
}

interface PaginationInfo {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-100 text-green-800',
  update: 'bg-blue-100 text-blue-800',
  delete: 'bg-red-100 text-red-800',
  login: 'bg-purple-100 text-purple-800',
  logout: 'bg-gray-100 text-gray-800',
  permission_change: 'bg-yellow-100 text-yellow-800',
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Filter states
  const [showFilters, setShowFilters] = useState(false)
  const [actionFilter, setActionFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [exporting, setExporting] = useState(false)

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      setExporting(true)
      const params = new URLSearchParams({
        format,
      })

      if (actionFilter) params.append('action', actionFilter)
      if (typeFilter) params.append('targetType', typeFilter)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const res = await fetch(`/api/admin/audit?${params}`)
      
      if (!res.ok) {
        throw new Error('Export failed')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Export failed')
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [pagination.page, actionFilter, typeFilter, startDate, endDate])

  async function fetchLogs() {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
      })

      if (actionFilter) params.append('action', actionFilter)
      if (typeFilter) params.append('targetType', typeFilter)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const res = await fetch(`/api/admin/audit?${params}`)

      if (!res.ok) {
        throw new Error('Failed to fetch audit logs')
      }

      const { data, pagination: newPagination } = await res.json()
      setLogs(data)
      setPagination(newPagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  function clearFilters() {
    setActionFilter('')
    setTypeFilter('')
    setStartDate('')
    setEndDate('')
    setPagination({ ...pagination, page: 1 })
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const hasActiveFilters =
    actionFilter || typeFilter || startDate || endDate

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-gray-600 mt-1">
            Alle Aktivitäten und Änderungen im System
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg transition"
          >
            <Download size={18} />
            CSV Export
          </button>
          <button
            onClick={() => handleExport('json')}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition"
          >
            <Download size={18} />
            JSON Export
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
          >
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Action Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Aktion
              </label>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value)
                  setPagination({ ...pagination, page: 1 })
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Alle Aktionen</option>
                <option value="create">Erstellt</option>
                <option value="update">Aktualisiert</option>
                <option value="delete">Gelöscht</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="permission_change">Berechtigung geändert</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Typ</label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value)
                  setPagination({ ...pagination, page: 1 })
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Alle Typen</option>
                <option value="user">Benutzer</option>
                <option value="role">Rolle</option>
                <option value="content">Inhalt</option>
                <option value="event">Termin</option>
                <option value="faq">FAQ</option>
                <option value="document">Dokument</option>
                <option value="gallery">Galerie</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Von (Datum)
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setPagination({ ...pagination, page: 1 })
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Bis (Datum)
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setPagination({ ...pagination, page: 1 })
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
            >
              <X size={16} />
              Filter zurücksetzen
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Lädt...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Keine Audit Logs gefunden
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Zeitpunkt
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Aktion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Typ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Benutzer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      IP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            ACTION_COLORS[log.action] ||
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {log.action
                            .replace(/_/g, ' ')
                            .charAt(0)
                            .toUpperCase() +
                            log.action
                              .replace(/_/g, ' ')
                              .slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {log.targetType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400">
                        {log.targetId
                          ? log.targetId.substring(0, 8) + '...'
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400">
                        {log.userId.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400">
                        {log.ipAddress || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        <details className="cursor-pointer">
                          <summary className="hover:text-gray-900 dark:hover:text-gray-200">
                            Details
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 dark:bg-slate-900 rounded text-xs overflow-auto max-h-48">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 dark:bg-slate-700 border-t border-gray-200 dark:border-slate-600 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Zeige {logs.length} von {pagination.total} Einträgen (Seite{' '}
                {pagination.page} von {pagination.totalPages})
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: Math.max(1, pagination.page - 1),
                    })
                  }
                  disabled={pagination.page === 1}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-sm font-medium">
                  {pagination.page} / {pagination.totalPages}
                </div>
                <button
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: Math.min(
                        pagination.totalPages,
                        pagination.page + 1
                      ),
                    })
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
