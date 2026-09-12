'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  footer?: React.ReactNode
}

export default function AdminModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  footer,
}: AdminModalProps) {
  // Escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`dm-admin relative adm-panel shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col adm-fade-in`}
        style={{ background: 'var(--a-surface-2)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-4 md:p-6" style={{ borderBottom: '1px solid var(--a-border)' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--a-fg)' }}>{title}</h2>
            {description && <p className="text-sm mt-1" style={{ color: 'var(--a-muted)' }}>{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="adm-btn adm-btn--ghost !p-2 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 md:p-6" style={{ borderTop: '1px solid var(--a-border)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// Button components for modal footer
export function ModalCancelButton({ onClick, children = 'Abbrechen' }: { onClick: () => void; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="adm-btn adm-btn--secondary"
    >
      {children}
    </button>
  )
}

export function ModalConfirmButton({
  onClick,
  children = 'Speichern',
  variant = 'primary',
  disabled = false,
  loading = false,
}: {
  onClick?: () => void
  children?: React.ReactNode
  variant?: 'primary' | 'danger'
  disabled?: boolean
  loading?: boolean
}) {
  const variantClasses = {
    primary: 'adm-btn--primary',
    danger: 'adm-btn--danger',
  }

  return (
    <button
      type={onClick ? 'button' : 'submit'}
      onClick={onClick}
      disabled={disabled || loading}
      className={`adm-btn ${variantClasses[variant]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading && <div className="w-4 h-4 adm-spinner" />}
      {children}
    </button>
  )
}
