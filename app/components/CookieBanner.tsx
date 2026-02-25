'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has already accepted
    const accepted = localStorage.getItem('dancemotion_cookies_accepted')
    if (!accepted) {
      setIsVisible(true)
    }
    setIsLoading(false)
  }, [])

  const handleAccept = () => {
    localStorage.setItem('dancemotion_cookies_accepted', 'true')
    setIsVisible(false)
  }

  const handleReject = () => {
    // User explicitly rejected - still remember it
    localStorage.setItem('dancemotion_cookies_accepted', 'rejected')
    setIsVisible(false)
  }

  if (isLoading || !isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="pointer-events-auto max-w-4xl mx-auto m-4">
        {/* Banner */}
        <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-xl p-4 md:p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Content */}
            <div className="flex-1 space-y-2">
              <h3 className="text-sm md:text-base font-semibold text-white">
                🍪 Cookies & Datenschutz
              </h3>
              <p className="text-xs md:text-sm text-slate-300">
                Wir nutzen <span className="font-medium text-teal-400">nur anonyme Analytics</span> um zu verstehen, wie Sie unsere Website nutzen. 
                Keine Werbung, keine Tracking-Cookies, keine personenbezogenen Daten. 
                <a href="/datenschutz" className="ml-1 underline hover:text-teal-400 transition">
                  Mehr erfahren
                </a>
              </p>
            </div>

            {/* Actions - DSGVO: Gleichwertige Buttons ohne Dark Patterns */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleReject}
                className="px-4 py-2 text-xs md:text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium"
              >
                Ablehnen
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-xs md:text-sm bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition font-medium"
              >
                Akzeptieren
              </button>
              <button
                onClick={handleReject}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
