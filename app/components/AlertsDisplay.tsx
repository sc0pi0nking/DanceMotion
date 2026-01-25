'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface Alert {
  id: string
  title: string
  message: string
  alert_type: 'info' | 'warning' | 'error' | 'success'
  priority: number
  is_dismissible: boolean
  start_date: string
  end_date: string
}

const alertTypeConfig = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-l-4 border-blue-500',
    text: 'text-blue-900 dark:text-blue-100',
    icon: Info,
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-l-4 border-yellow-500',
    text: 'text-yellow-900 dark:text-yellow-100',
    icon: AlertTriangle,
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-l-4 border-red-500',
    text: 'text-red-900 dark:text-red-100',
    icon: AlertCircle,
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-l-4 border-green-500',
    text: 'text-green-900 dark:text-green-100',
    icon: CheckCircle,
  },
}

export default function AlertsDisplay() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load dismissed alerts from localStorage
    const stored = localStorage.getItem('dismissed_alerts')
    if (stored) {
      setDismissedAlerts(new Set(JSON.parse(stored)))
    }

    // Fetch active alerts
    loadAlerts()

    // Refresh alerts every 5 minutes
    const interval = setInterval(loadAlerts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  async function loadAlerts() {
    try {
      const res = await fetch('/api/alerts')
      if (res.ok) {
        const data = await res.json()
        setAlerts(data)
      }
    } catch (error) {
      console.error('Failed to load alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const dismissAlert = (alertId: string) => {
    const newDismissed = new Set(dismissedAlerts)
    newDismissed.add(alertId)
    setDismissedAlerts(newDismissed)
    localStorage.setItem('dismissed_alerts', JSON.stringify(Array.from(newDismissed)))
  }

  // Filter to show only active, undismissed alerts
  const visibleAlerts = alerts.filter(alert => {
    const isDismissed = dismissedAlerts.has(alert.id)
    const isDismissible = alert.is_dismissible
    return !isDismissed || !isDismissible
  })

  // Sort by priority (highest first)
  visibleAlerts.sort((a, b) => b.priority - a.priority)

  if (loading || visibleAlerts.length === 0) {
    return null
  }

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-full mx-auto space-y-3 max-h-[70vh] overflow-y-auto px-4">
      {visibleAlerts.map((alert) => {
        const config = alertTypeConfig[alert.alert_type]
        const IconComponent = config.icon

        return (
          <div
            key={alert.id}
            className={`${config.bg} ${config.border} ${config.text} p-4 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2 duration-300`}
            role="alert"
          >
            <div className="flex items-start gap-3">
              <IconComponent size={24} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm mb-1">{alert.title}</h3>
                <p className="text-sm opacity-90 mb-2">{alert.message}</p>
              </div>
              {alert.is_dismissible && (
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="flex-shrink-0 ml-2 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition"
                  aria-label="Alert schließen"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
