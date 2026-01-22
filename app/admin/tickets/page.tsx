'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TicketsManager from '@/app/components/TicketsManager'

export default function AdminTicketsPage() {
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
      setHasAccess(permissions.includes('tickets_admin'))
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
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-800 dark:text-red-400 font-medium">
            Du hast keine Berechtigung für diesen Bereich
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Support Tickets</h1>
        <p className="text-muted">Verwalte anonyme Anfragen und Tickets von Benutzern</p>
      </div>

      <TicketsManager />
    </div>
  )
}
