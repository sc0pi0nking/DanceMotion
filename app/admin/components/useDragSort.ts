'use client'

import { useRef, useState } from 'react'
import type { DragEvent } from 'react'

/**
 * Wiederverwendbarer Hook für native HTML5-Drag-&-Drop-Sortierung.
 *
 * Liefert `getItemProps(index)` mit allen nötigen Drag-Handlern für ein
 * Listenelement sowie `dragging`/`overIndex` für optionales Styling.
 * Beim Ablegen wird `onReorder(reordered)` mit der neu sortierten Liste
 * aufgerufen – die Persistenz übernimmt der aufrufende Manager.
 */
export function useDragSort<T>(items: T[], onReorder: (reordered: T[]) => void) {
  const dragIndex = useRef<number | null>(null)
  const [dragging, setDragging] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const reset = () => {
    dragIndex.current = null
    setDragging(null)
    setOverIndex(null)
  }

  const getItemProps = (index: number) => ({
    draggable: true,
    onDragStart: (e: DragEvent) => {
      dragIndex.current = index
      setDragging(index)
      e.dataTransfer.effectAllowed = 'move'
      // Firefox benötigt gesetzte Daten, damit Drag startet
      try {
        e.dataTransfer.setData('text/plain', String(index))
      } catch {
        /* ignore */
      }
    },
    onDragOver: (e: DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      if (overIndex !== index) setOverIndex(index)
    },
    onDragLeave: () => {
      setOverIndex((cur) => (cur === index ? null : cur))
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault()
      const from = dragIndex.current
      reset()
      if (from === null || from === index) return
      const next = [...items]
      const [moved] = next.splice(from, 1)
      next.splice(index, 0, moved)
      onReorder(next)
    },
    onDragEnd: reset,
  })

  return { getItemProps, dragging, overIndex }
}
