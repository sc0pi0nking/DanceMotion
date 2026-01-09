'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, ChevronDown } from 'lucide-react'
import type { Event } from '@/lib/supabase'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
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
    { value: 'eventstudio', label: 'Eventstudio' },
  ]

  const categories: Array<'Auftritt' | 'Workshop' | 'Training' | 'Event'> = ['Auftritt', 'Workshop', 'Training', 'Event']

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Termine verwalten</h1>
          <p className="text-slate-400 text-sm md:text-base">Erstelle, bearbeite und lösche deine Events</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-teal-500/50 transition font-medium w-full sm:w-auto"
        >
          <Plus size={20} />
          Neues Event
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
            {editingId ? 'Event bearbeiten' : 'Neues Event erstellen'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <input
                type="text"
                placeholder="Event Titel"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                required
              />

              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
                required
              />

              <input
                type="time"
                value={formData.time || ''}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />

              <input
                type="text"
                placeholder="Veranstaltungsort"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                required
              />

              <input
                type="text"
                placeholder="Stadt"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                required
              />

              <select
                value={formData.category || 'Event'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'Auftritt' | 'Workshop' | 'Training' | 'Event' })}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Zusatzinfo (optional)"
                value={formData.note || ''}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />

              <input
                type="text"
                placeholder="Link (optional)"
                value={formData.href || ''}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Gruppen (mehrfache Auswahl möglich)</label>
              <div className="flex flex-wrap gap-2">
                {groupOptions.map((group) => (
                  <label key={group.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData.groups || []).includes(group.value)}
                      onChange={(e) => {
                        const newGroups = e.target.checked
                          ? [...(formData.groups || []), group.value]
                          : (formData.groups || []).filter((g) => g !== group.value)
                        setFormData({ ...formData, groups: newGroups })
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-white text-sm">{group.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition font-medium"
              >
                {editingId ? 'Aktualisieren' : 'Erstellen'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition font-medium"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-slate-400">Lädt...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-slate-400">Noch keine Events. Erstelle eins!</div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
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
