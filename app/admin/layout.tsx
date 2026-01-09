'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Calendar, FileText, BarChart3, Images, LogOut, Menu, X, FileDown, MessageCircle, HelpCircle, Users } from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth/session')
      if (!res.ok) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      setUser(data.user)
      setUserRole(data.user.role || '')
    } catch {
      router.push('/admin/login')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch {}
  }

  // Alle verfügbaren Navigation Items
  const allNavItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/admin', roles: ['admin'] },
    { icon: Calendar, label: 'Termine', href: '/admin/events', roles: ['admin'] },
    { icon: MessageCircle, label: 'Event-Anfragen', href: '/admin/event-requests', roles: ['admin', 'event-manager'] },
    { icon: FileText, label: 'Inhalte', href: '/admin/content', roles: ['admin', 'editor'] },
    { icon: Images, label: 'Galerie', href: '/admin/gallery', roles: ['admin', 'editor'] },
    { icon: FileDown, label: 'Dokumente', href: '/admin/documents', roles: ['admin', 'editor'] },
    { icon: HelpCircle, label: 'FAQs', href: '/admin/faqs', roles: ['admin', 'editor'] },
    { icon: Users, label: 'Team', href: '/admin/team', roles: ['admin', 'editor'] },
  ]

  // Filter Navigation Items basierend auf Rolle
  const navItems = allNavItems.filter(item => 
    item.roles.includes(userRole) || userRole === 'admin'
  )

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 fixed h-screen z-40 lg:relative`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-700">
          <Link href="/admin" className="flex items-center gap-3 px-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm">
              DM
            </div>
            {sidebarOpen && <span className="font-bold text-white">DanceMotion</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-slate-700 p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Abmelden</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="h-16 border-t border-slate-700 flex items-center justify-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-800 border-b border-slate-700 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.email}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
