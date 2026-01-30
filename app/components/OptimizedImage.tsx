'use client'

import Image from 'next/image'
import { CSSProperties, useState } from 'react'
import {
  getResponsiveImageSizes,
  getAspectRatioPadding,
  getNextImageConfig,
} from '@/lib/image-optimization'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  context?: 'hero' | 'gallery' | 'thumbnail' | 'banner' | 'avatar'
  priority?: boolean
  quality?: number
  fill?: boolean
  className?: string
  containerClassName?: string
  onLoad?: () => void
}

/**
 * OptimizedImage Component
 *
 * Automatically handles:
 * - Responsive sizing with srcSet
 * - WebP format with fallbacks
 * - LQIP (Low Quality Image Placeholder)
 * - Prevents CLS (Cumulative Layout Shift)
 * - Lazy loading for non-priority images
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  context = 'gallery',
  priority = false,
  quality = 75,
  fill = false,
  className = '',
  containerClassName = '',
  onLoad,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const sizes = getResponsiveImageSizes(context)
  const aspectRatio = getAspectRatioPadding(width, height)

  // Container style with aspect ratio for CLS prevention
  const containerStyle: CSSProperties = fill
    ? { position: 'relative', width: '100%', height: '100%' }
    : {
        position: 'relative',
        width: '100%',
        paddingBottom: aspectRatio,
      }

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-200 dark:bg-slate-800 ${containerClassName}`}
        style={{ ...containerStyle, minHeight: '200px' }}
      >
        <span className="text-slate-500 text-sm">Bild konnte nicht geladen werden</span>
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-lg ${containerClassName}`}
      style={fill ? containerStyle : {}}
    >
      <div
        className="relative w-full h-full"
        style={!fill ? containerStyle : { position: 'absolute', inset: 0 }}
      >
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          quality={quality}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          onLoadingComplete={() => {
            setIsLoading(false)
            onLoad?.()
          }}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
        />

        {/* Blur placeholder while loading */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-600 animate-pulse" />
        )}
      </div>
    </div>
  )
}
