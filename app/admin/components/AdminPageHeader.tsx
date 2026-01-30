'use client'

import Link from 'next/link'
import { ChevronRight, LucideIcon } from 'lucide-react'

interface Breadcrumb {
  label: string
  href?: string
}

interface Action {
  label: string
  icon?: LucideIcon
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

interface AdminPageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  breadcrumbs?: Breadcrumb[]
  actions?: Action[]
  children?: React.ReactNode
}

export default function AdminPageHeader({
  title,
  description,
  icon: Icon,
  breadcrumbs,
  actions,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-3">
          <Link href="/admin" className="hover:text-white transition">
            Admin
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <ChevronRight size={14} className="text-slate-600" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white transition">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-300">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Description */}
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="hidden sm:flex w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 items-center justify-center flex-shrink-0">
              <Icon size={24} className="text-teal-400" />
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
            {description && (
              <p className="text-slate-400 text-sm md:text-base mt-1">{description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {actions.map((action, index) => {
              const baseClasses = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition text-sm"
              const variantClasses = {
                primary: "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/30",
                secondary: "bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600",
                danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30",
              }
              const disabledClasses = action.disabled ? "opacity-50 cursor-not-allowed" : ""
              
              const className = `${baseClasses} ${variantClasses[action.variant || 'primary']} ${disabledClasses}`

              if (action.href) {
                return (
                  <Link key={index} href={action.href} className={className}>
                    {action.icon && <action.icon size={18} />}
                    <span className="hidden sm:inline">{action.label}</span>
                  </Link>
                )
              }

              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={className}
                >
                  {action.icon && <action.icon size={18} />}
                  <span className="hidden sm:inline">{action.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Additional Content (filters, tabs, etc.) */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
