'use client'

import { X, Loader2 } from 'lucide-react'

export interface BulkAction {
  label: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
  onClick: () => void | Promise<void>
  variant?: 'danger' | 'default'
}

interface BulkActionBarProps {
  count: number
  onClear: () => void
  actions: BulkAction[]
  busy?: boolean
  itemLabel?: string
}

/**
 * Schwebende Aktionsleiste für Mehrfachauswahl (Bulk-Actions).
 * Erscheint nur, wenn mindestens ein Element ausgewählt ist.
 */
export default function BulkActionBar({ count, onClear, actions, busy = false, itemLabel = 'ausgewählt' }: BulkActionBarProps) {
  if (count === 0) return null

  return (
    <div
      role="toolbar"
      aria-label="Aktionen für Auswahl"
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 flex max-w-[calc(100vw-2rem)] flex-wrap items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/95 px-3 py-2 shadow-2xl backdrop-blur sm:gap-3 sm:px-4"
    >
      <span className="text-sm font-semibold text-white whitespace-nowrap">
        {count} {itemLabel}
      </span>

      <div className="h-5 w-px bg-slate-600" aria-hidden />

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          const danger = action.variant === 'danger'
          return (
            <button
              key={action.label}
              type="button"
              disabled={busy}
              onClick={() => void action.onClick()}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                danger
                  ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
              {action.label}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onClear}
        disabled={busy}
        title="Auswahl aufheben"
        aria-label="Auswahl aufheben"
        className="ml-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
      >
        <X size={18} />
      </button>
    </div>
  )
}
