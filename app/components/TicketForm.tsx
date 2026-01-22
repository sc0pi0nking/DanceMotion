'use client'

import { useState } from 'react'
import { MessageSquare, AlertCircle } from 'lucide-react'

const categories = [
  { id: 'idea', label: 'Veranstaltungsidee' },
  { id: 'complaint', label: 'Beschwerde' },
  { id: 'suggestion', label: 'Verbesserungsvorschlag' },
  { id: 'question', label: 'Frage' },
  { id: 'other', label: 'Sonstiges' },
]

const priorities = [
  { id: 'low', label: 'Niedrig' },
  { id: 'normal', label: 'Normal' },
  { id: 'high', label: 'Hoch' },
]

export default function TicketForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'question',
    priority: 'normal',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSubmitted(true)
        setFormData({
          title: '',
          description: '',
          category: 'question',
          priority: 'normal',
        })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        const data = await res.json()
        setError(data.error || 'Fehler beim Absenden')
      }
    } catch (err) {
      setError('Netzwerkfehler - bitte versuchen Sie es später erneut')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Info Box */}
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex gap-3">
          <MessageSquare className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-1">Vollständig anonym</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Deine Anfrage wird vollständig anonym verarbeitet. Wir speichern keine persönlichen Daten und 
              achten strengen Datenschutz. Dies ermöglicht dir freies Feedback ohne Bedenken.
            </p>
          </div>
        </div>
      </div>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-400 font-medium">
            ✓ Vielen Dank! Dein Ticket wurde erfolgreich eingereicht. Wir kümmern uns darum!
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
            <p className="text-red-800 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
            Betreff *
          </label>
          <input
            type="text"
            required
            maxLength={100}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Kurze Zusammenfassung des Anliegens"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-accent focus:outline-none"
          />
          <p className="text-xs text-muted mt-1">{formData.title.length}/100</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
            Kategorie *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-accent focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
            Wichtigkeit
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-accent focus:outline-none"
          >
            {priorities.map((prio) => (
              <option key={prio.id} value={prio.id}>
                {prio.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted mt-1">Optional - hilft uns bei der Priorisierung</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
            Beschreibung *
          </label>
          <textarea
            required
            maxLength={2000}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Bitte gib uns möglichst detailliert Bescheid, worum es geht. Vermeiden bitte technische Fehlerberichte - diese teile uns per Mail mit."
            rows={6}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-accent focus:outline-none resize-none"
          />
          <p className="text-xs text-muted mt-1">{formData.description.length}/2000</p>
        </div>

        {/* Notice */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Hinweis:</strong> Dies ist kein Kontaktformular und ermöglicht keine direkte Kommunikation. 
            Dein Ticket wird von unserem Admin-Team gelesen und entsprechend bearbeitet. 
            Für dringende oder technische Anfragen nutze bitte unseren Email-Kontakt.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !formData.title.trim() || !formData.description.trim()}
          className="w-full px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Wird gesendet...' : 'Ticket einreichen'}
        </button>
      </form>
    </div>
  )
}
