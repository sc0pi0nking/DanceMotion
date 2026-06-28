'use client'

import { useEffect } from 'react'

const HOVER_SELECTOR =
  'a, button, .mag, .card, input, select, textarea, [role="button"], [data-cursor]'

export default function CustomCursor() {
  useEffect(() => {
    // Touch- / Coarse-Pointer-Geräte bekommen keinen Custom-Cursor
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = document.createElement('div')
    dot.id = 'dm-cursor'
    const ring = document.createElement('div')
    ring.id = 'dm-cursor-ring'
    document.body.appendChild(dot)
    document.body.appendChild(ring)
    document.body.classList.add('dm-cursor-active')

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let rafId = 0

    function onMove(e: MouseEvent) {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`
    }
    function onOver(e: MouseEvent) {
      const t = e.target as Element | null
      if (t?.closest?.(HOVER_SELECTOR)) document.body.classList.add('dm-hover')
    }
    function onOut(e: MouseEvent) {
      const t = e.target as Element | null
      if (t?.closest?.(HOVER_SELECTOR)) document.body.classList.remove('dm-hover')
    }
    function tick() {
      // Ring folgt verzögert (Lerp ~12%)
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, true)
    document.addEventListener('mouseout', onOut, true)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver, true)
      document.removeEventListener('mouseout', onOut, true)
      document.body.classList.remove('dm-cursor-active', 'dm-hover')
      dot.remove()
      ring.remove()
    }
  }, [])

  return null
}
