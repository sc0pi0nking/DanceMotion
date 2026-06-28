'use client';

import { useState, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: 'allgemein', label: 'Allgemein' },
  { value: 'kurse', label: 'Kurse' },
  { value: 'anmeldung', label: 'Anmeldung' },
  { value: 'events', label: 'Events' },
  { value: 'preise', label: 'Preise' },
];

export default function FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [listRef] = useAutoAnimate<HTMLDivElement>();
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'allgemein',
    order_index: 0,
    published: true,
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchFAQs = async () => {
    try {
      const res = await fetch('/api/admin/faqs', { credentials: 'include' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'FAQs konnten nicht geladen werden');
      }
      const data = await res.json();
      setFaqs(data);
    } catch (error: any) {
      console.error('Failed to load FAQs:', error);
      showMessage('error', error.message || 'Fehler beim Laden der FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'FAQ konnte nicht erstellt werden');
      }

      showMessage('success', '✅ FAQ erstellt');
      fetchFAQs();
      setIsCreating(false);
      resetForm();
    } catch (error: any) {
      console.error('Failed to create FAQ:', error);
      showMessage('error', `❌ ${error.message}`);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<FAQ>) => {
    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'FAQ konnte nicht aktualisiert werden');
      }

      showMessage('success', '✅ FAQ aktualisiert');
      fetchFAQs();
      setEditingId(null);
    } catch (error: any) {
      console.error('Failed to update FAQ:', error);
      showMessage('error', `❌ ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('FAQ wirklich löschen?')) return;

    try {
      const res = await fetch(`/api/admin/faqs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'FAQ konnte nicht gelöscht werden');
      }

      showMessage('success', '✅ FAQ gelöscht');
      fetchFAQs();
    } catch (error: any) {
      console.error('Failed to delete FAQ:', error);
      showMessage('error', `❌ ${error.message}`);
    }
  };

  const togglePublished = async (faq: FAQ) => {
    await handleUpdate(faq.id, { published: !faq.published });
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'allgemein',
      order_index: 0,
      published: true,
    });
  };

  const startEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order_index: faq.order_index,
      published: faq.published,
    });
  };

  const filteredFAQs = filterCategory === 'all'
    ? faqs
    : faqs.filter(f => f.category === filterCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Lädt FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 text-sm ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-400 text-sm">
            {faqs.length} Fragen • {faqs.filter(f => f.published).length} veröffentlicht
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            resetForm();
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition w-full sm:w-auto"
        >
          <Plus size={18} />
          Neue FAQ
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 md:flex-wrap">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex-shrink-0 ${
            filterCategory === 'all'
              ? 'bg-teal-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
          }`}
        >
          Alle ({faqs.length})
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setFilterCategory(cat.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap flex-shrink-0 ${
              filterCategory === cat.value
                ? 'bg-teal-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
            }`}
          >
            {cat.label} ({faqs.filter(f => f.category === cat.value).length})
          </button>
        ))}
      </div>

      {/* Create Form */}
      {isCreating && (
        <div className="bg-slate-800 border-2 border-teal-500/50 rounded-xl p-5 md:p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Neue FAQ erstellen</h3>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Kategorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Frage</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
              placeholder="z.B. Was kostet eine Tanzstunde?"
              maxLength={500}
            />
            <p className="text-xs text-slate-500 mt-1">{formData.question.length}/500 Zeichen</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Antwort</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none resize-y"
              rows={5}
              placeholder="Die Antwort auf die Frage..."
              maxLength={5000}
            />
            <p className="text-xs text-slate-500 mt-1">{formData.answer.length}/5000 Zeichen</p>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 text-teal-500 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-300">Sofort veröffentlichen</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={!formData.question.trim() || !formData.answer.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-lg font-medium transition"
            >
              <Save size={16} />
              Speichern
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                resetForm();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
            >
              <X size={16} />
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div ref={listRef} className="space-y-3">
        {filteredFAQs.map((faq) => (
          <div
            key={faq.id}
            className={`bg-slate-800 border rounded-xl p-5 ${
              !faq.published
                ? 'opacity-60 border-dashed border-slate-500'
                : 'border-slate-700'
            }`}
          >
            {editingId === faq.id ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Kategorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Frage</label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Antwort</label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none resize-y"
                    rows={5}
                    maxLength={5000}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate(faq.id, formData)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white py-2.5 px-4 rounded-lg font-medium transition"
                  >
                    <Save size={16} />
                    Speichern
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      resetForm();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
                  >
                    <X size={16} />
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 text-xs font-medium bg-teal-500/20 text-teal-300 rounded">
                        {CATEGORIES.find(c => c.value === faq.category)?.label || faq.category}
                      </span>
                      {!faq.published && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-slate-600 text-slate-300 rounded">
                          Entwurf
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => togglePublished(faq)}
                      className={`p-2 rounded-lg transition ${
                        faq.published
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                      title={faq.published ? 'Veröffentlicht – klicken zum Verbergen' : 'Entwurf – klicken zum Veröffentlichen'}
                    >
                      {faq.published ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => startEdit(faq)}
                      className="p-2 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition"
                      title="Bearbeiten"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                      title="Löschen"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p>Keine FAQs in dieser Kategorie</p>
          </div>
        )}
      </div>
    </div>
  );
}
