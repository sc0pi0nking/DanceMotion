'use client'

import { useEffect, useState } from 'react'
import { Calendar, FileText, Clock, TrendingUp } from 'lucide-react'

interface Stats {
  upcomingEvents: number
  totalEvents: number
  contentItems: number
  lastUpdated: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    upcomingEvents: 0,
    totalEvents: 0,
    contentItems: 0,
    lastUpdated: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [eventsRes, contentRes] = await Promise.all([
        fetch('/api/admin/events'),
        fetch('/api/admin/content'),
      ])

      const events = await eventsRes.json()
      const content = await contentRes.json()

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const upcomingCount = events.filter((e: any) => new Date(e.date) >= today).length

      setStats({
        upcomingEvents: upcomingCount,
        totalEvents: events.length,
        contentItems: content.length,
        lastUpdated: new Date().toLocaleString('de-DE'),
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Willkommen zurück</h1>
        <p className="text-slate-400">Hier ist ein Überblick über deine DanceMotion Inhalte</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Upcoming Events */}
        <StatCard
          icon={Calendar}
          label="Kommende Termine"
          value={stats.upcomingEvents}
          sublabel="in den nächsten Tagen"
          color="from-blue-500 to-cyan-500"
        />

        {/* Total Events */}
        <StatCard
          icon={TrendingUp}
          label="Alle Termine"
          value={stats.totalEvents}
          sublabel="in der Datenbank"
          color="from-teal-500 to-green-500"
        />

        {/* Content Items */}
        <StatCard
          icon={FileText}
          label="Inhalte"
          value={stats.contentItems}
          sublabel="edierbar"
          color="from-purple-500 to-pink-500"
        />

        {/* Last Updated */}
        <StatCard
          icon={Clock}
          label="Zuletzt aktualisiert"
          value={stats.lastUpdated.split(',')[0]}
          sublabel={stats.lastUpdated.split(',')[1]}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Add Event */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Calendar size={24} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Neues Termin</h3>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Füge schnell ein neues Event oder Auftritt hinzu
          </p>
          <a
            href="/admin/events"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
          >
            Termin erstellen →
          </a>
        </div>

        {/* Quick Edit Content */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <FileText size={24} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Inhalte bearbeiten</h3>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Ändere Texte auf der Website ohne Code
          </p>
          <a
            href="/admin/content"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition"
          >
            Inhalte verwalten →
          </a>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-teal-500/10 border border-teal-500/50 rounded-lg text-teal-300 text-sm">
        <p>
          💡 <strong>Tipp:</strong> Alle Änderungen werden sofort live. Die Website aktualisiert sich
          automatisch.
        </p>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: any
  label: string
  value: string | number
  sublabel: string
  color: string
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        <Icon size={24} className="text-white" />
      </div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white mb-2">{value}</p>
      <p className="text-xs text-slate-500">{sublabel}</p>
    </div>
  )
}
