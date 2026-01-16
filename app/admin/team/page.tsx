'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Upload,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  order_index: number;
  social_links?: {
    instagram?: string;
    facebook?: string;
    email?: string;
  };
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    social_links: { instagram: '', facebook: '', email: '' },
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: err } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (err) throw err;
      setMembers(data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Laden';
      console.error('Load error:', err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const saveMember = async () => {
    if (!formData.name || !formData.role) {
      setError('Name und Rolle sind erforderlich');
      return;
    }

    try {
      setError(null);
      const maxOrder = members.length > 0 ? Math.max(...members.map(m => m.order_index)) : 0;

      if (editingId) {
        const { error: err } = await supabase
          .from('team_members')
          .update({
            name: formData.name,
            role: formData.role,
            bio: formData.bio || null,
            image_url: formData.image_url || null,
            social_links: formData.social_links,
          })
          .eq('id', editingId);

        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('team_members')
          .insert({
            name: formData.name,
            role: formData.role,
            bio: formData.bio || null,
            image_url: formData.image_url || null,
            order_index: maxOrder + 1,
            social_links: formData.social_links,
            published: true,
          });

        if (err) throw err;
      }

      resetForm();
      loadMembers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Speichern';
      setError(msg);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return;

    try {
      setError(null);
      const { error: err } = await supabase.from('team_members').delete().eq('id', id);
      if (err) throw err;
      loadMembers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Löschen';
      setError(msg);
    }
  };

  const togglePublished = async (member: TeamMember) => {
    try {
      setError(null);
      const { error: err } = await supabase
        .from('team_members')
        .update({ published: !member.published })
        .eq('id', member.id);

      if (err) throw err;
      loadMembers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Aktualisieren';
      setError(msg);
    }
  };

  const moveOrder = async (member: TeamMember, direction: 'up' | 'down') => {
    try {
      setError(null);
      const index = members.findIndex(m => m.id === member.id);
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === members.length - 1)) {
        return;
      }

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const targetMember = members[targetIndex];

      // Swap order_index
      await supabase.from('team_members').update({ order_index: targetMember.order_index }).eq('id', member.id);
      await supabase.from('team_members').update({ order_index: member.order_index }).eq('id', targetMember.id);

      loadMembers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Verschieben';
      setError(msg);
    }
  };

  const editMember = (member: TeamMember) => {
    const socialLinks = member.social_links || { instagram: '', facebook: '', email: '' };
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      image_url: member.image_url || '',
      social_links: {
        instagram: socialLinks.instagram || '',
        facebook: socialLinks.facebook || '',
        email: socialLinks.email || '',
      },
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      image_url: '',
      social_links: { instagram: '', facebook: '', email: '' },
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team-Mitglieder</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Hinzufügen
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
          <div>
            <p className="font-bold text-red-700 dark:text-red-300">Fehler</p>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-500 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{editingId ? 'Bearbeiten' : 'Neues Mitglied'}</h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Rolle *"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <textarea
            placeholder="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
            rows={3}
          />

          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Instagram"
              value={formData.social_links.instagram}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, instagram: e.target.value },
                })
              }
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="text"
              placeholder="Facebook"
              value={formData.social_links.facebook}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, facebook: e.target.value },
                })
              }
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <input
              type="email"
              placeholder="E-Mail"
              value={formData.social_links.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, email: e.target.value },
                })
              }
              className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {formData.image_url && (
            <div className="relative w-24 h-24">
              <Image
                src={formData.image_url}
                alt="Preview"
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={resetForm}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Abbrechen
            </button>
            <button
              onClick={saveMember}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save size={20} />
              Speichern
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Lädt...</div>
      ) : members.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Keine Team-Mitglieder vorhanden</div>
      ) : (
        <div className="space-y-3">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              {/* Bild */}
              <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {member.image_url ? (
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Upload size={24} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold truncate">{member.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{member.role}</p>
                {member.bio && <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-1">{member.bio}</p>}
              </div>

              {/* Status */}
              <button
                onClick={() => togglePublished(member)}
                className={`p-2 rounded-lg transition-colors ${
                  member.published
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
                title={member.published ? 'Veröffentlicht' : 'Verborgen'}
              >
                {member.published ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>

              {/* Order Controls */}
              <div className="flex gap-1">
                <button
                  onClick={() => moveOrder(member, 'up')}
                  disabled={index === 0}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30 transition-colors"
                  title="Nach oben"
                >
                  <ArrowUp size={18} />
                </button>
                <button
                  onClick={() => moveOrder(member, 'down')}
                  disabled={index === members.length - 1}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30 transition-colors"
                  title="Nach unten"
                >
                  <ArrowDown size={18} />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => editMember(member)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => deleteMember(member.id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  title="Löschen"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
