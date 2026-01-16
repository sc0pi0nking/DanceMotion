'use client';

import React, { useState } from 'react';
import { Mail, Phone, User, MessageSquare, Loader } from 'lucide-react';

interface ContactFormProps {
  onSuccess?: () => void;
  pageSource?: string; // z.B. "/formulare", "/eventstudio"
  className?: string;
}

export default function ContactForm({ onSuccess, pageSource = '/kontakt', className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Fehler zurücksetzen beim Tippen
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pageSource,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ein Fehler ist aufgetreten');
        return;
      }

      setSuccess(true);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      onSuccess?.();

      // Auto-Reset nach 5 Sekunden
      setTimeout(() => {
        setSuccess(false);
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Netzwerkfehler');
    } finally {
      setLoading(false);
    }
  };

  if (submitted && success) {
    return (
      <div
        className={`p-6 md:p-8 rounded-2xl text-center ${className}`}
        style={{
          backgroundColor: 'rgba(34,197,94,0.1)',
          border: '2px solid rgba(34,197,94,0.3)',
        }}
      >
        <div className="mb-4">
          <span style={{ fontSize: '3rem' }}>✓</span>
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'rgba(34,197,94,0.8)' }}>
          Vielen Dank!
        </h3>
        <p style={{ color: 'rgba(34,197,94,0.7)' }}>
          Ihre Nachricht wurde erfolgreich versendet. Wir melden uns in Kürze bei Ihnen!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Error Message */}
      {error && (
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: 'rgba(239,68,68,0.1)',
            borderColor: 'rgba(239,68,68,0.3)',
            color: 'rgba(239,68,68,0.8)',
          }}
        >
          <p className="text-sm font-medium">⚠️ {error}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>
          <User size={16} className="inline mr-2" />
          Ihr Name <span style={{ color: 'var(--accent)' }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Max Mustermann"
          required
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
          style={{
            backgroundColor: 'var(--panel)',
            color: 'var(--fg)',
            borderColor: 'var(--border)',
            '--tw-ring-color': 'var(--accent)',
          } as any}
          maxLength={100}
        />
      </div>

      {/* Email & Phone Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>
            <Mail size={16} className="inline mr-2" />
            E-Mail <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="max@beispiel.de"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
            style={{
              backgroundColor: 'var(--panel)',
              color: 'var(--fg)',
              borderColor: 'var(--border)',
              '--tw-ring-color': 'var(--accent)',
            } as any}
            maxLength={255}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>
            <Phone size={16} className="inline mr-2" />
            Telefon (optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+49 (0) 2405 ..."
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
            style={{
              backgroundColor: 'var(--panel)',
              color: 'var(--fg)',
              borderColor: 'var(--border)',
              '--tw-ring-color': 'var(--accent)',
            } as any}
            maxLength={30}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>
          <MessageSquare size={16} className="inline mr-2" />
          Betreff (optional)
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="z.B. Anfrage zu Gruppen"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition"
          style={{
            backgroundColor: 'var(--panel)',
            color: 'var(--fg)',
            borderColor: 'var(--border)',
            '--tw-ring-color': 'var(--accent)',
          } as any}
          maxLength={100}
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>
          <MessageSquare size={16} className="inline mr-2" />
          Nachricht <span style={{ color: 'var(--accent)' }}>*</span>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Schreiben Sie hier Ihre Nachricht..."
          required
          rows={6}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
          style={{
            backgroundColor: 'var(--panel)',
            color: 'var(--fg)',
            borderColor: 'var(--border)',
            '--tw-ring-color': 'var(--accent)',
          } as any}
          maxLength={5000}
        />
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          {formData.message.length}/5000 Zeichen
        </p>
      </div>

      {/* Privacy Notice */}
      <div
        className="p-3 rounded-lg text-xs"
        style={{
          backgroundColor: 'rgba(46,196,198,0.05)',
          borderLeft: '3px solid var(--accent)',
          color: 'var(--muted)',
        }}
      >
        <p>
          🔒 <strong>Datenschutz:</strong> Ihre Daten werden ausschließlich zum Beantworten Ihrer Anfrage
          verwendet und nicht gespeichert. Weitere Infos in unserer{' '}
          <a href="/datenschutz" className="underline hover:opacity-80">
            Datenschutzerklärung
          </a>
          .
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: loading ? 'rgba(46,196,198,0.5)' : 'var(--accent)',
          color: 'var(--bg)',
        }}
      >
        {loading ? (
          <>
            <Loader size={18} className="animate-spin" />
            Wird versendet...
          </>
        ) : (
          <>
            <MessageSquare size={18} />
            Nachricht senden
          </>
        )}
      </button>
    </form>
  );
}
