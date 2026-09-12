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
        <nav className="flex items-center gap-1.5 text-sm mb-3" style={{ color: 'var(--a-muted)' }}>
          <Link href="/admin" className="transition hover:opacity-80">
            Admin
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <ChevronRight size={14} style={{ color: 'var(--a-faint)' }} />
              {crumb.href ? (
                <Link href={crumb.href} className="transition hover:opacity-80">
                  {crumb.label}
                </Link>
              ) : (
                <span style={{ color: 'var(--a-fg)' }}>{crumb.label}</span>
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
            <div className="hidden sm:flex w-12 h-12 rounded-xl items-center justify-center flex-shrink-0" style={{ background: 'var(--a-accent-soft)', border: '1px solid var(--a-accent-line)' }}>
              <Icon size={24} style={{ color: 'var(--a-accent)' }} />
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--a-fg)' }}>{title}</h1>
            {description && (
              <p className="text-sm md:text-base mt-1" style={{ color: 'var(--a-muted)' }}>{description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {actions.map((action, index) => {
              const baseClasses = "adm-btn"
              const variantClasses = {
                primary: "adm-btn--primary",
                secondary: "adm-btn--secondary",
                danger: "adm-btn--danger",
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
