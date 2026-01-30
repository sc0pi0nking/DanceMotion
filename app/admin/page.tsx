'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, FileText, Clock, TrendingUp, Activity, LayoutDashboard, ArrowRight, Users, Images } from 'lucide-react'
import { AdminPageHeader, AdminCard, StatCard, AdminLoadingState } from './components'

interface Stats {
  upcomingEvents: number
  totalEvents: number
  contentItems: number
  teamMembers: number
  galleryItems: number
  lastUpdated: string
}

interface AuditLog {
  id: string
  action: string
  user_id: string
  user_name?: string
  target_type: string
  target_id: string
  created_at: string
}

interface QuickAction {
  title: string
  description: string
  href: string
  icon: typeof Calendar
  color: string
  bgColor: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    upcomingEvents: 0,
    totalEvents: 0,
    contentItems: 0,
    teamMembers: 0,
    galleryItems: 0,
    lastUpdated: '',
  })
  const [recentActivity, setRecentActivity] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
    loadRecentActivity()
  }, [])

  const loadStats = async () => {
    try {
      const [eventsRes, contentRes, teamRes, galleryRes] = await Promise.all([
        fetch('/api/admin/events'),
        fetch('/api/admin/content'),
        fetch('/api/team'),
        fetch('/api/gallery'),
      ])

      const events = eventsRes.ok ? await eventsRes.json() : []
      const content = contentRes.ok ? await contentRes.json() : []
      const team = teamRes.ok ? await teamRes.json() : []
      const gallery = galleryRes.ok ? await galleryRes.json() : { albums: [] }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const upcomingCount = Array.isArray(events) 
        ? events.filter((e: any) => new Date(e.date) >= today).length 
        : 0

      setStats({
        upcomingEvents: upcomingCount,
        totalEvents: Array.isArray(events) ? events.length : 0,
        contentItems: Array.isArray(content) ? content.length : 0,
        teamMembers: Array.isArray(team) ? team.length : 0,
        galleryItems: gallery.albums?.length || 0,
        lastUpdated: new Date().toLocaleString('de-DE'),
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecentActivity = async () => {
    try {
      const res = await fetch('/api/admin/audit?limit=8')
      const data = await res.json()
      if (data.data) {
        setRecentActivity(data.data)
      }
    } catch (error) {
      console.error('Failed to load recent activity:', error)
    }
  }

  const getActionLabel = (action: string): { emoji: string; label: string; color: string } => {
    const labels: Record<string, { emoji: string; label: string; color: string }> = {
      create: { emoji: '✨', label: 'Erstellt', color: 'text-green-400' },
      update: { emoji: '✏️', label: 'Aktualisiert', color: 'text-blue-400' },
      delete: { emoji: '🗑️', label: 'Gelöscht', color: 'text-red-400' },
      login: { emoji: '🔓', label: 'Angemeldet', color: 'text-teal-400' },
      logout: { emoji: '🔒', label: 'Abgemeldet', color: 'text-slate-400' },
      permission_change: { emoji: '🔐', label: 'Permission geändert', color: 'text-yellow-400' },
      password_change: { emoji: '🔑', label: 'Passwort geändert', color: 'text-orange-400' },
    }
    return labels[action] || { emoji: '📝', label: action, color: 'text-slate-400' }
  }

  const quickActions: QuickAction[] = [
    {
      title: 'Neuer Termin',
      description: 'Event hinzufügen',
      href: '/admin/events',
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Galerie',
      description: 'Bilder verwalten',
      href: '/admin/gallery',
      icon: Images,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      title: 'Inhalte',
      description: 'Texte bearbeiten',
      href: '/admin/content',
      icon: FileText,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/20',
    },
    {
      title: 'Team',
      description: 'Mitglieder pflegen',
      href: '/admin/team',
      icon: Users,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
  ]

  if (loading) {
    return <AdminLoadingState message="Dashboard wird geladen..." fullPage />
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Willkommen zurück"
        description="Hier ist ein Überblick über deine DanceMotion Inhalte"
        icon={LayoutDashboard}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={Calendar}
          label="Kommende Termine"
          value={stats.upcomingEvents}
          sublabel="in den nächsten Tagen"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Alle Termine"
          value={stats.totalEvents}
          sublabel="in der Datenbank"
          color="from-teal-500 to-green-500"
        />
        <StatCard
          icon={FileText}
          label="Inhalte"
          value={stats.contentItems}
          sublabel="bearbeitbar"
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={Clock}
          label="Zuletzt aktualisiert"
          value={stats.lastUpdated.split(',')[0] || '-'}
          sublabel={stats.lastUpdated.split(',')[1] || 'jetzt'}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 hover:bg-slate-800/80 transition"
          >
            <div className={`w-10 h-10 rounded-lg ${action.bgColor} flex items-center justify-center mb-3`}>
              <action.icon size={20} className={action.color} />
            </div>
            <h3 className="font-semibold text-white group-hover:text-teal-400 transition flex items-center gap-2">
              {action.title}
              <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition" />
            </h3>
            <p className="text-sm text-slate-400">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Activity & More Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <AdminCard
          title="Letzte Aktivitäten"
          icon={Activity}
          className="lg:col-span-2"
          headerAction={
            <Link href="/admin/audit" className="text-sm text-teal-400 hover:text-teal-300 transition">
              Alle anzeigen →
            </Link>
          }
        >
          <div className="space-y-1 max-h-80 overflow-y-auto -mx-4 md:-mx-6 px-4 md:px-6">
            {recentActivity.length > 0 ? (
              recentActivity.map((log) => {
                const actionInfo = getActionLabel(log.action)
                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-sm py-2.5 px-3 -mx-3 hover:bg-slate-700/50 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg flex-shrink-0">{actionInfo.emoji}</span>
                      <div className="min-w-0">
                        <span className={`font-medium ${actionInfo.color}`}>{actionInfo.label}</span>
                        <span className="text-slate-500 mx-2">·</span>
                        <span className="text-slate-400 capitalize">{log.target_type}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                      {new Date(log.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )
              })
            ) : (
              <p className="text-slate-400 text-sm py-8 text-center">Keine Aktivitäten vorhanden</p>
            )}
          </div>
        </AdminCard>

        {/* Side Stats */}
        <div className="space-y-4">
          <AdminCard padding="sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
                <Users size={24} className="text-pink-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.teamMembers}</p>
                <p className="text-sm text-slate-400">Team Mitglieder</p>
              </div>
            </div>
          </AdminCard>

          <AdminCard padding="sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                <Images size={24} className="text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.galleryItems}</p>
                <p className="text-sm text-slate-400">Galerie Alben</p>
              </div>
            </div>
          </AdminCard>

          {/* Tip Box */}
          <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl">
            <p className="text-sm text-teal-300">
              💡 <strong>Tipp:</strong> Alle Änderungen werden sofort live geschaltet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
