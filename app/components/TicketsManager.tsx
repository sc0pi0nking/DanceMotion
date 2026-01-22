'use client'

import { useState, useEffect } from 'react'
import { Trash2, ChevronDown, MessageSquare, Clock, CheckCircle } from 'lucide-react'

interface Ticket {
  id: string
  title: string
  description: string
  category: 'idea' | 'complaint' | 'suggestion' | 'question' | 'other'
  priority: 'low' | 'normal' | 'high'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  admin_notes: Array<{ note: string; created_by: string; created_at: string }>
  created_at: string
  updated_at: string
  resolved_at?: string
}

const categoryLabels = {
  idea: 'Veranstaltungsidee',
  complaint: 'Beschwerde',
  suggestion: 'Verbesserungsvorschlag',
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

  useEffect(() => {
    loadTickets()
  }, [])

  async function loadTickets() {
    try {
      const res = await fetch('/api/admin/tickets')
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

  async function updateTicketStatus(ticketId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'PATCH',
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_note', note: newNote }),
      })
      
      if (res.ok) {
        const updatedTicket = await res.json()
        setSelectedTicket(updatedTicket)
        setNewNote('')
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
      await fetch(`/api/admin/tickets/${ticketId}`, { method: 'DELETE' })
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Ticket List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Alle</option>
              <option value="open">Offen</option>
              <option value="in_progress">In Bearbeitung</option>
              <option value="resolved">Gelöst</option>
              <option value="closed">Geschlossen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Priorität</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Alle</option>
              <option value="high">Hoch</option>
              <option value="normal">Normal</option>
              <option value="low">Niedrig</option>
            </select>
          </div>
        </div>

        <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">
            Tickets: {filteredTickets.length}
          </p>
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <p className="text-sm text-muted py-4">Keine Tickets</p>
            ) : (
              filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedTicket?.id === ticket.id
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        {new Date(ticket.created_at).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ${getStatusColor(ticket.status)}`}>
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
          <div className="border rounded-lg p-6" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedTicket.title}</h2>
                <p className="text-sm text-muted mt-1">
                  Erstellt am {new Date(selectedTicket.created_at).toLocaleDateString('de-DE', {
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
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-xs font-medium text-muted mb-1">Kategorie</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {categoryLabels[selectedTicket.category]}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted mb-1">Priorität</p>
                <p className={`font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                  {priorityLabels[selectedTicket.priority]}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted mb-1">Status</p>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value)}
                  className="px-3 py-1 border rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="open">Offen</option>
                  <option value="in_progress">In Bearbeitung</option>
                  <option value="resolved">Gelöst</option>
                  <option value="closed">Geschlossen</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Beschreibung</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedTicket.description}</p>
            </div>

            {/* Admin Notes */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Admin-Notizen</h3>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {selectedTicket.admin_notes.length === 0 ? (
                  <p className="text-sm text-muted italic">Keine Notizen</p>
                ) : (
                  selectedTicket.admin_notes.map((note, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-muted mb-1">
                        {note.created_by} • {new Date(note.created_at).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{note.note}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Neue Notiz hinzufügen
                </label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 resize-none"
                  rows={3}
                  placeholder="Interne Notiz..."
                />
                <button
                  onClick={() => addNote(selectedTicket.id)}
                  disabled={!newNote.trim() || addingNote}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {addingNote ? 'Wird gespeichert...' : 'Notiz hinzufügen'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-12 text-center" style={{ borderColor: 'var(--border)' }}>
            <MessageSquare size={48} className="mx-auto mb-4 text-muted opacity-50" />
            <p className="text-muted">Wähle ein Ticket um Details zu sehen</p>
          </div>
        )}
      </div>
    </div>
  )
}
