'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, User, Shield, Check, X, Eye, EyeOff, RefreshCw } from 'lucide-react'

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  user_count?: number
}

interface AdminUser {
  id: string
  email: string
  name: string | null
  phone: string | null
  is_active: boolean
  last_login: string | null
  created_at: string
  role_id: string | null
  role_name: string | null
  permissions: string[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role_id: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersRes, rolesRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/roles'),
      ])

      if (!usersRes.ok || !rolesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [usersData, rolesData] = await Promise.all([
        usersRes.json(),
        rolesRes.json(),
      ])

      setUsers(usersData)
      setRoles(rolesData)
    } catch (err) {
      setError('Fehler beim Laden der Daten')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingUser(null)
    setFormData({ email: '', password: '', name: '', phone: '', role_id: '' })
    setShowModal(true)
  }

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      password: '',
      name: user.name || '',
      phone: user.phone || '',
      role_id: user.role_id || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (editingUser) {
        // Update
        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name || null,
            phone: formData.phone || null,
            role_id: formData.role_id || null,
            password: formData.password || undefined,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Update failed')
        }
      } else {
        // Create
        if (!formData.email || !formData.password) {
          throw new Error('Email und Passwort sind erforderlich')
        }

        const res = await fetch('/api/admin/users', {
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
      fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setSaving(false)
    }
  }

  const toggleUserStatus = async (user: AdminUser) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !user.is_active }),
      })

      if (!res.ok) throw new Error('Status update failed')
      fetchData()
    } catch (err) {
      setError('Fehler beim Ändern des Status')
      console.error(err)
    }
  }

  const deleteUser = async (user: AdminUser) => {
    if (!confirm(`Benutzer "${user.email}" wirklich löschen?`)) return

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Delete failed')
      }

      fetchData()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen')
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
            Benutzer verwalten
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {users.length} Benutzer registriert
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
        >
          <Plus size={20} />
          Neuer Benutzer
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--panel)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(46,196,198,0.05)' }}>
              <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: 'var(--fg)' }}>Benutzer</th>
              <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: 'var(--fg)' }}>Rolle</th>
              <th className="text-left px-4 py-3 text-sm font-semibold hidden md:table-cell" style={{ color: 'var(--fg)' }}>Letzter Login</th>
              <th className="text-center px-4 py-3 text-sm font-semibold" style={{ color: 'var(--fg)' }}>Status</th>
              <th className="text-right px-4 py-3 text-sm font-semibold" style={{ color: 'var(--fg)' }}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr 
                key={user.id} 
                className="transition-colors hover:bg-opacity-50"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(46,196,198,0.1)' }}
                    >
                      <User size={20} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--fg)' }}>
                        {user.name || user.email.split('@')[0]}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Shield size={16} style={{ color: 'var(--accent)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                      {user.role_name || 'Keine Rolle'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-sm" style={{ color: 'var(--muted)' }}>
                  {formatDate(user.last_login)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleUserStatus(user)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                      user.is_active 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {user.is_active ? <Check size={12} /> : <X size={12} />}
                    {user.is_active ? 'Aktiv' : 'Inaktiv'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-2 rounded-lg transition-colors hover:bg-gray-500/10"
                      title="Bearbeiten"
                    >
                      <Edit2 size={16} style={{ color: 'var(--muted)' }} />
                    </button>
                    <button
                      onClick={() => deleteUser(user)}
                      className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                      title="Löschen"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ backgroundColor: 'var(--panel)', border: '1px solid var(--border)' }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--fg)' }}>
              {editingUser ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>
                  E-Mail *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!!editingUser}
                  className="w-full px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                  style={{ 
                    backgroundColor: 'var(--bg)', 
                    border: '1px solid var(--border)',
                    color: 'var(--fg)'
                  }}
                  required={!editingUser}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>
                  Passwort {editingUser ? '(leer lassen um beizubehalten)' : '*'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 pr-10 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: 'var(--bg)', 
                      border: '1px solid var(--border)',
                      color: 'var(--fg)'
                    }}
                    required={!editingUser}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: 'var(--muted)' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: 'var(--bg)', 
                    border: '1px solid var(--border)',
                    color: 'var(--fg)'
                  }}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: 'var(--bg)', 
                    border: '1px solid var(--border)',
                    color: 'var(--fg)'
                  }}
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>
                  Rolle
                </label>
                <select
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: 'var(--bg)', 
                    border: '1px solid var(--border)',
                    color: 'var(--fg)'
                  }}
                >
                  <option value="">Keine Rolle</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.description}
                    </option>
                  ))}
                </select>
              </div>

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
                  {saving ? 'Speichern...' : (editingUser ? 'Aktualisieren' : 'Erstellen')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
