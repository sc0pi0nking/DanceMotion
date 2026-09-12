'use client'

import { LucideIcon } from 'lucide-react'

interface AdminCardProps {
  title?: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient' | 'stat'
}

export default function AdminCard({
  title,
  description,
  icon: Icon,
  children,
  className = '',
  headerAction,
  padding = 'md',
  variant = 'default',
}: AdminCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  }

  const variantClasses = {
    default: 'adm-panel',
    gradient: 'adm-panel',
    stat: 'adm-panel-2 backdrop-blur',
  }

  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {/* Header */}
      {(title || headerAction) && (
        <div className={`flex items-center justify-between gap-4 ${padding !== 'none' ? 'px-4 md:px-6 py-4' : ''}`} style={padding !== 'none' ? { borderBottom: '1px solid var(--a-border)' } : undefined}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--a-accent-soft)' }}>
                <Icon size={18} style={{ color: 'var(--a-accent)' }} />
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold" style={{ color: 'var(--a-fg)' }}>{title}</h3>}
              {description && <p className="text-sm" style={{ color: 'var(--a-muted)' }}>{description}</p>}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* Content */}
      <div className={paddingClasses[padding]}>{children}</div>
    </div>
  )
}

// Stat Card Subcomponent for Dashboard
interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  sublabel?: string
  trend?: {
    value: number
    positive: boolean
  }
  color?: string
}

export function StatCard({ icon: Icon, label, value, sublabel, trend, color = 'from-teal-500 to-cyan-500' }: StatCardProps) {
  return (
    <div className="adm-panel adm-hoverable p-4 md:p-6 group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon size={20} className="text-white md:hidden" />
          <Icon size={24} className="text-white hidden md:block" />
        </div>
        {trend && (
          <span className={`adm-chip ${trend.positive ? 'adm-chip--success' : 'adm-chip--danger'}`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-bold transition" style={{ color: 'var(--a-fg)' }}>
          {value}
        </p>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--a-muted)' }}>{label}</p>
        {sublabel && <p className="text-xs mt-0.5" style={{ color: 'var(--a-faint)' }}>{sublabel}</p>}
      </div>
    </div>
  )
}
