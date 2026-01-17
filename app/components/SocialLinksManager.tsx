"use client";

import { useState, useEffect, useCallback } from "react";
import { Instagram, Facebook, Youtube, Twitter, Music2, Link, Plus, Trash2, Save, GripVertical, Eye, EyeOff } from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label: string;
  sort_order: number;
  is_visible: boolean;
}

// Available icons mapping
const iconOptions = [
  { value: "instagram", label: "Instagram", Icon: Instagram },
  { value: "facebook", label: "Facebook", Icon: Facebook },
  { value: "youtube", label: "YouTube", Icon: Youtube },
  { value: "twitter", label: "Twitter/X", Icon: Twitter },
  { value: "tiktok", label: "TikTok", Icon: Music2 },
  { value: "other", label: "Anderer Link", Icon: Link },
];

const getIconComponent = (iconName: string) => {
  const option = iconOptions.find(opt => opt.value === iconName);
  return option?.Icon || Link;
};

export default function SocialLinksManager() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // New link form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLink, setNewLink] = useState({
    platform: "",
    url: "",
    icon: "instagram",
    label: "",
  });

  // Fetch all links (including hidden for admin)
  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/social-links/admin");
      const data = await response.json();
      
      if (data.success) {
        setLinks(data.data || []);
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
    fetchLinks();
  }, [fetchLinks]);

  // Add new link
  const handleAddLink = async () => {
    if (!newLink.platform || !newLink.url || !newLink.label) {
      setError("Bitte alle Felder ausfüllen");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newLink,
          sort_order: links.length,
          is_visible: true,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setLinks([...links, data.data]);
        setNewLink({ platform: "", url: "", icon: "instagram", label: "" });
        setShowAddForm(false);
        setSuccess("Social Link hinzugefügt!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Fehler beim Hinzufügen");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Update link
  const handleUpdateLink = async (link: SocialLink) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch("/api/social-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(link),
      });

      const data = await response.json();
      
      if (data.success) {
        setLinks(links.map(l => l.id === link.id ? data.data : l));
        setSuccess("Änderungen gespeichert!");
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

  // Delete link
  const handleDeleteLink = async (id: string) => {
    if (!confirm("Social Link wirklich löschen?")) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/social-links?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      
      if (data.success) {
        setLinks(links.filter(l => l.id !== id));
        setSuccess("Link gelöscht!");
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

  // Toggle visibility
  const handleToggleVisibility = async (link: SocialLink) => {
    await handleUpdateLink({ ...link, is_visible: !link.is_visible });
  };

  // Update local state for editing
  const updateLocalLink = (id: string, field: keyof SocialLink, value: string | number | boolean) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: "var(--fg)" }}>
            Social Media Links
          </h2>
          <p className="text-sm text-muted mt-1">
            Verwalte die Social Media Links im Footer
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-accent flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
        >
          <Plus size={18} />
          Neuer Link
        </button>
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

      {/* Add Form */}
      {showAddForm && (
        <div className="p-6 rounded-xl" style={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)" }}>
          <h3 className="font-semibold mb-4" style={{ color: "var(--fg)" }}>Neuen Link hinzufügen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">Plattform</label>
              <input
                type="text"
                value={newLink.platform}
                onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                placeholder="z.B. Instagram"
                className="w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Label</label>
              <input
                type="text"
                value={newLink.label}
                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                placeholder="z.B. Folge uns auf Instagram"
                className="w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">URL</label>
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Icon</label>
              <select
                value={newLink.icon}
                onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                className="w-full px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
              >
                {iconOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddLink}
              disabled={saving}
              className="btn-accent px-4 py-2 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
            >
              <Save size={16} />
              Hinzufügen
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <Link size={48} className="mx-auto mb-4 opacity-50" />
            <p>Noch keine Social Media Links vorhanden</p>
          </div>
        ) : (
          links.map((link) => {
            const IconComponent = getIconComponent(link.icon);
            return (
              <div
                key={link.id}
                className={`p-4 rounded-xl transition-all ${!link.is_visible ? 'opacity-50' : ''}`}
                style={{ backgroundColor: "var(--panel)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-4">
                  {/* Drag handle placeholder */}
                  <div className="text-muted cursor-move">
                    <GripVertical size={20} />
                  </div>

                  {/* Icon preview */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
                  >
                    <IconComponent size={20} />
                  </div>

                  {/* Editable fields */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={link.platform}
                      onChange={(e) => updateLocalLink(link.id, "platform", e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-sm"
                      style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
                      placeholder="Plattform"
                    />
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateLocalLink(link.id, "label", e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-sm"
                      style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
                      placeholder="Label"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLocalLink(link.id, "url", e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-sm"
                      style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
                      placeholder="URL"
                    />
                  </div>

                  {/* Icon selector */}
                  <select
                    value={link.icon}
                    onChange={(e) => updateLocalLink(link.id, "icon", e.target.value)}
                    className="px-2 py-1.5 rounded-lg text-sm"
                    style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--fg)" }}
                  >
                    {iconOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleVisibility(link)}
                      className="p-2 rounded-lg transition-colors hover:bg-accent/10"
                      title={link.is_visible ? "Ausblenden" : "Einblenden"}
                    >
                      {link.is_visible ? (
                        <Eye size={18} style={{ color: "var(--accent)" }} />
                      ) : (
                        <EyeOff size={18} className="text-muted" />
                      )}
                    </button>
                    <button
                      onClick={() => handleUpdateLink(link)}
                      disabled={saving}
                      className="p-2 rounded-lg transition-colors hover:bg-accent/10"
                      title="Speichern"
                    >
                      <Save size={18} style={{ color: "var(--accent)" }} />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      disabled={saving}
                      className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                      title="Löschen"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
