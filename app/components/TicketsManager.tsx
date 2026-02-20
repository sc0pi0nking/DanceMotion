'use client'

import { useState, useEffect, useRef } from 'react'
import { Trash2, ChevronDown, MessageSquare, Clock, CheckCircle, Plus, X, ImagePlus, Image } from 'lucide-react'

interface Ticket {
  id: string
  title: string
  description: string
  category: 'bug' | 'incomplete' | 'suggestion' | 'question' | 'other'
  priority: 'low' | 'normal' | 'high'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  admin_notes: Array<{ note: string; created_by: string; created_at: string; attachments?: string[] }>
  attachments?: string[]
  created_at: string
  updated_at: string
  resolved_at?: string
}

const categoryLabels = {
  bug: 'Fehler/Problem',
  incomplete: 'Unvollständiges Feature',
  suggestion: 'Feature-Wunsch',
  question: 'Frage',
  other: 'Sonstiges',
}

const statusLabels = {
  open: 'Offen',
  in_progress: 'In Bearbeitung',
  resolved: 'Gelöst',
  closed: 'Geschlossen',
}

const priorityLabels = {
  low: 'Niedrig',
  normal: 'Normal',
  high: 'Hoch',
}

export default function TicketsManager() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)

  // Image upload states for notes
  const [noteImages, setNoteImages] = useState<string[]>([])
  const [noteUploading, setNoteUploading] = useState(false)
  const noteFileRef = useRef<HTMLInputElement>(null)

  // Create ticket states
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: 'bug' as string,
    priority: 'normal' as string,
  })
  const [createImages, setCreateImages] = useState<string[]>([])
  const [createUploading, setCreateUploading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createMessage, setCreateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const createFileRef = useRef<HTMLInputElement>(null)

  // Image lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    loadTickets()
  }, [])

  async function loadTickets() {
    try {
      const res = await fetch('/api/admin/tickets', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setTickets(data)
      }
    } catch (error) {
      console.error('Failed to load tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  async function uploadAdminImage(file: File): Promise<string> {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/tickets/upload', {
      method: 'POST',
      credentials: 'include',
      body: fd,
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Upload fehlgeschlagen')
    }
    const data = await res.json()
    return data.url
  }

  async function handleNoteFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    if (noteImages.length + files.length > 3) return

    setNoteUploading(true)
    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) continue
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) continue
        const url = await uploadAdminImage(file)
        setNoteImages(prev => [...prev, url])
      }
    } catch (err) {
      console.error('Note image upload failed:', err)
    } finally {
      setNoteUploading(false)
      if (noteFileRef.current) noteFileRef.current.value = ''
    }
  }

  async function handleCreateFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    if (createImages.length + files.length > 3) return

    setCreateUploading(true)
    try {
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) continue
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) continue
        const url = await uploadAdminImage(file)
        setCreateImages(prev => [...prev, url])
      }
    } catch (err) {
      console.error('Create image upload failed:', err)
    } finally {
      setCreateUploading(false)
      if (createFileRef.current) createFileRef.current.value = ''
    }
  }

  async function createTicket(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.title.trim() || !createForm.description.trim()) return

    setCreating(true)
    setCreateMessage(null)
    try {
      const res = await fetch('/api/admin/tickets', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...createForm,
          attachments: createImages,
        }),
      })

      if (res.ok) {
        setCreateMessage({ type: 'success', text: 'Ticket erfolgreich erstellt!' })
        setCreateForm({ title: '', description: '', category: 'bug', priority: 'normal' })
        setCreateImages([])
        loadTickets()
        setTimeout(() => {
          setShowCreateForm(false)
          setCreateMessage(null)
        }, 1500)
      } else {
        const data = await res.json()
        setCreateMessage({ type: 'error', text: data.error || 'Fehler beim Erstellen' })
      }
    } catch (err) {
      setCreateMessage({ type: 'error', text: 'Netzwerkfehler' })
    } finally {
      setCreating(false)
    }
  }

  async function updateTicketStatus(ticketId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', status: newStatus }),
      })
      
      if (res.ok) {
        loadTickets()
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus as any })
        }
      }
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  async function addNote(ticketId: string) {
    if (!newNote.trim()) return

    try {
      setAddingNote(true)
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_note',
          note: newNote,
          attachments: noteImages,
        }),
      })
      
      if (res.ok) {
        const updatedTicket = await res.json()
        setSelectedTicket(updatedTicket)
        setNewNote('')
        setNoteImages([])
        loadTickets()
      }
    } catch (error) {
      console.error('Add note failed:', error)
    } finally {
      setAddingNote(false)
    }
  }

  async function deleteTicket(ticketId: string) {
    if (!confirm('Dieses Ticket wirklich löschen?')) return

    try {
      await fetch(`/api/admin/tickets/${ticketId}`, { method: 'DELETE', credentials: 'include' })
      loadTickets()
      setSelectedTicket(null)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus !== 'all' && ticket.status !== filterStatus) return false
    if (filterPriority !== 'all' && ticket.priority !== filterPriority) return false
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'closed':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
      default:
        return 'bg-gray-100 dark:bg-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'normal':
        return 'text-orange-600'
      case 'low':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-3 -right-3 bg-white text-black rounded-full p-1.5 shadow-lg z-10"
            >
              <X size={18} />
            </button>
            <img src={lightboxImage} alt="Vollbild" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          </div>
        </div>
      )}

      {/* Create Ticket Button / Form */}
      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-bold hover:from-teal-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          Neues Ticket erstellen
        </button>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border-2 border-teal-500/30 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">✏️ Neues Ticket erstellen</h3>
            <button
              onClick={() => { setShowCreateForm(false); setCreateMessage(null); setCreateImages([]) }}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {createMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              createMessage.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}>
              {createMessage.text}
            </div>
          )}

          <form onSubmit={createTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Titel *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Kurze Beschreibung..."
                  className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-colors focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Kategorie</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-colors focus:border-teal-500 focus:outline-none"
                  >
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Priorität</label>
                  <select
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                    className="w-full px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-colors focus:border-teal-500 focus:outline-none"
                  >
                    {Object.entries(priorityLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Beschreibung *</label>
              <textarea
                required
                maxLength={2000}
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                rows={3}
                placeholder="Details zum Ticket..."
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium resize-none transition-colors focus:border-teal-500 focus:outline-none"
              />
            </div>

            {/* Create form image upload */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Bilder (Optional, max. 3)</label>
              {createImages.length < 3 && (
                <div className="mb-2">
                  <input
                    ref={createFileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleCreateFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => createFileRef.current?.click()}
                    disabled={createUploading}
                    className="flex items-center gap-2 px-3 py-1.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-teal-500 hover:text-teal-500 transition-colors disabled:opacity-50"
                  >
                    <ImagePlus size={16} />
                    {createUploading ? 'Lädt...' : 'Bilder hinzufügen'}
                  </button>
                </div>
              )}
              {createImages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {createImages.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`Anhang ${i + 1}`} className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-600" />
                      <button
                        type="button"
                        onClick={() => setCreateImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); setCreateMessage(null); setCreateImages([]) }}
                className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={creating || createUploading || !createForm.title.trim() || !createForm.description.trim()}
                className="px-5 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-bold hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                {creating ? '⏳ Wird erstellt...' : '✓ Ticket erstellen'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Ticket List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-3 text-gray-700 dark:text-gray-200 uppercase tracking-wide">Status Filter</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-colors focus:border-accent focus:outline-none"
            >
              <option value="all">Alle Tickets</option>
              <option value="open">🔴 Offen</option>
              <option value="in_progress">🔵 In Bearbeitung</option>
              <option value="resolved">✅ Gelöst</option>
              <option value="closed">⭕ Geschlossen</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-3 text-gray-700 dark:text-gray-200 uppercase tracking-wide">Priorität Filter</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium transition-colors focus:border-accent focus:outline-none"
            >
              <option value="all">Alle Prioritäten</option>
              <option value="high">🔴 Hoch</option>
              <option value="normal">🟠 Normal</option>
              <option value="low">🔵 Niedrig</option>
            </select>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-accent rounded-full text-white text-xs font-bold mr-2">
              {filteredTickets.length}
            </span>
            Tickets
          </p>
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">Keine Tickets gefunden</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left p-3.5 rounded-lg border-2 transition-all ${
                    selectedTicket?.id === ticket.id
                      ? 'border-accent bg-accent/10 dark:bg-accent/5 shadow-md'
                      : 'border-gray-300 dark:border-gray-600 hover:border-accent/50 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                        {new Date(ticket.created_at).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-md font-bold whitespace-nowrap ${getStatusColor(ticket.status)}`}>
                      {statusLabels[ticket.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ticket Detail */}
      <div className="lg:col-span-2">
        {selectedTicket ? (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-6 pb-6 border-b-2 border-gray-300 dark:border-gray-700">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedTicket.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                  📅 Erstellt am {new Date(selectedTicket.created_at).toLocaleDateString('de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={() => deleteTicket(selectedTicket.id)}
                className="ml-4 p-2.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all border border-red-200 dark:border-red-800"
              >
                <Trash2 size={20} className="text-red-600 dark:text-red-500" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b-2 border-gray-300 dark:border-gray-700">
              <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Kategorie</p>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                  {categoryLabels[selectedTicket.category]}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Priorität</p>
                <p className={`font-bold text-sm ${getPriorityColor(selectedTicket.priority)}`}>
                  {priorityLabels[selectedTicket.priority]}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Status</p>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                  className="w-full px-3 py-1.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors focus:border-accent focus:outline-none"
                >
                  <option value="open">Offen</option>
                  <option value="in_progress">In Bearbeitung</option>
                  <option value="resolved">Gelöst</option>
                  <option value="closed">Geschlossen</option>
                </select>
              </div>
            </div>

            <div className="mb-7">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wide">📝 Beschreibung</h3>
              <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed text-sm">
                  {selectedTicket.description}
                </p>
              </div>
            </div>

            {/* Ticket Attachments */}
            {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
              <div className="mb-7">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wide">📎 Anhänge ({selectedTicket.attachments.length})</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedTicket.attachments.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxImage(url)}
                      className="group relative"
                    >
                      <img
                        src={url}
                        alt={`Anhang ${i + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600 group-hover:border-teal-500 transition-colors"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors flex items-center justify-center">
                        <Image size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wide">💬 Admin-Notizen</h3>
              
              <div className="bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 p-4 space-y-3 max-h-[300px] overflow-y-auto">
                {selectedTicket.admin_notes.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-6">
                    Keine Admin-Notizen vorhanden
                  </p>
                ) : (
                  selectedTicket.admin_notes.map((note, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-600/30 p-3.5 rounded-lg border-l-4 border-accent">
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 font-semibold">
                        👤 {note.created_by} • {new Date(note.created_at).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{note.note}</p>
                      {note.attachments && note.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {note.attachments.map((url, j) => (
                            <button
                              key={j}
                              onClick={() => setLightboxImage(url)}
                              className="group relative"
                            >
                              <img
                                src={url}
                                alt={`Notiz-Anhang ${j + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-500 group-hover:border-teal-500 transition-colors"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="bg-white dark:bg-gray-700/50 rounded-lg border-2 border-gray-200 dark:border-gray-600 p-4">
                <label className="block text-sm font-bold mb-3 text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                  ➕ Neue Notiz hinzufügen
                </label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium resize-none transition-colors focus:border-accent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  rows={4}
                  placeholder="Deine interne Notiz..."
                  maxLength={500}
                />

                {/* Note Image Upload */}
                <div className="mt-3">
                  {noteImages.length < 3 && (
                    <div className="mb-2">
                      <input
                        ref={noteFileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handleNoteFileSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => noteFileRef.current?.click()}
                        disabled={noteUploading}
                        className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:border-teal-500 hover:text-teal-500 transition-colors disabled:opacity-50"
                      >
                        <ImagePlus size={14} />
                        {noteUploading ? 'Lädt...' : 'Bilder anhängen (max. 3)'}
                      </button>
                    </div>
                  )}
                  {noteImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {noteImages.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt={`Anhang ${i + 1}`} className="w-14 h-14 object-cover rounded-lg border border-gray-300 dark:border-gray-600" />
                          <button
                            type="button"
                            onClick={() => setNoteImages(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {newNote.length}/500 Zeichen
                  </p>
                  <button
                    onClick={() => addNote(selectedTicket.id)}
                    disabled={!newNote.trim() || addingNote || noteUploading}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    {addingNote ? '⏳ Wird gespeichert...' : '✓ Notiz hinzufügen'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center shadow-lg flex flex-col items-center justify-center min-h-[400px]">
            <MessageSquare size={56} className="mx-auto mb-4 text-gray-400 dark:text-gray-600 opacity-60" />
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">Wähle ein Ticket</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">um Details zu sehen und zu bearbeiten</p>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
