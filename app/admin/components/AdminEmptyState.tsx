'use client'

import { LucideIcon, FolderOpen } from 'lucide-react'

interface AdminEmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
}

export default function AdminEmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  action,
}: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--a-surface-3)', border: '1px solid var(--a-border)' }}>
        <Icon size={32} style={{ color: 'var(--a-faint)' }} />
      </div>
      <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--a-fg)' }}>{title}</h3>
      {description && <p className="text-sm mb-6 max-w-md" style={{ color: 'var(--a-muted)' }}>{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="adm-btn adm-btn--primary"
        >
          {action.icon && <action.icon size={18} />}
          {action.label}
        </button>
      )}
    </div>
  )
}
