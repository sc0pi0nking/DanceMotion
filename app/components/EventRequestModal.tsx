'use client';

import { useState } from 'react';
import { X, Calendar, Users, Mail, Phone, User, MessageSquare } from 'lucide-react';

interface EventRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EVENT_TYPES = [
  { value: 'wedding', label: 'Hochzeit' },
  { value: 'corporate', label: 'Firmenfeier' },
  { value: 'birthday', label: 'Geburtstag' },
  { value: 'show', label: 'Show / Auftritt' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'other', label: 'Sonstiges' },
];

export default function EventRequestModal({ isOpen, onClose }: EventRequestModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_type: 'wedding',
    event_date: '',
    guest_count: '',
    message: '',
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // DSGVO-Prüfung: Datenschutz muss akzeptiert sein
    if (!privacyAccepted) {
      setError('Bitte akzeptieren Sie die Datenschutzerklärung');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/event-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          guest_count: formData.guest_count ? parseInt(formData.guest_count) : null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Anfrage fehlgeschlagen');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          event_type: 'wedding',
          event_date: '',
          guest_count: '',
          message: '',
        });
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: "var(--bg)" }}>
        {/* Header */}
        <div className="sticky top-0 p-6 rounded-t-2xl" style={{ backgroundColor: "var(--accent)" }}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--bg)" }}>Event-Anfrage</h2>
              <p className="mt-1" style={{ color: "rgba(10,10,10,0.7)" }}>Wir melden uns schnellstmöglich bei Ihnen!</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--bg)" }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="m-6 p-4 border rounded-lg" style={{ backgroundColor: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", color: "rgba(34,197,94,0.8)" }}>
            <p className="font-semibold text-center">
              ✓ Ihre Anfrage wurde erfolgreich gesendet!
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
              <User size={16} className="inline mr-2" />
              Ihr Name <span style={{ color: "var(--accent)" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{
                backgroundColor: "var(--panel)",
                color: "var(--fg)",
                borderColor: "var(--border)",
                "--tw-ring-color": "var(--accent)",
              } as any}
              placeholder="Max Mustermann"
              required
            />
          </div>

          {/* Email & Phone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                <Mail size={16} className="inline mr-2" />
                E-Mail <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{
                  backgroundColor: "var(--panel)",
                  color: "var(--fg)",
                  borderColor: "var(--border)",
                  "--tw-ring-color": "var(--accent)",
                } as any}
                placeholder="max@beispiel.de"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                <Phone size={16} className="inline mr-2" />
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{
                  backgroundColor: "var(--panel)",
                  color: "var(--fg)",
                  borderColor: "var(--border)",
                  "--tw-ring-color": "var(--accent)",
                } as any}
                placeholder="+49 123 456789"
              />
            </div>
          </div>

          {/* Event Type & Date */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                Event-Art <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <select
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{
                  backgroundColor: "var(--panel)",
                  color: "var(--fg)",
                  borderColor: "var(--border)",
                  "--tw-ring-color": "var(--accent)",
                } as any}
                required
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
                <Calendar size={16} className="inline mr-2" />
                Wunschdatum
              </label>
              <input
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                style={{
                  backgroundColor: "var(--panel)",
                  color: "var(--fg)",
                  borderColor: "var(--border)",
                  "--tw-ring-color": "var(--accent)",
                } as any}
              />
            </div>
          </div>

          {/* Guest Count */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
              <Users size={16} className="inline mr-2" />
              Anzahl Gäste (ca.)
            </label>
            <input
              type="number"
              value={formData.guest_count}
              onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{
                backgroundColor: "var(--panel)",
                color: "var(--fg)",
                borderColor: "var(--border)",
                "--tw-ring-color": "var(--accent)",
              } as any}
              placeholder="z.B. 100"
              min="1"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--fg)" }}>
              <MessageSquare size={16} className="inline mr-2" />
              Ihre Nachricht
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-y"
              style={{
                backgroundColor: "var(--panel)",
                color: "var(--fg)",
                borderColor: "var(--border)",
                "--tw-ring-color": "var(--accent)",
              } as any}
              rows={4}
              placeholder="Beschreiben Sie Ihr Event und Ihre Wünsche..."
            />
          </div>

          {/* DSGVO: Datenschutz-Checkbox */}
          <div className="p-4 border rounded-lg" style={{ backgroundColor: "rgba(46,196,198,0.08)", borderColor: "rgba(46,196,198,0.3)" }}>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy-consent"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded focus:outline-none focus:ring-2"
                style={{
                  accentColor: "var(--accent)",
                }}
                required
              />
              <label htmlFor="privacy-consent" className="text-sm" style={{ color: "var(--muted)" }}>
                Ich habe die{' '}
                <a 
                  href="/datenschutz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  Datenschutzerklärung
                </a>{' '}
                zur Kenntnis genommen. Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und für Rückfragen 
                dauerhaft gespeichert werden. <span className="font-semibold">Diese Einwilligung kann ich jederzeit 
                per E-Mail an info@dancemotion-eschweiler.de widerrufen.</span>
              </label>
            </div>
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              Ihre Daten werden verschlüsselt übertragen und ausschließlich zur Bearbeitung Ihrer Anfrage verwendet. 
              Nach 90 Tagen ohne Aktivität werden Ihre Daten automatisch gelöscht.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 border rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.8)" }}>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting || success}
              className="flex-1 font-semibold py-3 px-6 rounded-full transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--bg)",
              }}
            >
              {submitting ? 'Wird gesendet...' : success ? '✓ Gesendet!' : 'Anfrage senden'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full transition-colors"
              style={{
                backgroundColor: "var(--panel)",
                color: "var(--fg)",
                border: "1px solid var(--border)",
              }}
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
