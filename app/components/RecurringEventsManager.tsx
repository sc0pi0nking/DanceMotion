"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Calendar, Clock, MapPin, Plus, Trash2, Save, 
  RefreshCw, Edit, X, Check, Play, Pause 
} from "lucide-react";

interface RecurringEvent {
  id: string;
  title: string;
  time: string | null;
  location: string;
  city: string;
  category: 'Auftritt' | 'Workshop' | 'Training' | 'Event';
  groups: string[];
  note: string | null;
  href: string | null;
  recurrence_type: 'weekly' | 'biweekly' | 'monthly';
  day_of_week: number | null;
  day_of_month: number | null;
  start_date: string;
  end_date: string | null;
  excluded_dates: string[];
  is_active: boolean;
}

const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const categories = ['Auftritt', 'Workshop', 'Training', 'Event'];
const recurrenceTypes = [
  { value: 'weekly', label: 'Wöchentlich' },
  { value: 'biweekly', label: 'Alle 2 Wochen' },
  { value: 'monthly', label: 'Monatlich' },
];

const emptyEvent: Omit<RecurringEvent, 'id'> = {
  title: '',
  time: null,
  location: '',
  city: 'Eschweiler',
  category: 'Training',
  groups: [],
  note: null,
  href: null,
  recurrence_type: 'weekly',
  day_of_week: 1, // Monday
  day_of_month: null,
  start_date: new Date().toISOString().split('T')[0],
  end_date: null,
  excluded_dates: [],
  is_active: true,
};

export default function RecurringEventsManager() {
  const [events, setEvents] = useState<RecurringEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyEvent);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/recurring-events");
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data || []);
      } else {
        setError(data.error || "Fehler beim Laden");
      }
    } catch (err) {
      setError("Netzwerkfehler beim Laden");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.location || !formData.start_date) {
      setError("Bitte alle Pflichtfelder ausfüllen");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const url = "/api/recurring-events";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { id: editingId, ...formData } : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (data.success) {
        if (editingId) {
          setEvents(events.map(e => e.id === editingId ? data.data : e));
          setSuccess("Änderungen gespeichert!");
        } else {
          setEvents([...events, data.data]);
          setSuccess("Wiederkehrender Termin erstellt!");
        }
        resetForm();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Fehler beim Speichern");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, deleteFuture: boolean = false) => {
    const confirmMsg = deleteFuture 
      ? "Wiederkehrenden Termin und alle zukünftigen generierten Termine löschen?"
      : "Nur die Vorlage löschen? (Bereits generierte Termine bleiben erhalten)";
    
    if (!confirm(confirmMsg)) return;

    try {
      setSaving(true);
      const response = await fetch(
        `/api/recurring-events?id=${id}&deleteFutureEvents=${deleteFuture}`,
        { method: "DELETE" }
      );

      const data = await response.json();
      
      if (data.success) {
        setEvents(events.filter(e => e.id !== id));
        setSuccess("Gelöscht!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Fehler beim Löschen");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (event: RecurringEvent) => {
    try {
      setSaving(true);
      const response = await fetch("/api/recurring-events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: event.id, is_active: !event.is_active }),
      });

      const data = await response.json();
      
      if (data.success) {
        setEvents(events.map(e => e.id === event.id ? data.data : e));
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Fehler beim Aktualisieren");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateEvents = async () => {
    if (!confirm("Termine für die nächsten 90 Tage generieren?")) return;

    try {
      setGenerating(true);
      setError(null);

      const response = await fetch("/api/recurring-events/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daysAhead: 90 }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Fehler beim Generieren");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const startEditing = (event: RecurringEvent) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      time: event.time,
      location: event.location,
      city: event.city,
      category: event.category,
      groups: event.groups,
      note: event.note,
      href: event.href,
      recurrence_type: event.recurrence_type,
      day_of_week: event.day_of_week,
      day_of_month: event.day_of_month,
      start_date: event.start_date,
      end_date: event.end_date,
      excluded_dates: event.excluded_dates,
      is_active: event.is_active,
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData(emptyEvent);
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent border-r-transparent" />
        <p className="mt-4 text-muted">Laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: "var(--fg)" }}>
            Wiederkehrende Termine
          </h2>
          <p className="text-sm text-muted mt-1">
            Erstelle Vorlagen für regelmäßige Trainings und Events
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerateEvents}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border"
            style={{ borderColor: "var(--border)", color: "var(--fg)" }}
          >
            <RefreshCw size={18} className={generating ? "animate-spin" : ""} />
            {generating ? "Generiere..." : "Termine generieren"}
          </button>
          <button
            onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}
            className="btn-accent flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            <Plus size={18} />
            Neue Vorlage
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
          {success}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-6 rounded-xl" style={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg" style={{ color: "var(--fg)" }}>
              {editingId ? "Vorlage bearbeiten" : "Neue Vorlage erstellen"}
            </h3>
            <button type="button" onClick={resetForm} className="text-muted hover:text-fg">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm text-muted mb-1">Titel *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="z.B. Training Emotion"
                required
                className="w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-muted mb-1">Kategorie *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as RecurringEvent['category'] })}
                className="w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm text-muted mb-1">Uhrzeit</label>
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value || null })}
                className="w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm text-muted mb-1">Ort *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="z.B. Turnhalle Talbahnhof"
                required
                className="w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm text-muted mb-1">Stadt *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Eschweiler"
                required
                className="w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              />
            </div>

            {/* Recurrence Type */}
            <div>
              <label className="block text-sm text-muted mb-1">Wiederholung *</label>
              <select
                value={formData.recurrence_type}
                onChange={(e) => setFormData({ ...formData, recurrence_type: e.target.value as RecurringEvent['recurrence_type'] })}
                className="w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              >
                {recurrenceTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Day of Week (for weekly/biweekly) */}
            {(formData.recurrence_type === 'weekly' || formData.recurrence_type === 'biweekly') && (
              <div>
                <label className="block text-sm text-muted mb-1">Wochentag *</label>
                <select
                  value={formData.day_of_week ?? 1}
                  onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
                >
                  {dayNames.map((day, idx) => (
                    <option key={idx} value={idx}>{day}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Start Date */}
            <div>
              <label className="block text-sm text-muted mb-1">Startdatum *</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              />
            </div>

            {/* End Date (optional) */}
            <div>
              <label className="block text-sm text-muted mb-1">Enddatum (optional)</label>
              <input
                type="date"
                value={formData.end_date || ""}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value || null })}
                className="w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              />
            </div>

            {/* Note */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm text-muted mb-1">Notiz (optional)</label>
              <textarea
                value={formData.note || ""}
                onChange={(e) => setFormData({ ...formData, note: e.target.value || null })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg resize-none"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="btn-accent px-6 py-2 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
            >
              <Save size={16} />
              {editingId ? "Speichern" : "Erstellen"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>Noch keine wiederkehrenden Termine vorhanden</p>
            <p className="text-sm mt-2">Erstelle eine Vorlage für regelmäßige Trainings oder Events</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-xl transition-all ${!event.is_active ? 'opacity-50' : ''}`}
              style={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold" style={{ color: "var(--fg)" }}>{event.title}</h3>
                    <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}>
                      {event.category}
                    </span>
                    {!event.is_active && (
                      <span className="px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-400">
                        Pausiert
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {recurrenceTypes.find(t => t.value === event.recurrence_type)?.label}
                      {event.day_of_week !== null && `, ${dayNames[event.day_of_week]}`}
                    </span>
                    {event.time && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {event.time.slice(0, 5)} Uhr
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {event.location}, {event.city}
                    </span>
                  </div>
                  
                  {event.note && (
                    <p className="text-sm text-muted mt-2 italic">{event.note}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(event)}
                    className="p-2 rounded-lg transition-colors hover:bg-accent/10"
                    title={event.is_active ? "Pausieren" : "Aktivieren"}
                  >
                    {event.is_active ? (
                      <Pause size={18} style={{ color: "var(--accent)" }} />
                    ) : (
                      <Play size={18} className="text-green-400" />
                    )}
                  </button>
                  <button
                    onClick={() => startEditing(event)}
                    className="p-2 rounded-lg transition-colors hover:bg-accent/10"
                    title="Bearbeiten"
                  >
                    <Edit size={18} style={{ color: "var(--accent)" }} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id, true)}
                    disabled={saving}
                    className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                    title="Löschen"
                  >
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: "var(--accent)", color: "var(--bg)", opacity: 0.9 }}>
        <p className="font-medium mb-2">💡 So funktioniert&apos;s:</p>
        <ul className="space-y-1 text-sm opacity-90">
          <li>• Erstelle eine Vorlage für wiederkehrende Termine (z.B. wöchentliches Training)</li>
          <li>• Klicke auf &quot;Termine generieren&quot; um Termine für die nächsten 90 Tage zu erstellen</li>
          <li>• Generierte Termine erscheinen automatisch auf der Website und in der Termine-Verwaltung</li>
          <li>• Du kannst einzelne generierte Termine in der Termine-Verwaltung bearbeiten oder löschen</li>
        </ul>
      </div>
    </div>
  );
}
