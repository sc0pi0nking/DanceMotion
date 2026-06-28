'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  Newspaper,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
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

interface Post {
  id: string
  slug: string
  title: string
  content: string
  cover_image: string | null
  tags: string[]
  published_at: string | null
  created_at: string
  updated_at: string
}

interface FormState {
  title: string
  slug: string
  content: string
  cover_image: string
  tags: string
  published: boolean
}

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  content: '',
  cover_image: '',
  tags: '',
  published: false,
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [listRef] = useAutoAnimate<HTMLTableSectionElement>()

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/posts')
      if (!res.ok) throw new Error()
      setPosts(await res.json())
    } catch {
      toast.error('Beiträge konnten nicht geladen werden')
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

  function openEdit(post: Post) {
    setEditing(post)
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      cover_image: post.cover_image ?? '',
      tags: post.tags.join(', '),
      published: post.published_at !== null,
    })
    setSlugTouched(true)
    setModalOpen(true)
  }

  function updateTitle(title: string) {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugify(title),
    }))
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      toast.error('Titel, Slug und Inhalt sind erforderlich')
      return
    }
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        content: form.content,
        cover_image: form.cover_image.trim() || null,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        published: form.published,
      }

      const res = await fetch(
        editing ? `/api/admin/posts/${editing.id}` : '/api/admin/posts',
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

      toast.success(editing ? 'Beitrag aktualisiert' : 'Beitrag erstellt')
      setModalOpen(false)
      await loadPosts()
    } catch (err: any) {
      toast.error(err.message || 'Speichern fehlgeschlagen')
    } finally {
      setSaving(false)
    }
  }

  async function togglePublish(post: Post) {
    const nextPublished = post.published_at === null
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, published_at: nextPublished ? new Date().toISOString() : null }
          : p
      )
    )
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished }),
      })
      if (!res.ok) throw new Error()
      toast.success(nextPublished ? 'Beitrag veröffentlicht' : 'Als Entwurf gespeichert')
    } catch {
      toast.error('Status konnte nicht geändert werden')
      loadPosts()
    }
  }

  async function handleDelete(post: Post) {
    if (!confirm(`Beitrag "${post.title}" wirklich löschen?`)) return
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Löschen fehlgeschlagen')
      toast.success('Beitrag gelöscht')
      setPosts((prev) => prev.filter((p) => p.id !== post.id))
    } catch (err: any) {
      toast.error(err.message || 'Löschen fehlgeschlagen')
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={Newspaper}
        title="News & Blog"
        description="Beiträge verwalten – als Entwurf speichern oder veröffentlichen. Inhalt im Markdown-Format."
        breadcrumbs={[{ label: 'News' }]}
        actions={[
          { label: 'Neuer Beitrag', icon: Plus, onClick: openCreate, variant: 'primary' },
        ]}
      />

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            Noch keine Beiträge. Lege den ersten an.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Titel
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Veröffentlicht
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody ref={listRef} className="divide-y divide-slate-700">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-700/40 transition">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{post.title}</div>
                      <div className="text-xs text-slate-500">/news/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3">
                      {post.published_at ? (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-400">
                          <Eye size={13} /> Veröffentlicht
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-600/30 text-slate-400">
                          <EyeOff size={13} /> Entwurf
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {formatDate(post.published_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => togglePublish(post)}
                          title={post.published_at ? 'Zurückziehen' : 'Veröffentlichen'}
                          className="p-2 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-700 transition"
                        >
                          {post.published_at ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        {post.published_at && (
                          <a
                            href={`/news/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ansehen"
                            className="p-2 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-700 transition"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => openEdit(post)}
                          title="Bearbeiten"
                          className="p-2 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-700 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          title="Löschen"
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition"
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
        title={editing ? 'Beitrag bearbeiten' : 'Neuer Beitrag'}
        size="xl"
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
              label="Titel"
              value={form.title}
              onChange={(e) => updateTitle(e.target.value)}
              placeholder="Titel des Beitrags"
              required
            />
            <AdminInput
              label="Slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                setForm((prev) => ({ ...prev, slug: e.target.value }))
              }}
              placeholder="titel-des-beitrags"
              required
            />
          </FormGroup>

          <AdminInput
            label="Titelbild-URL (optional)"
            value={form.cover_image}
            onChange={(e) => setForm((prev) => ({ ...prev, cover_image: e.target.value }))}
            placeholder="https://…"
          />

          <AdminInput
            label="Tags (kommagetrennt)"
            value={form.tags}
            onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
            placeholder="Auftritt, Bericht, 2026"
          />

          <AdminTextarea
            label="Inhalt (Markdown)"
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
            placeholder={'# Überschrift\n\nText im **Markdown**-Format …'}
            rows={14}
            required
          />

          <AdminToggle
            label="Veröffentlicht"
            description="Aktiv = öffentlich sichtbar unter /news. Inaktiv = Entwurf."
            checked={form.published}
            onChange={(checked) => setForm((prev) => ({ ...prev, published: checked }))}
          />
        </div>
      </AdminModal>
    </div>
  )
}
