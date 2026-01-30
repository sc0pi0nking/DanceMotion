'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import TicketsManager from '@/app/components/TicketsManager'
import { AdminPageHeader, AdminLoadingState } from '../components'

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
    return <AdminLoadingState message="Berechtigungen werden geprüft..." fullPage />
  }

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Support Tickets"
          icon={MessageSquare}
          breadcrumbs={[{ label: 'Tickets' }]}
        />
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400 font-medium">
            Du hast keine Berechtigung für diesen Bereich
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Support Tickets"
        description="Verwalte anonyme Anfragen und Tickets von Benutzern"
        icon={MessageSquare}
        breadcrumbs={[{ label: 'Tickets' }]}
      />
      <TicketsManager />
    </div>
  )
}
