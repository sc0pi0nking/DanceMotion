'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, ExternalLink, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
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
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [deletingSponsor, setDeletingSponsor] = useState<Sponsor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    website_url: '',
    category: 'general',
  });

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSponsors(data || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
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
    });
    setIsModalOpen(true);
  };

  const openEditModal = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setFormData({
      name: sponsor.name,
      description: sponsor.description || '',
      logo_url: sponsor.logo_url || '',
      website_url: sponsor.website_url || '',
      category: sponsor.category,
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
        // Update existing
        const { data, error } = await supabase
          .from('sponsors')
          .update(formData)
          .eq('id', editingSponsor.id)
          .select()
          .single();

        if (error) throw error;
        setSponsors(sponsors.map((s) => (s.id === editingSponsor.id ? data : s)));
      } else {
        // Add new
        const session = await supabase.auth.getSession();
        if (!session.data.session) {
          alert('Nicht authentifiziert');
          return;
        }

        const { data, error } = await supabase
          .from('sponsors')
          .insert([{ ...formData, created_by: session.data.session.user.id }])
          .select()
          .single();

        if (error) throw error;
        setSponsors([...sponsors, data]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving sponsor:', error);
      alert('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSponsor) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('sponsors').delete().eq('id', deletingSponsor.id);
      if (error) throw error;
      setSponsors(sponsors.filter((s) => s.id !== deletingSponsor.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      alert('Fehler beim Löschen');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (sponsor: Sponsor) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({ is_active: !sponsor.is_active })
        .eq('id', sponsor.id);

      if (error) throw error;
      setSponsors(sponsors.map((s) =>
        s.id === sponsor.id ? { ...s, is_active: !s.is_active } : s
      ));
    } catch (error) {
      console.error('Error toggling sponsor:', error);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const sponsor1 = sponsors[index - 1];
    const sponsor2 = sponsors[index];

    try {
      await supabase.from('sponsors').update({ sort_order: sponsor2.sort_order }).eq('id', sponsor1.id);
      await supabase.from('sponsors').update({ sort_order: sponsor1.sort_order }).eq('id', sponsor2.id);

      const newSponsors = [...sponsors];
      [newSponsors[index - 1], newSponsors[index]] = [newSponsors[index], newSponsors[index - 1]];
      setSponsors(newSponsors);
    } catch (error) {
      console.error('Error moving sponsor:', error);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === sponsors.length - 1) return;
    const sponsor1 = sponsors[index];
    const sponsor2 = sponsors[index + 1];

    try {
      await supabase.from('sponsors').update({ sort_order: sponsor2.sort_order }).eq('id', sponsor1.id);
      await supabase.from('sponsors').update({ sort_order: sponsor1.sort_order }).eq('id', sponsor2.id);

      const newSponsors = [...sponsors];
      [newSponsors[index], newSponsors[index + 1]] = [newSponsors[index + 1], newSponsors[index]];
      setSponsors(newSponsors);
    } catch (error) {
      console.error('Error moving sponsor:', error);
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
                          <p className="text-sm text-slate-400 truncate max-w-xs">{sponsor.description}</p>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Logo URL
              </label>
              <AdminInput
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://..."
              />
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
