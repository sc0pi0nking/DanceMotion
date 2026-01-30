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
    default: 'bg-slate-800 border-slate-700',
    gradient: 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700',
    stat: 'bg-slate-800/50 backdrop-blur border-slate-700/50',
  }

  return (
    <div
      className={`
        border rounded-xl
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {/* Header */}
      {(title || headerAction) && (
        <div className={`flex items-center justify-between gap-4 ${padding !== 'none' ? 'px-4 md:px-6 py-4 border-b border-slate-700' : ''}`}>
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-teal-400" />
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-white">{title}</h3>}
              {description && <p className="text-sm text-slate-400">{description}</p>}
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
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 md:p-6 hover:border-slate-600 transition group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon size={20} className="text-white md:hidden" />
          <Icon size={24} className="text-white hidden md:block" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl md:text-3xl font-bold text-white group-hover:text-teal-400 transition">
          {value}
        </p>
        <p className="text-sm font-medium text-slate-300 mt-1">{label}</p>
        {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
      </div>
    </div>
  )
}
