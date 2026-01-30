'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

export default function AdminSponsorsManager() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    website_url: '',
    category: 'general',
  });

  const categories = ['general', 'venue', 'equipment', 'media', 'partner'];

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

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      alert('Sponsor name is required');
      return;
    }

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        alert('Not authenticated');
        return;
      }

      const { data, error } = await supabase
        .from('sponsors')
        .insert([
          {
            ...formData,
            created_by: session.data.session.user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSponsors([...sponsors, data]);
      resetForm();
      alert('Sponsor added successfully!');
    } catch (error) {
      console.error('Error adding sponsor:', error);
      alert('Failed to add sponsor');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSponsors(sponsors.map((s) => (s.id === id ? data : s)));
      setEditing(null);
      resetForm();
      alert('Sponsor updated successfully!');
    } catch (error) {
      console.error('Error updating sponsor:', error);
      alert('Failed to update sponsor');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return;

    try {
      const { error } = await supabase.from('sponsors').delete().eq('id', id);

      if (error) throw error;

      setSponsors(sponsors.filter((s) => s.id !== id));
      alert('Sponsor deleted successfully!');
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      alert('Failed to delete sponsor');
    }
  };

  const handleToggleActive = async (sponsor: Sponsor) => {
    try {
      const { error } = await supabase
        .from('sponsors')
        .update({ is_active: !sponsor.is_active })
        .eq('id', sponsor.id);

      if (error) throw error;

      setSponsors(
        sponsors.map((s) =>
          s.id === sponsor.id ? { ...s, is_active: !s.is_active } : s
        )
      );
    } catch (error) {
      console.error('Error toggling sponsor:', error);
      alert('Failed to toggle sponsor status');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const sponsor1 = sponsors[index - 1];
    const sponsor2 = sponsors[index];

    try {
      await supabase
        .from('sponsors')
        .update({ sort_order: sponsor2.sort_order })
        .eq('id', sponsor1.id);

      await supabase
        .from('sponsors')
        .update({ sort_order: sponsor1.sort_order })
        .eq('id', sponsor2.id);

      const newSponsors = [...sponsors];
      [newSponsors[index - 1], newSponsors[index]] = [
        newSponsors[index],
        newSponsors[index - 1],
      ];
      setSponsors(newSponsors);
    } catch (error) {
      console.error('Error moving sponsor:', error);
      alert('Failed to move sponsor');
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === sponsors.length - 1) return;

    const sponsor1 = sponsors[index];
    const sponsor2 = sponsors[index + 1];

    try {
      await supabase
        .from('sponsors')
        .update({ sort_order: sponsor2.sort_order })
        .eq('id', sponsor1.id);

      await supabase
        .from('sponsors')
        .update({ sort_order: sponsor1.sort_order })
        .eq('id', sponsor2.id);

      const newSponsors = [...sponsors];
      [newSponsors[index], newSponsors[index + 1]] = [
        newSponsors[index + 1],
        newSponsors[index],
      ];
      setSponsors(newSponsors);
    } catch (error) {
      console.error('Error moving sponsor:', error);
      alert('Failed to move sponsor');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logo_url: '',
      website_url: '',
      category: 'general',
    });
    setEditing(null);
  };

  const startEdit = (sponsor: Sponsor) => {
    setFormData({
      name: sponsor.name,
      description: sponsor.description || '',
      logo_url: sponsor.logo_url || '',
      website_url: sponsor.website_url || '',
      category: sponsor.category,
    });
    setEditing(sponsor.id);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading sponsors...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Sponsors Management</h2>

        {/* Add/Edit Form */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editing ? 'Edit Sponsor' : 'Add New Sponsor'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sponsor Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                placeholder="e.g., DanceStudio Plus"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                rows={3}
                placeholder="Optional description of the sponsor"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, logo_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Website URL</label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) =>
                    setFormData({ ...formData, website_url: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => (editing ? handleUpdate(editing) : handleAdd())}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:opacity-90 font-medium"
              >
                {editing ? 'Update Sponsor' : 'Add Sponsor'}
              </button>
              {editing && (
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-border text-foreground rounded-md hover:bg-input font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sponsors List */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-4">Existing Sponsors</h3>
          {sponsors.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No sponsors yet</p>
          ) : (
            <div className="space-y-2">
              {sponsors.map((sponsor, index) => (
                <div
                  key={sponsor.id}
                  className={`flex items-center justify-between p-4 border border-border rounded-lg ${
                    sponsor.is_active
                      ? 'bg-card'
                      : 'bg-muted/30 opacity-60'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{sponsor.name}</h4>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                        {sponsor.category}
                      </span>
                      {!sponsor.is_active && (
                        <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    {sponsor.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {sponsor.description}
                      </p>
                    )}
                    {sponsor.website_url && (
                      <a
                        href={sponsor.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-accent hover:underline"
                      >
                        {sponsor.website_url}
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-2 hover:bg-input rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sponsors.length - 1}
                      className="p-2 hover:bg-input rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleToggleActive(sponsor)}
                      className="px-3 py-1 text-sm rounded hover:bg-input"
                      title={sponsor.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {sponsor.is_active ? '👁️' : '🚫'}
                    </button>
                    <button
                      onClick={() => startEdit(sponsor)}
                      className="px-3 py-1 text-sm bg-accent/20 text-accent rounded hover:bg-accent/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sponsor.id)}
                      className="px-3 py-1 text-sm bg-destructive/20 text-destructive rounded hover:bg-destructive/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
