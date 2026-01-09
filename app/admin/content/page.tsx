'use client'

import { useState, useEffect } from 'react'
import { FileText, Plus, Save, X } from 'lucide-react'
import type { ContentItem } from '@/lib/supabase'

interface ContentSection {
  section: string
  items: ContentItem[]
}

export default function AdminContentPage() {
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  useEffect(() => {
    void loadContent()
  }, [])

  async function loadContent(): Promise<void> {
    try {
      const res = await fetch('/api/admin/content')
      const data: ContentItem[] = await res.json()
      
      // Group by section
      const grouped: Record<string, ContentItem[]> = {}
      data.forEach((item) => {
        const section = item.section || 'General'
        if (!grouped[section]) grouped[section] = []
        grouped[section].push(item)
      })
      
      const sections = Object.entries(grouped).map(([section, items]) => ({
        section,
        items: items.sort((a, b) => a.key.localeCompare(b.key)),
      }))
      
      setContentSections(sections.sort((a, b) => a.section.localeCompare(b.section)))
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(key: string): Promise<void> {
    try {
      const res = await fetch(`/api/admin/content/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: { text: editValue },
          updated_at: new Date().toISOString(),
        }),
      })

      if (res.ok) {
        setEditingId(null)
        await loadContent()
      }
    } catch (error) {
      console.error('Failed to save content:', error)
    }
  }

  function startEdit(item: ContentItem): void {
    setEditingId(item.id)
    setEditValue(item.value?.text || '')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Inhalte verwalten</h1>
        <p className="text-slate-400">Bearbeite alle Texte auf der Website direkt</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400">Lädt...</div>
      ) : contentSections.length === 0 ? (
        <div className="text-center py-8 text-slate-400">Noch keine Inhalte konfiguriert</div>
      ) : (
        <div className="space-y-8">
          {contentSections.map((section) => (
            <div key={section.section}>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText size={24} />
                {section.section}
              </h2>

              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800 border border-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold">{item.key}</h3>
                        {item.description && (
                          <p className="text-sm text-slate-400">{item.description}</p>
                        )}
                      </div>
                      {editingId !== item.id && (
                        <button
                          onClick={() => startEdit(item)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition"
                        >
                          Bearbeiten
                        </button>
                      )}
                    </div>

                    {editingId === item.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono text-sm"
                          rows={6}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => void handleSave(item.key)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded hover:shadow-lg transition"
                          >
                            <Save size={16} />
                            Speichern
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
                          >
                            <X size={16} />
                            Abbrechen
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-300 whitespace-pre-wrap font-mono text-sm">
                        {item.value?.text || 'Kein Inhalt'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/50 rounded-lg text-orange-300 text-sm">
        <p>
          ℹ️ <strong>Info:</strong> Die Inhalte sind derzeit noch nicht auf den Seiten integriert. Das kommt im nächsten Schritt!
        </p>
      </div>
    </div>
  )
}
