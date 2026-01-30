'use client'

import { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

// Text Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: LucideIcon
}

export const AdminInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
        <div className="relative">
          {Icon && (
            <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 bg-slate-700 border rounded-lg text-white placeholder-slate-400
              focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition
              ${Icon ? 'pl-10' : ''}
              ${error ? 'border-red-500' : 'border-slate-600'}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    )
  }
)
AdminInput.displayName = 'AdminInput'

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const AdminTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-2.5 bg-slate-700 border rounded-lg text-white placeholder-slate-400
            focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition resize-none
            ${error ? 'border-red-500' : 'border-slate-600'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    )
  }
)
AdminTextarea.displayName = 'AdminTextarea'

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const AdminSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
        <select
          ref={ref}
          className={`
            w-full px-4 py-2.5 bg-slate-700 border rounded-lg text-white
            focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition
            ${error ? 'border-red-500' : 'border-slate-600'}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    )
  }
)
AdminSelect.displayName = 'AdminSelect'

// Checkbox
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
}

export const AdminCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', ...props }, ref) => {
    return (
      <label className={`flex items-start gap-3 cursor-pointer ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          className="w-5 h-5 mt-0.5 rounded bg-slate-700 border-slate-600 text-teal-500 focus:ring-teal-500 focus:ring-offset-0 cursor-pointer"
          {...props}
        />
        <div>
          <span className="text-sm font-medium text-white">{label}</span>
          {description && <p className="text-sm text-slate-400 mt-0.5">{description}</p>}
        </div>
      </label>
    )
  }
)
AdminCheckbox.displayName = 'AdminCheckbox'

// Toggle Switch
interface ToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function AdminToggle({ label, description, checked, onChange, disabled }: ToggleProps) {
  return (
    <label className={`flex items-center justify-between gap-4 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div>
        <span className="text-sm font-medium text-white">{label}</span>
        {description && <p className="text-sm text-slate-400">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
          checked ? 'bg-teal-500' : 'bg-slate-600'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  )
}

// Form Group (for layout)
interface FormGroupProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4
  className?: string
}

export function FormGroup({ children, cols = 2, className = '' }: FormGroupProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return <div className={`grid ${colClasses[cols]} gap-4 ${className}`}>{children}</div>
}
