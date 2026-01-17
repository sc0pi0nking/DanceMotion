'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Shield, Check, X, RefreshCw, Users } from 'lucide-react'

// Alle verfügbaren Permissions mit deutschen Labels
const ALL_PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard', description: 'Zugriff auf Admin-Übersicht' },
  { key: 'events', label: 'Termine', description: 'Termine verwalten' },
  { key: 'recurring', label: 'Wiederkehrend', description: 'Wiederkehrende Termine' },
  { key: 'content', label: 'Inhalte', description: 'Texte bearbeiten' },
  { key: 'gallery', label: 'Galerie', description: 'Bilder verwalten' },
  { key: 'documents', label: 'Dokumente', description: 'Dokumente verwalten' },
  { key: 'faqs', label: 'FAQs', description: 'FAQ verwalten' },
  { key: 'team', label: 'Team', description: 'Team-Mitglieder verwalten' },
  { key: 'wiki_admin', label: 'Admin Wiki', description: 'Admin Wiki (Non-Technical)' },
  { key: 'wiki_dev', label: 'Dev Wiki', description: 'Dev Wiki (Technical)' },
  { key: 'social', label: 'Social Media', description: 'Social Links verwalten' },
  { key: 'users', label: 'Benutzer', description: 'Benutzer verwalten' },
  { key: 'roles', label: 'Rollen', description: 'Rollen verwalten' },
  { key: 'analytics', label: 'Analytics', description: 'Statistiken einsehen' },
  { key: 'audit', label: 'Audit Log', description: 'Audit Log einsehen' },
  { key: 'settings', label: 'Einstellungen', description: 'System-Einstellungen' },
]

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  user_count?: number
  created_at: string
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/roles')
      if (!res.ok) throw new Error('Failed to fetch roles')
      const data = await res.json()
      setRoles(data)
    } catch (err) {
      setError('Fehler beim Laden der Rollen')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingRole(null)
    setFormData({ name: '', description: '', permissions: ['dashboard'] })
    setShowModal(true)
  }

  const openEditModal = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: Array.isArray(role.permissions) ? role.permissions : [],
    })
    setShowModal(true)
  }

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }))
  }

  const selectAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: ALL_PERMISSIONS.map(p => p.key),
    }))
  }

  const clearAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (editingRole) {
        const res = await fetch(`/api/admin/roles/${editingRole.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Update failed')
        }
      } else {
        if (!formData.name) {
          throw new Error('Name ist erforderlich')
        }

        const res = await fetch('/api/admin/roles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Creation failed')
        }
      }

      setShowModal(false)
      fetchRoles()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setSaving(false)
    }
  }

  const deleteRole = async (role: Role) => {
    if (role.name === 'admin') {
      setError('Die Admin-Rolle kann nicht gelöscht werden')
      return
    }

    if (role.user_count && role.user_count > 0) {
      setError(`Diese Rolle kann nicht gelöscht werden: ${role.user_count} Benutzer zugewiesen`)
      return
    }

    if (!confirm(`Rolle "${role.name}" wirklich löschen?`)) return

    try {
      const res = await fetch(`/api/admin/roles/${role.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Delete failed')
      }

      fetchRoles()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin" size={32} style={{ color: 'var(--accent)' }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
            Rollen verwalten
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {roles.length} Rollen definiert
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
        >
          <Plus size={20} />
          Neue Rolle
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
          {error}
          <button onClick={() => setError('')} className="ml-4 underline">Schließen</button>
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className="rounded-xl p-5 transition-all hover:shadow-lg"
            style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(46,196,198,0.1)' }}
                >
                  <Shield size={20} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold capitalize" style={{ color: 'var(--fg)' }}>
                    {role.name}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    {role.description || 'Keine Beschreibung'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditModal(role)}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-500/10"
                  title="Bearbeiten"
                >
                  <Edit2 size={16} style={{ color: 'var(--muted)' }} />
                </button>
                {role.name !== 'admin' && (
                  <button
                    onClick={() => deleteRole(role)}
                    className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                    title="Löschen"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                )}
              </div>
            </div>

            {/* User Count */}
            <div 
              className="flex items-center gap-2 mb-3 text-sm"
              style={{ color: 'var(--muted)' }}
            >
              <Users size={14} />
              <span>{role.user_count || 0} Benutzer</span>
            </div>

            {/* Permissions */}
            <div className="flex flex-wrap gap-1">
              {Array.isArray(role.permissions) && role.permissions.slice(0, 6).map((perm) => (
                <span
                  key={perm}
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: 'rgba(46,196,198,0.1)', color: 'var(--accent)' }}
                >
                  {ALL_PERMISSIONS.find(p => p.key === perm)?.label || perm}
                </span>
              ))}
              {Array.isArray(role.permissions) && role.permissions.length > 6 && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: 'var(--bg)', color: 'var(--muted)' }}
                >
                  +{role.permissions.length - 6} mehr
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div 
            className="w-full max-w-2xl rounded-2xl p-6 shadow-2xl my-8"
            style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--fg)' }}>
              {editingRole ? 'Rolle bearbeiten' : 'Neue Rolle'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={editingRole?.name === 'admin'}
                  className="w-full px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                  style={{ 
                    backgroundColor: 'var(--bg)', 
                    border: '1px solid var(--border)',
                    color: 'var(--fg)'
                  }}
                  required
                  placeholder="z.B. content-manager"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>
                  Beschreibung
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: 'var(--bg)', 
                    border: '1px solid var(--border)',
                    color: 'var(--fg)'
                  }}
                  placeholder="Kurze Beschreibung der Rolle"
                />
              </div>

              {/* Permissions Matrix */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                    Berechtigungen ({formData.permissions.length}/{ALL_PERMISSIONS.length})
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAllPermissions}
                      className="text-xs px-2 py-1 rounded transition-colors"
                      style={{ color: 'var(--accent)' }}
                    >
                      Alle auswählen
                    </button>
                    <button
                      type="button"
                      onClick={clearAllPermissions}
                      className="text-xs px-2 py-1 rounded transition-colors"
                      style={{ color: 'var(--muted)' }}
                    >
                      Alle abwählen
                    </button>
                  </div>
                </div>

                <div 
                  className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 rounded-lg max-h-64 overflow-y-auto"
                  style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}
                >
                  {ALL_PERMISSIONS.map((perm) => (
                    <label
                      key={perm.key}
                      className="flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-500/5"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.key)}
                        onChange={() => togglePermission(perm.key)}
                        className="mt-1 accent-teal-500"
                      />
                      <div>
                        <div className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                          {perm.label}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--muted)' }}>
                          {perm.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Selected Permissions Preview */}
              {formData.permissions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>
                    Ausgewählte Berechtigungen:
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {formData.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: 'rgba(46,196,198,0.1)', color: 'var(--accent)' }}
                      >
                        <Check size={12} />
                        {ALL_PERMISSIONS.find(p => p.key === perm)?.label || perm}
                        <button
                          type="button"
                          onClick={() => togglePermission(perm)}
                          className="ml-1 hover:opacity-70"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
                >
                  {saving ? 'Speichern...' : (editingRole ? 'Aktualisieren' : 'Erstellen')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
