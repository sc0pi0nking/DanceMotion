'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Upload, 
  Trash2, 
  Eye, 
  EyeOff,
  Plus,
  Save,
  X,
  Instagram,
  Facebook,
  Mail,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
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

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    order_index: 0,
    social_links: { instagram: '', facebook: '', email: '' },
    published: true,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/team');
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Failed to load team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, memberId?: string) => {
    try {
      setUploading(memberId || 'new');
      
      // Upload zu Supabase Storage (team-images bucket)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'team-images');
      
      const uploadRes = await fetch('/api/admin/gallery', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload fehlgeschlagen');

      const { url } = await uploadRes.json();
      
      if (memberId) {
        // Bestehendes Mitglied aktualisieren
        await fetch(`/api/admin/team/${memberId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: url }),
        });
        fetchMembers();
      } else {
        // Neues Formular aktualisieren
        setFormData(prev => ({ ...prev, image_url: url }));
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Fehler beim Hochladen des Bildes');
    } finally {
      setUploading(null);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowAddForm(false);
        setFormData({
          name: '',
          role: '',
          bio: '',
          image_url: '',
          order_index: members.length,
          social_links: { instagram: '', facebook: '', email: '' },
          published: true,
        });
        fetchMembers();
      }
    } catch (error) {
      console.error('Failed to create team member:', error);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.error('Failed to update team member:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Team-Mitglied wirklich löschen?')) return;

    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.error('Failed to delete team member:', error);
    }
  };

  const moveUp = async (member: TeamMember) => {
    const index = members.findIndex(m => m.id === member.id);
    if (index > 0) {
      const prev = members[index - 1];
      await handleUpdate(member.id, { order_index: prev.order_index });
      await handleUpdate(prev.id, { order_index: member.order_index });
    }
  };

  const moveDown = async (member: TeamMember) => {
    const index = members.findIndex(m => m.id === member.id);
    if (index < members.length - 1) {
      const next = members[index + 1];
      await handleUpdate(member.id, { order_index: next.order_index });
      await handleUpdate(next.id, { order_index: member.order_index });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Lädt Team-Mitglieder...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Team verwalten</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />}
          {showAddForm ? 'Abbrechen' : 'Mitglied hinzufügen'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 border-2 border-blue-500">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-white">Neues Team-Mitglied</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                placeholder="z.B. Sarah Müller"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Rolle *</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                placeholder="z.B. Trainerin Hip-Hop"
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Beschreibung</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 resize-y"
                rows={3}
                placeholder="Kurze Beschreibung..."
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Profilbild</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <Image src={formData.image_url} alt="Preview" width={100} height={100} className="rounded-lg object-cover" />
                </div>
              )}
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                <Instagram size={16} className="inline mr-1" /> Instagram
              </label>
              <input
                type="text"
                value={formData.social_links.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, instagram: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                <Facebook size={16} className="inline mr-1" /> Facebook
              </label>
              <input
                type="text"
                value={formData.social_links.facebook}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, facebook: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                <Mail size={16} className="inline mr-1" /> E-Mail
              </label>
              <input
                type="email"
                value={formData.social_links.email}
                onChange={(e) => setFormData({
                  ...formData,
                  social_links: { ...formData.social_links, email: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCreate}
              disabled={!formData.name || !formData.role}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={20} className="inline mr-2" />
              Speichern
            </button>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, index) => (
          <div
            key={member.id}
            className={`flip-card group bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-80 ${
              !member.published ? 'opacity-60 border-2 border-yellow-500' : ''
            }`}
          >
            <div className="flip-card-inner h-full flex flex-col">
              {/* Front - Image and Name */}
              <div className="flip-card-front w-full h-full flex flex-col bg-white dark:bg-gray-800">
            {/* Image */}
            <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
              {member.image_url ? (
                <Image
                  src={member.image_url}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <User size={64} className="text-gray-400" />
                </div>
              )}
              
              {/* Upload Overlay */}
              <label className="absolute bottom-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Upload size={20} className="text-gray-700 dark:text-gray-300" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, member.id);
                  }}
                />
              </label>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{member.role}</p>
                </div>
                
                {/* Order Controls */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveUp(member)}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30"
                  >
                    <ArrowUp size={16} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => moveDown(member)}
                    disabled={index === members.length - 1}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-30"
                  >
                    <ArrowDown size={16} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {member.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">{member.bio}</p>
              )}

              {/* Social Links */}
              {member.social_links && Object.keys(member.social_links).length > 0 && (
                <div className="flex gap-2 mb-3">
                  {member.social_links.instagram && (
                    <a
                      href={`https://instagram.com/${member.social_links.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Instagram size={16} className="text-pink-600" />
                    </a>
                  )}
                  {member.social_links.facebook && (
                    <a
                      href={`https://facebook.com/${member.social_links.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Facebook size={16} className="text-blue-600" />
                    </a>
                  )}
                  {member.social_links.email && (
                    <a
                      href={`mailto:${member.social_links.email}`}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Mail size={16} className="text-gray-600 dark:text-gray-400" />
                    </a>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(member.id, { published: !member.published })}
                  className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                    member.published
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {member.published ? <Eye size={16} className="inline mr-1" /> : <EyeOff size={16} className="inline mr-1" />}
                  {member.published ? 'Sichtbar' : 'Versteckt'}
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              </div>
              </div>

              {/* Back - Bio and Social Links (Flipped) */}
              <div className="flip-card-back w-full h-full flex flex-col bg-white dark:bg-gray-800 p-4 justify-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{member.name}</h3>
                {member.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{member.bio}</p>
                )}
                {member.social_links && Object.keys(member.social_links).length > 0 && (
                  <div className="flex gap-3">
                    {member.social_links.instagram && (
                      <a
                        href={`https://instagram.com/${member.social_links.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/20 transition-colors"
                      >
                        <Instagram size={20} className="text-pink-600" />
                      </a>
                    )}
                    {member.social_links.facebook && (
                      <a
                        href={`https://facebook.com/${member.social_links.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <Facebook size={20} className="text-blue-600" />
                      </a>
                    )}
                    {member.social_links.email && (
                      <a
                        href={`mailto:${member.social_links.email}`}
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Mail size={20} className="text-gray-600 dark:text-gray-400" />
                      </a>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">👆 Hover zum Zurückdrehen</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <User size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p>Noch keine Team-Mitglieder vorhanden.</p>
          <p className="text-sm">Klicken Sie auf "Mitglied hinzufügen" um zu starten.</p>
        </div>
      )}
    </div>
  );
}
