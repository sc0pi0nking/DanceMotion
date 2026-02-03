'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, ChevronDown, Calendar, X } from 'lucide-react'
import type { Event } from '@/lib/supabase'
import { AdminPageHeader, AdminCard, AdminLoadingState, AdminEmptyState, AdminModal, ModalCancelButton, ModalConfirmButton, AdminInput, AdminSelect, FormGroup } from '../components'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    date: '',
    time: '',
    location: '',
    city: '',
    category: 'Event',
    groups: [],
    note: '',
    href: '',
  })

  useEffect(() => {
    void loadEvents()
  }, [])

  async function loadEvents(): Promise<void> {
    try {
      const res = await fetch('/api/admin/events')
      const data = await res.json()
      setEvents(data)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()

    try {
      const url = editingId ? `/api/admin/events/${editingId}` : '/api/admin/events'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await loadEvents()
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save event:', error)
    }
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('Willst du diesen Termin wirklich löschen?')) return

    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await loadEvents()
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  function handleEdit(event: Event): void {
    setFormData(event)
    setEditingId(event.id)
    setShowForm(true)
  }

  function resetForm(): void {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      city: '',
      category: 'Event',
      groups: [],
      note: '',
      href: '',
    })
    setEditingId(null)
    setShowForm(false)
  }

  const groupOptions = [
    { value: 'little-joys', label: 'Little Joys' },
    { value: 'smileys', label: 'Smileys' },
    { value: 'emotion', label: 'Emotion' },
  ]

  const categories: Array<'Auftritt' | 'Workshop' | 'Training' | 'Event'> = ['Auftritt', 'Workshop', 'Training', 'Event']

  // Filter events
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (filter === 'upcoming') return eventDate >= today
    if (filter === 'past') return eventDate < today
    return true
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const upcomingCount = events.filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0))).length

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Termine verwalten"
        description={`${events.length} Termine insgesamt · ${upcomingCount} kommende`}
        icon={Calendar}
        breadcrumbs={[{ label: 'Termine' }]}
        actions={[
          {
            label: 'Neues Event',
            icon: Plus,
            onClick: () => {
              resetForm()
              setShowForm(true)
            },
          },
        ]}
      >
        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4">
          {[
            { key: 'all', label: 'Alle' },
            { key: 'upcoming', label: 'Kommende' },
            { key: 'past', label: 'Vergangene' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as 'all' | 'upcoming' | 'past')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === tab.key
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </AdminPageHeader>

      {/* Event Form Modal */}
      <AdminModal
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? 'Event bearbeiten' : 'Neues Event erstellen'}
        size="lg"
        footer={
          <>
            <ModalCancelButton onClick={resetForm} />
            <ModalConfirmButton onClick={() => {
              const form = document.getElementById('event-form') as HTMLFormElement
              form?.requestSubmit()
            }}>
              {editingId ? 'Aktualisieren' : 'Erstellen'}
            </ModalConfirmButton>
          </>
        }
      >
        <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
          <FormGroup cols={2}>
            <AdminInput
              label="Event Titel"
              placeholder="z.B. Sommeraufführung 2026"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <AdminInput
              type="date"
              label="Datum"
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup cols={2}>
            <AdminInput
              type="time"
              label="Uhrzeit"
              value={formData.time || ''}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
            <AdminSelect
              label="Kategorie"
              value={formData.category || 'Event'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              options={categories.map(cat => ({ value: cat, label: cat }))}
            />
          </FormGroup>

          <FormGroup cols={2}>
            <AdminInput
              label="Veranstaltungsort"
              placeholder="z.B. Stadthalle"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <AdminInput
              label="Stadt"
              placeholder="z.B. Musterstadt"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup cols={2}>
            <AdminInput
              label="Zusatzinfo (optional)"
              placeholder="z.B. Eintritt frei"
              value={formData.note || ''}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
            <AdminInput
              label="Link (optional)"
              placeholder="https://..."
              value={formData.href || ''}
              onChange={(e) => setFormData({ ...formData, href: e.target.value })}
            />
          </FormGroup>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Gruppen</label>
            <div className="flex flex-wrap gap-3">
              {groupOptions.map((group) => (
                <label key={group.value} className="flex items-center gap-2 cursor-pointer bg-slate-700 px-3 py-2 rounded-lg hover:bg-slate-600 transition">
                  <input
                    type="checkbox"
                    checked={(formData.groups || []).includes(group.value)}
                    onChange={(e) => {
                      const newGroups = e.target.checked
                        ? [...(formData.groups || []), group.value]
                        : (formData.groups || []).filter((g) => g !== group.value)
                      setFormData({ ...formData, groups: newGroups })
                    }}
                    className="w-4 h-4 rounded bg-slate-600 border-slate-500 text-teal-500 focus:ring-teal-500"
                  />
                  <span className="text-white text-sm">{group.label}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
      </AdminModal>

      {/* Events List */}
      {loading ? (
        <AdminLoadingState message="Events werden geladen..." />
      ) : filteredEvents.length === 0 ? (
        <AdminEmptyState
          icon={Calendar}
          title={filter === 'all' ? 'Noch keine Events' : `Keine ${filter === 'upcoming' ? 'kommenden' : 'vergangenen'} Events`}
          description="Erstelle dein erstes Event, um loszulegen"
          action={{
            label: 'Event erstellen',
            icon: Plus,
            onClick: () => {
              resetForm()
              setShowForm(true)
            },
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface EventCardProps {
  event: Event
  onEdit: (event: Event) => void
  onDelete: (id: string) => void
}

function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg hover:border-slate-600 transition">
      <div
        className="p-3 md:p-4 flex items-start justify-between cursor-pointer gap-2"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="text-xl md:text-2xl font-bold text-teal-400 flex-shrink-0">
              {new Date(event.date).getDate()}
            </div>
            <div className="min-w-0">
              <h3 className="text-base md:text-lg font-semibold text-white truncate">{event.title}</h3>
              <p className="text-xs md:text-sm text-slate-400">
                {new Date(event.date).toLocaleDateString('de-DE', {
                  weekday: 'short',
                  month: 'short',
                  year: 'numeric',
                })}
                {event.time && ` • ${event.time}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
            <span className="inline-block px-2 py-0.5 md:py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
              {event.category}
            </span>
            {event.groups?.slice(0, 2).map((group) => (
              <span key={group} className="inline-block px-2 py-0.5 md:py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                {group}
              </span>
            ))}
            {(event.groups?.length || 0) > 2 && (
              <span className="text-xs text-slate-500">+{event.groups!.length - 2}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              onEdit(event)
            }}
            className="p-1.5 md:p-2 hover:bg-slate-700 rounded-lg transition"
            title="Bearbeiten"
          >
            <Edit2 size={16} className="text-blue-400 md:hidden" />
            <Edit2 size={18} className="text-blue-400 hidden md:block" />
          </button>
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              onDelete(event.id)
            }}
            className="p-1.5 md:p-2 hover:bg-red-500/20 rounded-lg transition"
            title="Löschen"
          >
            <Trash2 size={16} className="text-red-400 md:hidden" />
            <Trash2 size={18} className="text-red-400 hidden md:block" />
          </button>
          <ChevronDown
            size={16}
            className={`text-slate-400 transition md:hidden ${expanded ? 'rotate-180' : ''}`}
          />
          <ChevronDown
            size={18}
            className={`text-slate-400 transition hidden md:block ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-700 p-4 bg-slate-900/50 space-y-2 text-sm">
          <p>
            <span className="text-slate-400">📍 Ort:</span>
            <span className="text-white ml-2">
              {event.location}, {event.city}
            </span>
          </p>
          {event.note && (
            <p>
              <span className="text-slate-400">📝 Notiz:</span>
              <span className="text-white ml-2">{event.note}</span>
            </p>
          )}
          {event.href && (
            <p>
              <span className="text-slate-400">🔗 Link:</span>
              <span className="text-teal-400 ml-2">{event.href}</span>
            </p>
          )}
          <p className="text-xs text-slate-500 pt-2">
            Aktualisiert: {new Date(event.updated_at).toLocaleString('de-DE')}
          </p>
        </div>
      )}
    </div>
  )
}
