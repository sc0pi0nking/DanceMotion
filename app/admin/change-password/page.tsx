'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Check, X, Lock, Shield } from 'lucide-react'

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [requirements, setRequirements] = useState<string[]>([])
  const [minLength, setMinLength] = useState(8)
  const [requireSpecialChars, setRequireSpecialChars] = useState(true)
  const router = useRouter()

  // Fetch password requirements
  useEffect(() => {
    fetch('/api/admin/auth/change-password')
      .then(res => res.json())
      .then(data => {
        setRequirements(data.requirements || [])
        setMinLength(data.min_password_length || 8)
        setRequireSpecialChars(data.require_special_chars ?? true)
      })
      .catch(() => {
        setRequirements([
          'Mindestens 8 Zeichen',
          'Mindestens ein Großbuchstabe',
          'Mindestens ein Kleinbuchstabe',
          'Mindestens eine Zahl',
          'Mindestens ein Sonderzeichen',
        ])
      })
  }, [])

  // Password validation checks
  const checks = {
    length: newPassword.length >= minLength,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: !requireSpecialChars || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
    match: newPassword === confirmPassword && confirmPassword.length > 0,
  }

  const allValid = Object.values(checks).every(Boolean)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setErrors([])

    if (!allValid) {
      setError('Bitte erfülle alle Passwort-Anforderungen')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, confirmPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Fehler beim Ändern des Passworts')
        if (data.details) {
          setErrors(data.details)
        }
        setLoading(false)
        return
      }

      // Success - redirect to admin dashboard
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Ein Fehler ist aufgetreten')
      setLoading(false)
    }
  }

  const CheckItem = ({ valid, text }: { valid: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-sm ${valid ? 'text-green-400' : 'text-slate-400'}`}>
      {valid ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <X className="w-4 h-4 text-slate-500" />
      )}
      {text}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Passwort ändern</h1>
            <p className="text-slate-400 text-sm">
              Dein Konto erfordert ein neues Passwort. Bitte wähle ein sicheres Passwort.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Neues Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Passwort bestätigen
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements Checklist */}
            <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-slate-300 mb-3">Passwort-Anforderungen:</p>
              <CheckItem valid={checks.length} text={`Mindestens ${minLength} Zeichen`} />
              <CheckItem valid={checks.uppercase} text="Mindestens ein Großbuchstabe" />
              <CheckItem valid={checks.lowercase} text="Mindestens ein Kleinbuchstabe" />
              <CheckItem valid={checks.number} text="Mindestens eine Zahl" />
              {requireSpecialChars && (
                <CheckItem valid={checks.special} text="Mindestens ein Sonderzeichen" />
              )}
              <div className="pt-2 border-t border-slate-600 mt-2">
                <CheckItem valid={checks.match} text="Passwörter stimmen überein" />
              </div>
            </div>

            {/* Error Messages */}
            {(error || errors.length > 0) && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {errors.length > 0 && (
                  <ul className="text-red-400 text-sm list-disc list-inside mt-1">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !allValid}
              className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? 'Wird gespeichert...' : 'Passwort ändern'}
            </button>
          </form>

          {/* Info */}
          <p className="mt-6 text-center text-slate-500 text-xs">
            Diese Änderung ist erforderlich, um dein Konto zu schützen.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
