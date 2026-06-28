'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  X,
  Calendar,
  Newspaper,
  Users2,
  HelpCircle,
  CornerDownLeft,
} from 'lucide-react'

interface SearchResult {
  type: 'event' | 'post' | 'group' | 'faq'
  title: string
  subtitle: string
  href: string
}

const ICONS = {
  event: Calendar,
  post: Newspaper,
  group: Users2,
  faq: HelpCircle,
} as const

export default function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setResults([])
    setActive(0)
  }, [])

  // Global open shortcuts: Cmd+K / Ctrl+K and custom event
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    function onOpenEvent() {
      setOpen(true)
    }
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('dancemotion:open-search', onOpenEvent)
    return () => {
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('dancemotion:open-search', onOpenEvent)
    }
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  // Debounced search
  useEffect(() => {
    if (!open) return
    const term = query.trim()
    if (term.length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const controller = new AbortController()
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        })
        const data = await res.json()
        setResults(data.results || [])
        setActive(0)
      } catch {
        // ignore aborts/errors
      } finally {
        setLoading(false)
      }
    }, 220)
    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [query, open])

  function go(result: SearchResult) {
    close()
    router.push(result.href)
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      go(results[active])
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
      onClick={close}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      />
      <div
        className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--panel)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <Search size={18} style={{ color: 'var(--accent)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Events, News, Gruppen, FAQs durchsuchen…"
            className="flex-1 bg-transparent outline-none text-base"
            style={{ color: 'var(--fg)' }}
          />
          <button
            onClick={close}
            aria-label="Schließen"
            className="p-1 rounded hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {loading && (
            <div className="px-4 py-6 text-sm" style={{ color: 'var(--muted)' }}>
              Suche läuft…
            </div>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div className="px-4 py-6 text-sm" style={{ color: 'var(--muted)' }}>
              Keine Treffer für „{query.trim()}“.
            </div>
          )}

          {!loading &&
            results.map((r, i) => {
              const Icon = ICONS[r.type]
              return (
                <button
                  key={`${r.type}-${r.href}-${i}`}
                  onClick={() => go(r)}
                  onMouseEnter={() => setActive(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                  style={{
                    background:
                      i === active ? 'rgba(46,196,198,0.1)' : 'transparent',
                  }}
                >
                  <Icon size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                  <span className="min-w-0 flex-1">
                    <span
                      className="block truncate font-medium"
                      style={{ color: 'var(--fg)' }}
                    >
                      {r.title}
                    </span>
                    <span
                      className="block truncate text-xs"
                      style={{ color: 'var(--muted)' }}
                    >
                      {r.subtitle}
                    </span>
                  </span>
                  {i === active && (
                    <CornerDownLeft size={14} style={{ color: 'var(--muted)' }} />
                  )}
                </button>
              )
            })}

          {query.trim().length < 2 && (
            <div className="px-4 py-6 text-sm" style={{ color: 'var(--muted)' }}>
              Tippe mindestens 2 Zeichen. Öffnen mit{' '}
              <kbd
                className="px-1.5 py-0.5 rounded text-xs"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
              >
                Strg / ⌘ + K
              </kbd>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
