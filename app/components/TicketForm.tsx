'use client'

import { useState } from 'react'
import { MessageSquare, AlertCircle } from 'lucide-react'

const categories = [
  { id: 'bug', label: 'Fehler oder Problem', description: 'Etwas funktioniert nicht richtig' },
  { id: 'incomplete', label: 'Unvollständiges Feature', description: 'Ein Feature ist unvollständig oder unklar' },
  { id: 'suggestion', label: 'Feature-Wunsch', description: 'Eine Idee für eine neue Funktion' },
  { id: 'question', label: 'Frage', description: 'Ich habe eine Frage zur Website' },
  { id: 'other', label: 'Sonstiges', description: 'Etwas anderes' },
]

const priorities = [
  { id: 'low', label: 'Niedrig' },
  { id: 'normal', label: 'Normal' },
  { id: 'high', label: 'Hoch' },
]

const guidanceText = {
  bug: 'Beschreibe bitte: Was wolltest du tun? Was hast du erwartet? Was ist stattdessen passiert?',
  incomplete: 'Erkläre, welcher Teil verwirrend ist oder was fehlt, um das Feature vollständig zu nutzen.',
  suggestion: 'Teile deine Idee mit und erkläre, warum sie die Website besser machen würde.',
  question: 'Stelle deine Frage so detailliert wie möglich.',
  other: 'Gib bitte einen aussagekräftigen Titel und Beschreibung.',
}

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
            <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-1">Dein Feedback hilft uns!</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Berichte von Fehlern, unvollständigen Features oder lass uns deine Ideen wissen. 
              Alles wird vollständig anonym verarbeitet und trägt zur Verbesserung bei.
            </p>
          </div>
        </div>
      </div>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-400 font-medium">
            ✓ Vielen Dank für dein Feedback! Wir kümmern uns darum.
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
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">
            Worum geht es? *
          </label>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all"
                style={{
                  borderColor: formData.category === cat.id ? 'var(--accent)' : 'var(--border)',
                  backgroundColor: formData.category === cat.id ? 'rgba(46,196,198,0.05)' : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={formData.category === cat.id}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{cat.label}</p>
                  <p className="text-xs text-muted mt-0.5">{cat.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Guidance */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Tipp:</strong> {guidanceText[formData.category as keyof typeof guidanceText]}
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
            Kurzer Titel *
          </label>
          <input
            type="text"
            required
            maxLength={100}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="z.B. 'Button wird nicht angeklickt' oder 'Formulare-Seite lädt nicht'"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-accent focus:outline-none"
          />
          <p className="text-xs text-muted mt-1">{formData.title.length}/100</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
            Detaillierte Beschreibung *
          </label>
          <textarea
            required
            maxLength={2000}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={`${
              formData.category === 'bug'
                ? 'Beispiel:\n1. Ich habe auf den Anmelden-Button geklickt\n2. Ich erwartete eine Anmeldeseite\n3. Stattdessen bekam ich eine Fehlermeldung'
                : formData.category === 'incomplete'
                ? 'Beispiel: Die Filterfunktion in der Galerie funktioniert, aber ich kann nicht nach Datum sortieren.'
                : formData.category === 'suggestion'
                ? 'Beispiel: Es wäre schön, eine Merkliste zu haben, um meine lieblings Gruppen zu speichern.'
                : 'Beschreibe bitte so detailliert wie möglich, was du wissen möchtest.'
            }`}
            rows={6}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-accent focus:outline-none resize-none"
          />
          <p className="text-xs text-muted mt-1">{formData.description.length}/2000</p>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
            Wie wichtig ist das? (Optional)
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
          <p className="text-xs text-muted mt-1">Beispiel: "Hoch" wenn etwas nicht funktioniert, "Niedrig" für eine kleine Verbesserung</p>
        </div>

        {/* Notice */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Datenschutz:</strong> Dieses Formular speichert keine persönlichen Daten. 
            Dein Feedback bleibt vollständig anonym.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !formData.title.trim() || !formData.description.trim()}
          className="w-full px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Wird gesendet...' : 'Feedback absenden'}
        </button>
      </form>
    </div>
  )
}
