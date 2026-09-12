'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react'

interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  className?: string
  render?: (item: T, index: number) => React.ReactNode
}

interface AdminTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyField: keyof T
  loading?: boolean
  emptyMessage?: string
  searchable?: boolean
  searchPlaceholder?: string
  searchFields?: (keyof T)[]
  pagination?: boolean
  pageSize?: number
  selectable?: boolean
  selectedIds?: Set<string>
  onSelectionChange?: (selected: Set<string>) => void
  onRowClick?: (item: T) => void
  actions?: (item: T) => React.ReactNode
  stickyHeader?: boolean
}

export default function AdminTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  loading = false,
  emptyMessage = 'Keine Daten vorhanden',
  searchable = false,
  searchPlaceholder = 'Suchen...',
  searchFields = [],
  pagination = true,
  pageSize = 10,
  selectable = false,
  selectedIds,
  onSelectionChange,
  onRowClick,
  actions,
  stickyHeader = false,
}: AdminTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter & Search
  const filteredData = useMemo(() => {
    if (!searchTerm || searchFields.length === 0) return data

    const term = searchTerm.toLowerCase()
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term)
        }
        if (typeof value === 'number') {
          return value.toString().includes(term)
        }
        return false
      })
    )
  }, [data, searchTerm, searchFields])

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]

      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      const comparison = aVal < bVal ? -1 : 1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData

  // Handle sort click
  const handleSort = (key: string) => {
    if (sortField === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(key)
      setSortDirection('asc')
    }
  }

  // Handle selection
  const handleSelectAll = () => {
    if (!onSelectionChange || !selectedIds) return

    if (selectedIds.size === paginatedData.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(paginatedData.map((item) => String(item[keyField]))))
    }
  }

  const handleSelectRow = (id: string) => {
    if (!onSelectionChange || !selectedIds) return

    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    onSelectionChange(newSelected)
  }

  // Loading State
  if (loading) {
    return (
      <div className="adm-panel p-8">
        <div className="flex items-center justify-center">
          <div className="adm-spinner h-8 w-8" />
        </div>
      </div>
    )
  }

  return (
    <div className="adm-panel overflow-hidden">
      {/* Search Bar */}
      {searchable && (
        <div className="p-4" style={{ borderBottom: '1px solid var(--a-border)' }}>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--a-faint)' }} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="adm-input pl-10"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="adm-table">
          <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
            <tr>
              {selectable && (
                <th className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds?.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: 'var(--a-accent)' }}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`${col.sortable ? 'cursor-pointer' : ''} ${col.className || ''}`}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {col.sortable && sortField === col.key && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="text-right">Aktionen</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="py-12 text-center"
                  style={{ color: 'var(--a-muted)' }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={String(item[keyField])}
                  className={`
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  style={selectedIds?.has(String(item[keyField])) ? { background: 'var(--a-accent-soft)' } : undefined}
                  onClick={() => onRowClick?.(item)}
                >
                  {selectable && (
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds?.has(String(item[keyField])) || false}
                        onChange={() => handleSelectRow(String(item[keyField]))}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: 'var(--a-accent)' }}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={String(col.key)} className={col.className || ''} style={{ color: 'var(--a-muted)' }}>
                      {col.render ? col.render(item, index) : String(item[col.key as keyof T] ?? '')}
                    </td>
                  ))}
                  {actions && (
                    <td className="text-right" onClick={(e) => e.stopPropagation()}>
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--a-border)' }}>
          <p className="text-sm" style={{ color: 'var(--a-muted)' }}>
            {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, sortedData.length)} von {sortedData.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="adm-btn adm-btn--ghost !p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number
              if (totalPages <= 5) {
                page = i + 1
              } else if (currentPage <= 3) {
                page = i + 1
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i
              } else {
                page = currentPage - 2 + i
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition ${currentPage === page ? 'adm-btn--primary' : 'adm-btn--ghost'} adm-btn !p-0`}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="adm-btn adm-btn--ghost !p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
