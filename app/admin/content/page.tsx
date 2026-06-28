'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { FileText, Plus, Save, X, Eye, Search, Tag, Trash2 } from 'lucide-react'
import type { ContentItem } from '@/lib/supabase'
import { AdminPageHeader, AdminCard, AdminLoadingState, AdminModal, ModalCancelButton, ModalConfirmButton, AdminInput, AdminTextarea, FormGroup } from '../components'

interface ContentSection {
  section: string
  items: ContentItem[]
}

export default function AdminContentPage() {
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSection, setSelectedSection] = useState<string>('all')
  const [showAddNew, setShowAddNew] = useState(false)
  const [newItem, setNewItem] = useState({ key: '', section: '', description: '', value: '' })

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
        const section = item.section || 'Allgemein'
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
        toast.success('Inhalt gespeichert')
      } else {
        toast.error('Speichern fehlgeschlagen')
      }
    } catch (error) {
      console.error('Failed to save content:', error)
      toast.error('Speichern fehlgeschlagen')
    }
  }

  async function handleCreate(): Promise<void> {
    if (!newItem.key || !newItem.section) {
      toast.error('Bitte Key und Section ausfüllen')
      return
    }

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: newItem.key,
          section: newItem.section,
          description: newItem.description,
          value: { text: newItem.value },
        }),
      })

      if (res.ok) {
        setShowAddNew(false)
        setNewItem({ key: '', section: '', description: '', value: '' })
        await loadContent()
        toast.success('Inhalt erstellt')
      } else {
        const error = await res.json()
        toast.error(`Fehler: ${error.error || 'Unbekannter Fehler'}`)
      }
    } catch (error) {
      console.error('Failed to create content:', error)
      toast.error('Fehler beim Erstellen')
    }
  }

  async function handleDelete(key: string): Promise<void> {
    if (!confirm('Wirklich löschen?')) return

    try {
      const res = await fetch(`/api/admin/content/${key}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await loadContent()
        toast.success('Inhalt gelöscht')
      } else {
        toast.error('Löschen fehlgeschlagen')
      }
    } catch (error) {
      console.error('Failed to delete content:', error)
      toast.error('Löschen fehlgeschlagen')
    }
  }

  function startEdit(item: ContentItem): void {
    setEditingId(item.id)
    setEditValue(item.value?.text || '')
  }

  // Filter logic
  const allSections = contentSections.map(s => s.section)
  const filteredSections = contentSections
    .filter(section => selectedSection === 'all' || section.section === selectedSection)
    .map(section => ({
      ...section,
      items: section.items.filter(item =>
        searchTerm === '' ||
        item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.value?.text?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter(section => section.items.length > 0)

  const totalItems = contentSections.reduce((sum, s) => sum + s.items.length, 0)

  if (loading) {
    return <AdminLoadingState message="Inhalte werden geladen..." fullPage />
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inhalte verwalten"
        description={`${totalItems} Inhalte in ${contentSections.length} Bereichen`}
        icon={FileText}
        breadcrumbs={[{ label: 'Inhalte' }]}
        actions={[
          {
            label: 'Neuer Inhalt',
            icon: Plus,
            onClick: () => setShowAddNew(true),
          },
        ]}
      >
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Suche nach Key, Beschreibung oder Inhalt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition"
            />
          </div>
          
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-teal-500 transition"
          >
            <option value="all">Alle Bereiche</option>
            {allSections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
      </AdminPageHeader>

      {/* Add New Modal */}
      <AdminModal
        isOpen={showAddNew}
        onClose={() => {
          setShowAddNew(false)
          setNewItem({ key: '', section: '', description: '', value: '' })
        }}
        title="Neuer Inhalt"
        description="Erstelle einen neuen bearbeitbaren Text"
        size="lg"
        footer={
          <>
            <ModalCancelButton onClick={() => setShowAddNew(false)} />
            <ModalConfirmButton onClick={handleCreate}>Erstellen</ModalConfirmButton>
          </>
        }
      >
        <div className="space-y-4">
          <FormGroup cols={2}>
            <AdminInput
              label="Key (eindeutig)"
              placeholder="z.B. home.hero.title"
              value={newItem.key}
              onChange={(e) => setNewItem({ ...newItem, key: e.target.value })}
              required
            />
            <AdminInput
              label="Bereich"
              placeholder="z.B. Startseite"
              value={newItem.section}
              onChange={(e) => setNewItem({ ...newItem, section: e.target.value })}
              required
            />
          </FormGroup>
          <AdminInput
            label="Beschreibung"
            placeholder="Kurze Beschreibung wo dieser Text verwendet wird"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <AdminTextarea
            label="Inhalt"
            placeholder="Der eigentliche Text..."
            value={newItem.value}
            onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
            rows={4}
          />
        </div>
      </AdminModal>

      {filteredSections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">
            {searchTerm || selectedSection !== 'all'
              ? 'Keine Inhalte gefunden'
              : 'Noch keine Inhalte konfiguriert'}
          </p>
          {!searchTerm && selectedSection === 'all' && (
            <button
              onClick={() => setShowAddNew(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition"
            >
              <Plus size={20} />
              Ersten Inhalt erstellen
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSections.map((section) => (
            <AdminCard
              key={section.section}
              title={section.section}
              icon={Tag}
              headerAction={<span className="text-sm text-slate-400">{section.items.length} Einträge</span>}
            >
              <div className="space-y-3 -mx-4 md:-mx-6 px-4 md:px-6">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-teal-400 font-mono text-sm">{item.key}</code>
                          {item.updated_at && (
                            <span className="text-xs text-slate-500">
                              {new Date(item.updated_at).toLocaleDateString('de-DE')}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-slate-400">{item.description}</p>
                        )}
                      </div>
                      {editingId !== item.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition"
                          >
                            Bearbeiten
                          </button>
                          <button
                            onClick={() => void handleDelete(item.key)}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm transition"
                            title="Löschen"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {editingId === item.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono text-sm"
                          rows={8}
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
                      <div className="mt-3">
                        <div className="bg-slate-800 border border-slate-700 rounded p-3">
                          <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                            {item.value?.text || <span className="text-slate-500 italic">Kein Inhalt</span>}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  )
}
