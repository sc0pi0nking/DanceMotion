'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Toaster } from 'sonner'
import { Calendar, FileText, BarChart3, Images, LogOut, Menu, X, FileDown, HelpCircle, Users, Book, Home, Share2, Repeat, Shield, Activity, LogIn, Settings, MessageSquare, AlertCircle, ImageIcon, Users2, Newspaper } from 'lucide-react'
import './admin.css'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Standardmäßig geschlossen auf Mobile
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string>('')
  const [userPermissions, setUserPermissions] = useState<string[]>([])
  const [sessionTimeout, setSessionTimeout] = useState(60) // Default 60 minutes
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)
  const lastActivityRef = useRef<number>(Date.now())
  const router = useRouter()
  const pathname = usePathname()

  // Sidebar auf Desktop standardmäßig öffnen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    
    // Initial check
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Sidebar schließen bei Navigation auf Mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [pathname])

  // Admin als eigene, fixe Seite (kein Body-Scroll)
  useEffect(() => {
    document.documentElement.classList.add('admin-shell')
    document.body.classList.add('admin-shell')
    return () => {
      document.documentElement.classList.remove('admin-shell')
      document.body.classList.remove('admin-shell')
    }
  }, [])

  useEffect(() => {
    // Check if user is authenticated immediately on mount
    checkAuth()
    
    // Prüfe Session regelmäßig (z.B. wenn Tab im Hintergrund war)
    // Reduced interval on mobile for better detection
    const interval = setInterval(() => {
      checkAuth()
    }, window.innerWidth < 1024 ? 15000 : 30000) // 15s on mobile, 30s on desktop
    
    // Also check when page becomes visible (tab focus)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuth()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
    // Re-run on navigation so the sidebar/permissions populate right after
    // a client-side redirect from /admin/login (no full reload required).
  }, [pathname])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth/session')
      if (!res.ok) {
        setUser(null)
        setUserRole('')
        setUserPermissions([])
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      if (!data.user || !data.user.id) {
        setUser(null)
        setUserRole('')
        setUserPermissions([])
        router.push('/admin/login')
        return
      }
      setUser(data.user)
      setUserRole(data.user.role || data.user.role_name || '')
      setUserPermissions(data.user.permissions || [])
      
      // Get session timeout from server settings
      if (data.session?.timeout_minutes) {
        setSessionTimeout(data.session.timeout_minutes)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setUserRole('')
      setUserPermissions([])
      router.push('/admin/login')
    }
  }

  // Session timeout handling
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
    setShowTimeoutWarning(false)
  }, [])

  useEffect(() => {
    // Track user activity
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach(event => {
      window.addEventListener(event, updateActivity)
    })

    // Check for inactivity every minute
    const checkInactivity = setInterval(() => {
      if (!user) return
      
      const inactiveMinutes = (Date.now() - lastActivityRef.current) / (1000 * 60)
      const warningThreshold = sessionTimeout - 5 // Warn 5 minutes before
      
      if (inactiveMinutes >= sessionTimeout) {
        // Session timed out - logout
        handleLogout()
      } else if (inactiveMinutes >= warningThreshold) {
        // Show warning
        setShowTimeoutWarning(true)
      }
    }, 60000) // Check every minute

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity)
      })
      clearInterval(checkInactivity)
    }
  }, [user, sessionTimeout, updateActivity])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      setUser(null)
      setUserRole('')
      setUserPermissions([])
      // Force a hard redirect to login page
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout failed:', error)
      window.location.href = '/admin/login'
    }
  }

  // Navigation kategorisiert für bessere Übersichtlichkeit
  const navCategories = [
    {
      label: 'Übersicht',
      items: [
        { icon: BarChart3, label: 'Dashboard', href: '/admin', permission: 'dashboard' },
      ]
    },
    {
      label: 'Inhalte',
      items: [
        { icon: Calendar, label: 'Termine', href: '/admin/events', permission: 'events' },
        { icon: Repeat, label: 'Wiederkehrend', href: '/admin/recurring', permission: 'recurring' },
        { icon: FileText, label: 'Inhalte', href: '/admin/content', permission: 'content' },
        { icon: ImageIcon, label: 'Hero Banner', href: '/admin/hero-banner', permission: 'content' },
        { icon: ImageIcon, label: 'Gruppen Banner', href: '/admin/groups-banner', permission: 'content' },
        { icon: Images, label: 'Galerie', href: '/admin/gallery', permission: 'gallery' },
        { icon: FileDown, label: 'Dokumente', href: '/admin/documents', permission: 'documents' },
        { icon: HelpCircle, label: 'FAQs', href: '/admin/faqs', permission: 'faqs' },
        { icon: Users, label: 'Team', href: '/admin/team', permission: 'team' },
        { icon: Users2, label: 'Gruppen', href: '/admin/groups', permission: 'content' },
        { icon: Newspaper, label: 'News', href: '/admin/posts', permission: 'content' },
      ]
    },
    {
      label: 'Kommunikation',
      items: [
        { icon: MessageSquare, label: 'Tickets', href: '/admin/tickets', permission: 'tickets_admin' },
        { icon: AlertCircle, label: 'Alerts', href: '/admin/alerts', permission: 'alerts_admin' },
        { icon: Share2, label: 'Social Media', href: '/admin/social', permission: 'social' },
        { icon: Share2, label: 'Sponsoren', href: '/admin/sponsors', permission: 'sponsors' },
      ]
    },
    {
      label: 'Dokumentation',
      items: [
        { icon: Book, label: 'Admin Wiki', href: '/admin/wiki/admin', permission: 'wiki_admin' },
        { icon: Book, label: 'Dev Wiki', href: '/admin/wiki/dev', permission: 'wiki_dev' },
      ]
    },
    {
      label: 'System',
      items: [
        { icon: Activity, label: 'Analytics', href: '/admin/analytics', permission: 'analytics' },
        { icon: LogIn, label: 'Audit', href: '/admin/audit', permission: 'audit' },
        { icon: Users, label: 'Benutzer', href: '/admin/users', permission: 'users' },
        { icon: Shield, label: 'Rollen', href: '/admin/roles', permission: 'roles' },
        { icon: Settings, label: 'Einstellungen', href: '/admin/settings', permission: 'settings' },
      ]
    },
  ]

  // Filter Navigation Items basierend auf Permissions
  const filteredCategories = navCategories
    .map(category => ({
      ...category,
      items: category.items.filter(item => userPermissions.includes(item.permission))
    }))
    .filter(category => category.items.length > 0)

  // Check if current path matches nav item
  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="dm-admin flex h-screen overflow-hidden">
      <Toaster position="top-right" richColors theme="dark" />
      {/* Session Timeout Warning */}
      {showTimeoutWarning && (
        <div className="fixed top-4 right-4 z-[100] bg-amber-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-pulse">
          <AlertCircle size={24} />
          <div>
            <p className="font-semibold">Session läuft bald ab</p>
            <p className="text-sm opacity-90">Klicke irgendwo, um aktiv zu bleiben</p>
          </div>
          <button
            onClick={updateActivity}
            className="px-4 py-2 bg-white text-amber-600 rounded-lg font-medium hover:bg-amber-50 transition"
          >
            Aktiv bleiben
          </button>
        </div>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm lg:hidden z-40"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-72 lg:w-64
          adm-panel-2 flex flex-col h-screen rounded-none
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}
        `}
        style={{ borderTop: 0, borderBottom: 0, borderLeft: 0 }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4" style={{ borderBottom: "1px solid var(--a-border)" }}>
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ color: '#04211f', boxShadow: '0 6px 16px rgba(46,196,198,0.28)' }}>
              DM
            </div>
            <span className="font-bold lg:hidden xl:block" style={{ color: 'var(--a-fg)' }}>DanceMotion</span>
          </Link>
          {/* Close button on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden adm-btn adm-btn--ghost !p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 px-3 overflow-y-auto">
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <div key={category.label}>
                {/* Category Label */}
                <p className="adm-nav-cat lg:hidden xl:block">
                  {category.label}
                </p>
                <div className="space-y-0.5">
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`adm-nav-link ${isActive(item.href) ? 'is-active' : ''}`}
                    >
                      <item.icon size={18} className="flex-shrink-0" />
                      <span className="lg:hidden xl:block">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Back to Site Link */}
        <div className="p-3" style={{ borderTop: "1px solid var(--a-border)" }}>
          <Link
            href="/"
            className="adm-nav-link"
          >
            <Home size={20} className="flex-shrink-0" />
            <span className="lg:hidden xl:block">Zur Website</span>
          </Link>
        </div>

        {/* Logout Button */}
        <div className="p-3" style={{ borderTop: "1px solid var(--a-border)" }}>
          <button
            onClick={handleLogout}
            className="adm-nav-link w-full"
            style={{ color: '#fca5a5' }}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="lg:hidden xl:block">Abmelden</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full lg:pl-20 xl:pl-0 min-w-0 min-h-0">
        {/* Header */}
        <header className="h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30" style={{ background: "var(--a-surface-2)", borderBottom: "1px solid var(--a-border)" }}>
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden adm-btn adm-btn--ghost !p-2"
              aria-label="Menü öffnen"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-bold truncate" style={{ color: 'var(--a-fg)' }}>Admin Panel</h1>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium truncate max-w-[150px] md:max-w-none" style={{ color: 'var(--a-fg)' }}>{user?.email}</p>
              <div className="flex items-center gap-2 mt-1 justify-end">
                <span className="text-xs capitalize" style={{ color: 'var(--a-muted)' }}>{userRole || 'Administrator'}</span>
                {userRole && (
                  <span className="adm-chip adm-chip--accent">
                    {userRole}
                  </span>
                )}
              </div>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ color: '#04211f' }}>
              {user?.email?.[0]?.toUpperCase() || '?'}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0 admin-scroll">
          {children}
        </div>
      </main>
    </div>
  )
}
