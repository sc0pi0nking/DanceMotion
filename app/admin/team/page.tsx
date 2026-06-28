'use client';

import { useState, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Plus, Trash2, Eye, EyeOff, Save, X, Upload, ArrowUp, ArrowDown, AlertCircle, Loader2 } from 'lucide-react';
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
}

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [listRef] = useAutoAnimate<HTMLDivElement>();
  
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
      setError(null);
      setLoading(true);
      console.log('📥 Loading team members...');
      
      const { data, error: err } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (err) {
        console.error('❌ Load error:', err);
        throw err;
      }
      
      console.log('✅ Loaded:', data?.length || 0, 'members');
      setMembers(data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Laden';
      console.error('Load error:', err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setUploading(true);
      console.log('📤 Uploading image:', file.name, 'Type:', file.type, 'Size:', file.size);

      // Validiere File-Typ
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Dateiformat nicht erlaubt: ${file.type}. Erlaubte Formate: JPG, PNG, GIF, WebP`);
      }

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
      console.log('📝 Filename:', fileName);
      
      const { error: uploadErr, data } = await supabase.storage
        .from('team-images')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (uploadErr) {
        console.error('❌ Upload error:', uploadErr);
        console.error('Details:', JSON.stringify(uploadErr, null, 2));
        throw new Error(`Upload fehlgeschlagen: ${uploadErr.message}`);
      }

      console.log('✅ File uploaded, data:', data);

      const { data: publicUrl } = supabase.storage.from('team-images').getPublicUrl(fileName);
      console.log('✅ Upload successful:', publicUrl.publicUrl);
      
      setFormData(prev => ({ ...prev, image_url: publicUrl.publicUrl }));
      setSuccess('Bild erfolgreich hochgeladen!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Hochladen';
      console.error('❌ Upload error:', err);
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!formData.image_url) return;
    
    try {
      setError(null);
      setUploading(true);
      console.log('🗑️ Deleting image:', formData.image_url);

      // Extrahiere Filename aus URL
      const urlParts = formData.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Lösche aus Storage
      const { error: deleteErr } = await supabase.storage
        .from('team-images')
        .remove([fileName]);

      if (deleteErr) {
        console.error('❌ Delete error:', deleteErr);
        throw deleteErr;
      }

      console.log('✅ Image deleted');
      setFormData(prev => ({ ...prev, image_url: '' }));
      setSuccess('Bild gelöscht!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Löschen';
      console.error('❌ Delete error:', err);
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.role) {
      setError('Name und Rolle sind erforderlich');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const data = {
        name: formData.name,
        role: formData.role,
        bio: formData.bio || null,
        image_url: formData.image_url || null,
        social_links: formData.social_links,
      };

      if (editingId) {
        console.log('✏️ Updating member:', editingId);
        const { error: err } = await supabase
          .from('team_members')
          .update(data)
          .eq('id', editingId);

        if (err) throw err;
        console.log('✅ Updated');
        setSuccess('Team-Mitglied aktualisiert!');
      } else {
        console.log('➕ Creating new member');
        const maxOrder = members.length > 0 ? Math.max(...members.map(m => m.order_index)) : 0;
        
        const { error: err } = await supabase
          .from('team_members')
          .insert({
            ...data,
            order_index: maxOrder + 1,
            published: true,
          });

        if (err) throw err;
        console.log('✅ Created');
        setSuccess('Team-Mitglied hinzugefügt!');
      }

      resetForm();
      setTimeout(() => {
        loadMembers();
        setSuccess(null);
      }, 500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Speichern';
      console.error('Save error:', err);
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return;

    try {
      setError(null);
      console.log('🗑️ Deleting member:', id);

      const { error: err } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (err) throw err;
      console.log('✅ Deleted');
      
      setSuccess('Team-Mitglied gelöscht!');
      setTimeout(() => {
        loadMembers();
        setSuccess(null);
      }, 500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Löschen';
      console.error('Delete error:', err);
      setError(msg);
    }
  };

  const handleTogglePublished = async (member: TeamMember) => {
    try {
      setError(null);
      console.log('🔄 Toggling published:', member.id);

      const { error: err } = await supabase
        .from('team_members')
        .update({ published: !member.published })
        .eq('id', member.id);

      if (err) throw err;
      
      setMembers(members.map(m => 
        m.id === member.id ? { ...m, published: !m.published } : m
      ));
      console.log('✅ Toggled');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Aktualisieren';
      console.error('Toggle error:', err);
      setError(msg);
    }
  };

  const handleMove = async (member: TeamMember, direction: 'up' | 'down') => {
    try {
      setError(null);
      const idx = members.findIndex(m => m.id === member.id);
      
      if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === members.length - 1)) {
        return;
      }

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const target = members[targetIdx];

      console.log('↕️ Moving:', direction);

      await supabase.from('team_members').update({ order_index: target.order_index }).eq('id', member.id);
      await supabase.from('team_members').update({ order_index: member.order_index }).eq('id', target.id);

      loadMembers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Fehler beim Verschieben';
      console.error('Move error:', err);
      setError(msg);
    }
  };

  const handleEdit = (member: TeamMember) => {
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
          <p className="text-gray-600 dark:text-gray-400">Lädt Team-Mitglieder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team-Mitglieder</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} /> Hinzufügen
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-300">✅ {success}</p>
        </div>
      )}

      {/* Formular */}
      {showForm && (
        <div className="mb-6 p-4 md:p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {editingId ? 'Bearbeiten' : 'Neues Team-Mitglied'}
          </h2>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rolle *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Biografie</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profilbild</label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition w-fit">
                    <Upload size={18} />
                    <span>{uploading ? 'Lädt...' : 'Neues Bild'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} hidden />
                  </label>
                  {formData.image_url && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 break-all">
                      URL: {formData.image_url}
                    </div>
                  )}
                </div>
                {formData.image_url && (
                  <button
                    onClick={handleDeleteImage}
                    disabled={uploading}
                    type="button"
                    className="mt-2 px-3 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition text-sm disabled:opacity-50"
                    title="Bild löschen"
                  >
                    <Trash2 size={16} className="inline mr-1" />
                    Löschen
                  </button>
                )}
              </div>
              {formData.image_url && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Vorschau:</p>
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                    <img 
                      src={formData.image_url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('❌ Image load error:', e);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Social Media</label>
              <input
                type="text"
                placeholder="Instagram"
                value={formData.social_links.instagram}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  social_links: { ...prev.social_links, instagram: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="text"
                placeholder="Facebook"
                value={formData.social_links.facebook}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  social_links: { ...prev.social_links, facebook: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <input
                type="email"
                placeholder="E-Mail"
                value={formData.social_links.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  social_links: { ...prev.social_links, email: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? 'Speichert...' : 'Speichern'}
              </button>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <X size={18} /> Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team-Mitglieder Liste */}
      {members.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Keine Team-Mitglieder vorhanden</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Erstes Team-Mitglied hinzufügen
          </button>
        </div>
      ) : (
        <div ref={listRef} className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex gap-4 items-start"
            >
              {member.image_url && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                  <img 
                    src={member.image_url} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => console.error('Image load failed:', member.image_url)}
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                {member.bio && <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2">{member.bio}</p>}
              </div>

              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => handleMove(member, 'up')}
                  disabled={members.indexOf(member) === 0}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => handleMove(member, 'down')}
                  disabled={members.indexOf(member) === members.length - 1}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDown size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => handleTogglePublished(member)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {member.published ? (
                    <Eye size={18} className="text-green-600" />
                  ) : (
                    <EyeOff size={18} className="text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Save size={18} className="text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
