'use client'

import { useState, useEffect } from 'react'
import { Pencil, Save, X } from 'lucide-react'

interface EditableContentProps {
  contentKey: string
  defaultValue: string
  className?: string
  style?: React.CSSProperties
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'div'
  multiline?: boolean
}

export default function EditableContent({
  contentKey,
  defaultValue,
  className = '',
  style,
  as: Component = 'p',
  multiline = false,
}: EditableContentProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(defaultValue)
  const [editValue, setEditValue] = useState(defaultValue)
  const [isSaving, setIsSaving] = useState(false)

  // Check admin session
  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch('/api/admin/auth/session')
        setIsAdmin(res.ok)
      } catch {
        setIsAdmin(false)
      }
    }
    checkAdmin()
  }, [])

  // Load content from database
  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch(`/api/admin/content/${contentKey}`)
        if (res.ok) {
          const data = await res.json()
          const value = typeof data.value === 'string' ? data.value : data.value?.text || defaultValue
          setContent(value)
          setEditValue(value)
        }
      } catch (error) {
        console.error('Failed to load content:', error)
      }
    }
    loadContent()
  }, [contentKey, defaultValue])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/content/${contentKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: { text: editValue },
          section: contentKey.split('.')[0],
          description: `Content for ${contentKey}`,
        }),
      })

      if (res.ok) {
        setContent(editValue)
        setIsEditing(false)
      } else {
        const errorData = await res.json()
        console.error('Save failed:', errorData)
        alert(`Fehler beim Speichern: ${errorData.error || 'Unbekannter Fehler'}`)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Fehler beim Speichern: Netzwerkfehler')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(content)
    setIsEditing(false)
  }

  if (!isAdmin) {
    return <Component className={className} style={style}>{content}</Component>
  }

  return (
    <div className="group relative">
      {isEditing ? (
        <div className="space-y-2">
          {multiline ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-3 rounded-lg border-2 border-accent bg-bg text-fg resize-y min-h-[100px]"
              rows={5}
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-2 rounded-lg border-2 border-accent bg-bg text-fg"
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-accent text-bg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} />
              {isSaving ? 'Speichern...' : 'Speichern'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border border-muted text-muted hover:border-fg hover:text-fg flex items-center gap-2"
            >
              <X size={16} />
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <>
          <Component className={className} style={style}>{content}</Component>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent/10"
            title="Bearbeiten"
          >
            <Pencil size={16} className="text-accent" />
          </button>
        </>
      )}
    </div>
  )
}
