'use client'

import { useCallback, useState } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { X, Check, ZoomIn, Loader2 } from 'lucide-react'

interface CropModalProps {
  /** Object-URL oder Data-URL des zu beschneidenden Bildes */
  imageSrc: string
  /** Seitenverhältnis (Breite/Höhe). Weglassen = frei. */
  aspect?: number
  /** 'rect' (Standard) oder 'round' für runde Avatare */
  cropShape?: 'rect' | 'round'
  /** Dateiname des Ergebnisses */
  fileName?: string
  /** Ziel-MIME-Type (Standard: image/jpeg) */
  mimeType?: string
  title?: string
  onCancel: () => void
  onConfirm: (file: File) => void | Promise<void>
}

/**
 * Erzeugt aus dem Quellbild und dem gewählten Ausschnitt eine beschnittene Bilddatei.
 */
async function getCroppedFile(
  imageSrc: string,
  crop: Area,
  fileName: string,
  mimeType: string
): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = imageSrc
  })

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(crop.width))
  canvas.height = Math.max(1, Math.round(crop.height))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas nicht verfügbar')

  // Weißer Hintergrund für JPEG (sonst schwarz bei Transparenz)
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mimeType, 0.9)
  )
  if (!blob) throw new Error('Bild konnte nicht erzeugt werden')

  return new File([blob], fileName, { type: mimeType })
}

export default function CropModal({
  imageSrc,
  aspect = 1,
  cropShape = 'rect',
  fileName = 'zuschnitt.jpg',
  mimeType = 'image/jpeg',
  title = 'Bild zuschneiden',
  onCancel,
  onConfirm,
}: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [areaPixels, setAreaPixels] = useState<Area | null>(null)
  const [saving, setSaving] = useState(false)

  const onCropComplete = useCallback((_area: Area, areaPx: Area) => {
    setAreaPixels(areaPx)
  }, [])

  const handleConfirm = async () => {
    if (!areaPixels) return
    setSaving(true)
    try {
      const file = await getCroppedFile(imageSrc, areaPixels, fileName, mimeType)
      await onConfirm(file)
    } catch (err) {
      console.error('Crop failed:', err)
      alert('Zuschneiden fehlgeschlagen. Bitte erneut versuchen.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dm-admin fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-700 px-5 py-3">
          <h3 className="font-semibold text-white">{title}</h3>
          <button
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            aria-label="Abbrechen"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative h-[320px] w-full bg-slate-950 sm:h-[400px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={cropShape === 'rect'}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center gap-3 border-t border-slate-700 px-5 py-3">
          <ZoomIn size={18} className="flex-shrink-0 text-slate-400" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-teal-500"
            aria-label="Zoom"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-700 px-5 py-3">
          <button
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600 disabled:opacity-50"
          >
            Abbrechen
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving || !areaPixels}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Übernehmen
          </button>
        </div>
      </div>
    </div>
  )
}
