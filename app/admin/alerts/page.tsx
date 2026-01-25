'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AlertsManager from '@/app/components/AlertsManager'

export default function AlertsAdminPage() {
  const [userPermissions, setUserPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkPermissions()
  }, [])

  const checkPermissions = async () => {
    try {
      const res = await fetch('/api/admin/auth/session')
      if (!res.ok) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      const permissions = data.user?.permissions || []
      setUserPermissions(permissions)
      setHasAccess(permissions.includes('alerts_admin'))
    } catch (error) {
      console.error('Permission check failed:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4 text-center">
          <p className="text-red-700 dark:text-red-400 font-semibold">
            Du hast keine Berechtigung für Alerts-Verwaltung
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <AlertsManager />
    </div>
  )
}
