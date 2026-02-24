'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, ExternalLink, Building2, Upload, X, Image as ImageIcon, Instagram, Facebook, Globe } from 'lucide-react';
import {
  AdminCard,
  StatCard,
  AdminEmptyState,
  AdminLoadingState,
  AdminModal,
  ModalCancelButton,
  ModalConfirmButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  FormGroup,
} from '@/app/admin/components';

interface Sponsor {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  social_links?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
}

const categories = [
  { value: 'general', label: 'Allgemein' },
  { value: 'venue', label: 'Veranstaltungsort' },
  { value: 'equipment', label: 'Ausrüstung' },
  { value: 'media', label: 'Medien' },
  { value: 'partner', label: 'Partner' },
];

const getCategoryLabel = (value: string) => {
  return categories.find(c => c.value === value)?.label || value;
};

export default function AdminSponsorsManager() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [deletingSponsor, setDeletingSponsor] = useState<Sponsor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    website_url: '',
    category: 'general',
    social_links: { instagram: '', facebook: '', tiktok: '', youtube: '' },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const getAuthErrorMessage = (status: number) => {
    if (status === 401) return 'Session abgelaufen. Bitte erneut anmelden.';
    if (status === 403) return 'Keine Berechtigung für diese Aktion.';
    return null;
  };

  const parseErrorMessage = async (response: Response, fallback: string) => {
    const authMessage = getAuthErrorMessage(response.status);
    if (authMessage) return authMessage;

    const errorData = await response.json().catch(() => ({}));
    return errorData?.error || fallback;
  };

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const adminRes = await fetch('/api/sponsors/admin', {
        method: 'GET',
        credentials: 'include',
      });

      if (adminRes.ok) {
        const data = await adminRes.json();
        setSponsors(data || []);
        return;
      }

      if (adminRes.status !== 404) {
        throw new Error(await parseErrorMessage(adminRes, 'Fehler beim Laden der Sponsoren'));
      }

      // Fallback: public endpoint (returns only active sponsors)
      const fallbackRes = await fetch('/api/sponsors', {
        method: 'GET',
        credentials: 'include',
      });

      if (!fallbackRes.ok) {
        throw new Error(await parseErrorMessage(fallbackRes, 'Fehler beim Laden der Sponsoren'));
      }

      const data = await fallbackRes.json();
      setSponsors(data || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Laden der Sponsoren');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingSponsor(null);
    setFormData({
      name: '',
      description: '',
      logo_url: '',
      website_url: '',
      category: 'general',
      social_links: { instagram: '', facebook: '', tiktok: '', youtube: '' },
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert(`Dateiformat nicht erlaubt: ${file.type}. Erlaubte Formate: JPG, PNG, GIF, WebP, SVG`);
        return;
      }

      // Max 2MB
      if (file.size > 2 * 1024 * 1024) {
        alert('Datei zu groß. Maximum: 2MB');
        return;
      }

      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const res = await fetch('/api/admin/sponsors/upload', {
        method: 'POST',
        body: formDataUpload,
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Upload fehlgeschlagen: ${err.error}`);
        return;
      }

      const { url } = await res.json();
      setFormData(prev => ({ ...prev, logo_url: url }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Fehler beim Hochladen');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!formData.logo_url) return;
    
    // Only delete if it's from our storage
    if (formData.logo_url.includes('sponsor-images')) {
      try {
        await fetch('/api/admin/sponsors/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ url: formData.logo_url }),
        });
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    
    setFormData(prev => ({ ...prev, logo_url: '' }));
  };

  const openEditModal = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setFormData({
      name: sponsor.name,
      description: sponsor.description || '',
      logo_url: sponsor.logo_url || '',
      website_url: sponsor.website_url || '',
      category: sponsor.category,
      social_links: {
        instagram: sponsor.social_links?.instagram || '',
        facebook: sponsor.social_links?.facebook || '',
        tiktok: sponsor.social_links?.tiktok || '',
        youtube: sponsor.social_links?.youtube || '',
      },
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (sponsor: Sponsor) => {
    setDeletingSponsor(sponsor);
    setIsDeleteModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Bitte geben Sie einen Sponsor-Namen ein');
      return;
    }

    setSaving(true);
    try {
      if (editingSponsor) {
        const res = await fetch(`/api/sponsors/${editingSponsor.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Fehler beim Speichern des Sponsors'));
        }

        const data = await res.json();
        setSponsors(sponsors.map((s) => (s.id === editingSponsor.id ? data : s)));
      } else {
        // Add new via API (uses httpOnly admin_session cookie)
        const res = await fetch('/api/sponsors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error(await parseErrorMessage(res, 'Fehler beim Erstellen des Sponsors'));
        }

        const data = await res.json();
        setSponsors([...sponsors, data]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving sponsor:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSponsor) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/sponsors/${deletingSponsor.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(await parseErrorMessage(res, 'Fehler beim Löschen des Sponsors'));
      }

      setSponsors(sponsors.filter((s) => s.id !== deletingSponsor.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Löschen');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (sponsor: Sponsor) => {
    try {
      const res = await fetch(`/api/sponsors/${sponsor.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ is_active: !sponsor.is_active }),
      });

      if (!res.ok) {
        throw new Error(await parseErrorMessage(res, 'Fehler beim Aktualisieren des Sponsor-Status'));
      }

      const updated = await res.json();
      setSponsors(sponsors.map((s) =>
        s.id === sponsor.id ? updated : s
      ));
    } catch (error) {
      console.error('Error toggling sponsor:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Aktualisieren des Sponsor-Status');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    
    // Swap positions in local array
    const newSponsors = [...sponsors];
    [newSponsors[index - 1], newSponsors[index]] = [newSponsors[index], newSponsors[index - 1]];

    // Assign sequential sort_order based on new positions
    try {
      const updates = newSponsors.map((s, i) => 
        fetch(`/api/sponsors/${s.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sort_order: i }),
        })
      );
      
      const results = await Promise.all(updates);
      if (results.some(r => !r.ok)) {
        throw new Error('Sort update failed');
      }

      setSponsors(newSponsors.map((s, i) => ({ ...s, sort_order: i })));
    } catch (error) {
      console.error('Error moving sponsor:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Verschieben des Sponsors');
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === sponsors.length - 1) return;

    // Swap positions in local array
    const newSponsors = [...sponsors];
    [newSponsors[index], newSponsors[index + 1]] = [newSponsors[index + 1], newSponsors[index]];

    // Assign sequential sort_order based on new positions
    try {
      const updates = newSponsors.map((s, i) => 
        fetch(`/api/sponsors/${s.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sort_order: i }),
        })
      );
      
      const results = await Promise.all(updates);
      if (results.some(r => !r.ok)) {
        throw new Error('Sort update failed');
      }

      setSponsors(newSponsors.map((s, i) => ({ ...s, sort_order: i })));
    } catch (error) {
      console.error('Error moving sponsor:', error);
      alert(error instanceof Error ? error.message : 'Fehler beim Verschieben des Sponsors');
    }
  };

  // Stats
  const activeCount = sponsors.filter(s => s.is_active).length;
  const inactiveCount = sponsors.filter(s => !s.is_active).length;

  if (loading) {
    return <AdminLoadingState message="Sponsoren werden geladen..." />;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Building2}
          label="Gesamt"
          value={sponsors.length}
          sublabel="Sponsoren insgesamt"
        />
        <StatCard
          icon={Eye}
          label="Aktiv"
          value={activeCount}
          sublabel="Werden angezeigt"
          color="from-emerald-500 to-green-500"
        />
        <StatCard
          icon={EyeOff}
          label="Inaktiv"
          value={inactiveCount}
          sublabel="Ausgeblendet"
          color="from-amber-500 to-orange-500"
        />
      </div>

      {/* Sponsors Table */}
      <AdminCard
        title="Alle Sponsoren"
        description="Verwalten Sie Ihre Sponsoren und Partner"
        headerAction={
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Sponsor hinzufügen
          </button>
        }
      >
        {sponsors.length === 0 ? (
          <AdminEmptyState
            title="Keine Sponsoren vorhanden"
            description="Fügen Sie Ihren ersten Sponsor hinzu, um zu beginnen."
            action={{
              label: 'Ersten Sponsor hinzufügen',
              onClick: openAddModal,
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400 w-16">Logo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Kategorie</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {sponsors.map((sponsor, index) => (
                  <tr key={sponsor.id} className={`border-b border-slate-700/50 hover:bg-slate-800/30 transition ${!sponsor.is_active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      {sponsor.logo_url ? (
                        <img 
                          src={sponsor.logo_url} 
                          alt={sponsor.name} 
                          className="w-10 h-10 object-contain rounded bg-white/10 p-1"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-slate-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{sponsor.name}</p>
                        {sponsor.description && (
                          <p className="text-sm text-slate-400 max-w-md">{sponsor.description}</p>
                        )}
                        {sponsor.website_url && (
                          <a 
                            href={sponsor.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-teal-400 hover:underline inline-flex items-center gap-1"
                          >
                            Website <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-slate-700 text-slate-300">
                        {getCategoryLabel(sponsor.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(sponsor)}
                        className={`px-2 py-1 text-xs rounded-full inline-flex items-center gap-1 transition ${
                          sponsor.is_active 
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                      >
                        {sponsor.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {sponsor.is_active ? 'Aktiv' : 'Inaktiv'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-2 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-white transition"
                          title="Nach oben"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === sponsors.length - 1}
                          className="p-2 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-white transition"
                          title="Nach unten"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(sponsor)}
                          className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-teal-400 transition"
                          title="Bearbeiten"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(sponsor)}
                          className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-red-400 transition"
                          title="Löschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* Add/Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSponsor ? 'Sponsor bearbeiten' : 'Neuen Sponsor hinzufügen'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <AdminInput
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="z.B. Tanzstudio Muster"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Beschreibung
            </label>
            <AdminTextarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Kurze Beschreibung des Sponsors..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Logo / Bild
              </label>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleImageUpload}
                className="hidden"
              />

              {formData.logo_url ? (
                <div className="relative">
                  <div className="w-full h-24 bg-slate-700/50 rounded-lg flex items-center justify-center overflow-hidden border border-slate-600">
                    <img 
                      src={formData.logo_url} 
                      alt="Logo Vorschau" 
                      className="max-h-full max-w-full object-contain p-2"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition"
                    title="Bild entfernen"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full h-24 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-teal-500 hover:text-teal-400 transition disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Wird hochgeladen...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span className="text-xs">Bild hochladen</span>
                    </>
                  )}
                </button>
              )}
              
              {/* Or enter URL manually */}
              <div className="mt-2">
                <AdminInput
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="Oder URL eingeben..."
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Website URL
              </label>
              <AdminInput
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Social Media Links
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <AdminInput
                  type="url"
                  value={formData.social_links.instagram}
                  onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, instagram: e.target.value } })}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <AdminInput
                  type="url"
                  value={formData.social_links.facebook}
                  onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, facebook: e.target.value } })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-300 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z"/></svg>
                <AdminInput
                  type="url"
                  value={formData.social_links.tiktok}
                  onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, tiktok: e.target.value } })}
                  placeholder="https://tiktok.com/@..."
                />
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <AdminInput
                  type="url"
                  value={formData.social_links.youtube}
                  onChange={(e) => setFormData({ ...formData, social_links: { ...formData.social_links, youtube: e.target.value } })}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Kategorie
            </label>
            <AdminSelect
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categories}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700">
          <ModalCancelButton onClick={() => setIsModalOpen(false)} />
          <ModalConfirmButton onClick={handleSave} loading={saving}>
            {editingSponsor ? 'Speichern' : 'Hinzufügen'}
          </ModalConfirmButton>
        </div>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Sponsor löschen"
      >
        <p className="text-slate-300 mb-6">
          Möchten Sie den Sponsor <strong className="text-white">{deletingSponsor?.name}</strong> wirklich löschen? 
          Diese Aktion kann nicht rückgängig gemacht werden.
        </p>

        <div className="flex justify-end gap-3">
          <ModalCancelButton onClick={() => setIsDeleteModalOpen(false)} />
          <button
            onClick={handleDelete}
            disabled={saving}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-lg font-medium transition"
          >
            {saving ? 'Wird gelöscht...' : 'Löschen'}
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
