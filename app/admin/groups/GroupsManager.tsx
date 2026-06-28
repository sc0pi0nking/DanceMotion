'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  Users2,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  ExternalLink,
  Upload,
  ImageOff,
} from 'lucide-react'
import {
  AdminPageHeader,
  AdminModal,
  ModalCancelButton,
  ModalConfirmButton,
  AdminInput,
  AdminTextarea,
  AdminToggle,
  FormGroup,
} from '@/app/admin/components'
import type { Group } from '@/lib/groups-db'

interface FormState {
  name: string
  slug: string
  short_desc: string
  color: string
  is_active: boolean
  logo_url: string | null
}

const EMPTY_FORM: FormState = {
  name: '',
  slug: '',
  short_desc: '',
  color: '#2EC4C6',
  is_active: true,
  logo_url: null,
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function GroupsManager() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Group | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [listRef] = useAutoAnimate<HTMLTableSectionElement>()
  const dragIndex = useRef<number | null>(null)

  useEffect(() => {
    loadGroups()
  }, [])

  async function loadGroups() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/groups')
      if (!res.ok) throw new Error()
      setGroups(await res.json())
    } catch {
      toast.error('Gruppen konnten nicht geladen werden')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setSlugTouched(false)
    setModalOpen(true)
  }

  function openEdit(group: Group) {
    setEditing(group)
    setForm({
      name: group.name,
      slug: group.slug,
      short_desc: group.short_desc ?? '',
      color: group.color || '#2EC4C6',
      is_active: group.is_active,
      logo_url: group.logo_url,
    })
    setSlugTouched(true)
    setModalOpen(true)
  }

  function updateName(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugTouched ? prev.slug : slugify(name),
    }))
  }

  async function handleLogoUpload(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/groups/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Upload fehlgeschlagen')
      setForm((prev) => ({ ...prev, logo_url: data.url }))
      toast.success('Logo hochgeladen')
    } catch (err: any) {
      toast.error(err.message || 'Upload fehlgeschlagen')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Name und Slug sind erforderlich')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        short_desc: form.short_desc.trim() || null,
        color: form.color,
        is_active: form.is_active,
        logo_url: form.logo_url || null,
        ...(editing ? {} : { sort_order: groups.length }),
      }

      const res = await fetch(
        editing ? `/api/admin/groups/${editing.id}` : '/api/admin/groups',
        {
          method: editing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        const msg = typeof data?.error === 'string' ? data.error : 'Speichern fehlgeschlagen'
        throw new Error(msg)
      }

      toast.success(editing ? 'Gruppe aktualisiert' : 'Gruppe erstellt')
      setModalOpen(false)
      await loadGroups()
    } catch (err: any) {
      toast.error(err.message || 'Speichern fehlgeschlagen')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(group: Group) {
    // optimistic
    setGroups((prev) =>
      prev.map((g) => (g.id === group.id ? { ...g, is_active: !g.is_active } : g))
    )
    try {
      const res = await fetch(`/api/admin/groups/${group.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !group.is_active }),
      })
      if (!res.ok) throw new Error()
      toast.success(group.is_active ? 'Gruppe deaktiviert' : 'Gruppe aktiviert')
    } catch {
      toast.error('Status konnte nicht geändert werden')
      loadGroups()
    }
  }

  async function handleDelete(group: Group) {
    if (!confirm(`Gruppe "${group.name}" wirklich löschen?`)) return
    try {
      const res = await fetch(`/api/admin/groups/${group.id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Löschen fehlgeschlagen')
      toast.success('Gruppe gelöscht')
      setGroups((prev) => prev.filter((g) => g.id !== group.id))
    } catch (err: any) {
      toast.error(err.message || 'Löschen fehlgeschlagen')
    }
  }

  function onDragStart(index: number) {
    dragIndex.current = index
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  async function onDrop(index: number) {
    const from = dragIndex.current
    dragIndex.current = null
    if (from === null || from === index) return

    const reordered = [...groups]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(index, 0, moved)
    const withOrder = reordered.map((g, i) => ({ ...g, sort_order: i }))
    setGroups(withOrder)

    try {
      const res = await fetch('/api/admin/groups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: withOrder.map((g) => ({ id: g.id, sort_order: g.sort_order })),
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Reihenfolge gespeichert')
    } catch {
      toast.error('Reihenfolge konnte nicht gespeichert werden')
      loadGroups()
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={Users2}
        title="Gruppen"
        description="Tanzgruppen verwalten – Name, Beschreibung, Farbe, Logo und Reihenfolge. Per Drag & Drop sortieren."
        breadcrumbs={[{ label: 'Gruppen' }]}
        actions={[
          { label: 'Neue Gruppe', icon: Plus, onClick: openCreate, variant: 'primary' },
        ]}
      />

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
          </div>
        ) : groups.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            Noch keine Gruppen. Lege die erste an.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="w-10 px-3 py-3" />
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Logo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Farbe
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Reihenfolge
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Aktiv
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody ref={listRef} className="divide-y divide-slate-700">
                {groups.map((group, index) => (
                  <tr
                    key={group.id}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragOver={onDragOver}
                    onDrop={() => onDrop(index)}
                    className="hover:bg-slate-700/40 transition"
                  >
                    <td className="px-3 py-3 text-slate-500 cursor-grab active:cursor-grabbing">
                      <GripVertical size={18} />
                    </td>
                    <td className="px-4 py-3">
                      {group.logo_url ? (
                        <Image
                          src={group.logo_url}
                          alt={group.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 object-contain rounded bg-slate-900/40"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-slate-900/40 flex items-center justify-center text-slate-600">
                          <ImageOff size={18} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{group.name}</div>
                      <div className="text-xs text-slate-500">/{group.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-5 w-5 rounded-full border border-slate-600"
                          style={{ backgroundColor: group.color }}
                        />
                        <span className="text-xs text-slate-400">{group.color}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{group.sort_order}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={group.is_active}
                        onClick={() => toggleActive(group)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
                          group.is_active ? 'bg-teal-500' : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                            group.is_active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/gruppen/${group.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
                          title="Öffentliche Seite"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          onClick={() => openEdit(group)}
                          className="p-2 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-700 transition"
                          title="Bearbeiten"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(group)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition"
                          title="Löschen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Gruppe bearbeiten' : 'Neue Gruppe'}
        description={editing ? `/${editing.slug}` : 'Lege eine neue Tanzgruppe an'}
        size="lg"
        footer={
          <>
            <ModalCancelButton onClick={() => setModalOpen(false)} />
            <ModalConfirmButton onClick={handleSave} loading={saving}>
              {editing ? 'Speichern' : 'Erstellen'}
            </ModalConfirmButton>
          </>
        }
      >
        <div className="space-y-4">
          <FormGroup cols={2}>
            <AdminInput
              label="Name"
              value={form.name}
              onChange={(e) => updateName(e.target.value)}
              placeholder="z. B. Little Joys"
            />
            <AdminInput
              label="Slug (URL)"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                setForm((p) => ({ ...p, slug: slugify(e.target.value) }))
              }}
              placeholder="little-joys"
            />
          </FormGroup>

          <AdminTextarea
            label="Kurzbeschreibung"
            value={form.short_desc}
            onChange={(e) => setForm((p) => ({ ...p, short_desc: e.target.value }))}
            rows={3}
            placeholder="Kurzer Beschreibungstext für die Übersicht"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Farbe</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                  className="h-10 w-14 rounded bg-slate-700 border border-slate-600 cursor-pointer"
                />
                <AdminInput
                  value={form.color}
                  onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Logo</label>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded bg-slate-900/40 border border-slate-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {form.logo_url ? (
                    <Image
                      src={form.logo_url}
                      alt="Logo"
                      width={56}
                      height={56}
                      className="h-14 w-14 object-contain"
                    />
                  ) : (
                    <ImageOff size={20} className="text-slate-600" />
                  )}
                </div>
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-200 hover:bg-slate-600 cursor-pointer text-sm transition">
                  <Upload size={16} />
                  {uploading ? 'Lädt…' : 'Hochladen'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleLogoUpload(file)
                      e.target.value = ''
                    }}
                  />
                </label>
                {form.logo_url && (
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, logo_url: null }))}
                    className="text-xs text-slate-400 hover:text-red-400"
                  >
                    Entfernen
                  </button>
                )}
              </div>
            </div>
          </div>

          <AdminToggle
            label="Aktiv"
            description="Nur aktive Gruppen erscheinen öffentlich."
            checked={form.is_active}
            onChange={(checked) => setForm((p) => ({ ...p, is_active: checked }))}
          />
        </div>
      </AdminModal>
    </div>
  )
}
