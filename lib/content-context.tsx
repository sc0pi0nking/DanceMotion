'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ContentContextValue {
  /** Vorab (server-seitig) gebündelt geladene Content-Werte, keyed by contentKey. */
  content: Record<string, string>
  /** Einmalig pro Provider geprüfter Admin-Status (statt 1 Fetch je EditableContent). */
  isAdmin: boolean
}

const ContentContext = createContext<ContentContextValue | null>(null)

/**
 * Stellt server-seitig via loadContentBatch() geladene Inhalte bereit und prüft
 * den Admin-Status genau EINMAL. Eliminiert das N+1-Fetch-Problem von EditableContent
 * (vorher: 2 Fetches pro Instanz → jetzt: 0 Content-Fetches + 1 Admin-Fetch pro Seite).
 */
export function ContentProvider({
  initialContent,
  children,
}: {
  initialContent: Record<string, string>
  children: React.ReactNode
}) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/api/admin/auth/session')
      .then((res) => {
        if (active) setIsAdmin(res.ok)
      })
      .catch(() => {
        if (active) setIsAdmin(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <ContentContext.Provider value={{ content: initialContent, isAdmin }}>
      {children}
    </ContentContext.Provider>
  )
}

/**
 * Liefert den Context oder null, wenn kein Provider vorhanden ist.
 * EditableContent nutzt null als Signal für den Legacy-Fetch-Pfad (Abwärtskompatibilität
 * für Seiten ohne ContentProvider, z. B. datenschutz/impressum).
 */
export function useContentContext(): ContentContextValue | null {
  return useContext(ContentContext)
}
