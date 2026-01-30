/**
 * Image Optimization Utilities
 * 
 * This module provides utilities for optimizing images across the application:
 * - Responsive image sizes with srcSet generation
 * - WebP format support with fallbacks
 * - LQIP (Low Quality Image Placeholder) generation
 * - Image compression recommendations
 */

export interface ResponsiveImageConfig {
  src: string
  alt: string
  width: number
  height: number
  sizes?: string
  priority?: boolean
  quality?: number
}

/**
 * Generate responsive image sizes for different breakpoints
 * Follows Next.js image optimization best practices
 */
export function getResponsiveImageSizes(
  context: 'hero' | 'gallery' | 'thumbnail' | 'banner' | 'avatar'
): string {
  const sizeConfigs = {
    hero: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px',
    gallery: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    thumbnail: '(max-width: 640px) 100vw, (max-width: 1024px) 25vw, 20vw',
    banner: '(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1440px',
    avatar: '(max-width: 640px) 48px, (max-width: 1024px) 56px, 64px',
  }

  return sizeConfigs[context]
}

/**
 * Get recommended width variants for image srcSet
 * These are optimized for common device sizes
 */
export function getImageWidthVariants(
  context: 'hero' | 'gallery' | 'thumbnail' | 'banner' | 'avatar'
): number[] {
  const variants = {
    hero: [640, 768, 1024, 1280, 1536],
    gallery: [320, 480, 640, 960, 1280],
    thumbnail: [160, 320, 480, 640],
    banner: [640, 768, 1024, 1280, 1440, 1920],
    avatar: [48, 56, 64, 96, 128],
  }

  return variants[context]
}

/**
 * Calculate aspect ratio for image container
 * Prevents Cumulative Layout Shift (CLS)
 */
export function getAspectRatioPadding(width: number, height: number): string {
  const ratio = (height / width) * 100
  return `${ratio}%`
}

/**
 * Generate LQIP (Low Quality Image Placeholder) URL
 * Uses Supabase storage for image processing if available
 */
export function generateLQIPUrl(
  originalUrl: string,
  width: number = 10,
  quality: number = 20
): string {
  // If it's a Supabase storage URL, use transformation
  if (originalUrl.includes('supabase')) {
    return `${originalUrl}?width=${width}&quality=${quality}`
  }

  // For external URLs, return original (browser will handle)
  // In production, consider using a service like plaiceholder
  return originalUrl
}

/**
 * Get Next.js Image component configuration
 * Includes optimization settings for performance
 */
export function getNextImageConfig(priority: boolean = false) {
  return {
    priority,
    quality: 75, // Good balance between quality and file size
    placeholder: 'blur' as const,
    blurDataURL:
      'data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmMWY1ZjkiLz4KPC9zdmc+',
  }
}

/**
 * Get image srcSet string for HTML img tag
 * Format: "url 1x, url 2x, url 3x"
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [1, 2, 3]
): string {
  // Handle responsive image format with width descriptors
  // This is different from pixel descriptors
  return widths.map((w) => `${baseUrl}?w=${w * 400} ${w}x`).join(', ')
}

/**
 * Estimate file size after optimization
 * Provides feedback to users about image optimization
 */
export function estimateOptimizedSize(
  originalSizeKB: number,
  format: 'webp' | 'jpeg' | 'avif' = 'webp'
): number {
  const compressionRatios = {
    webp: 0.6, // WebP is typically 60% of JPEG
    jpeg: 1.0, // Baseline
    avif: 0.5, // AVIF is even better than WebP
  }

  return Math.round(originalSizeKB * compressionRatios[format])
}

/**
 * Check if image format is supported by browser
 */
export function getImageFormatSupport(): {
  webp: boolean
  avif: boolean
  jpeg: boolean
} {
  if (typeof window === 'undefined') {
    return { webp: true, avif: false, jpeg: true }
  }

  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1

  return {
    webp: canvas.toDataURL('image/webp') !== canvas.toDataURL('image/png'),
    avif:
      canvas.toDataURL('image/avif').substring(5, 10) === 'image' ||
      false,
    jpeg: true,
  }
}

/**
 * Image optimization recommendations for admin
 * Returns actionable feedback about image quality
 */
export function getImageOptimizationFeedback(
  widthPx: number,
  heightPx: number,
  fileSizeKB: number
): string[] {
  const feedback: string[] = []
  const pixelCount = widthPx * heightPx
  const bytesPerPixel = (fileSizeKB * 1024) / pixelCount

  if (bytesPerPixel > 2) {
    feedback.push(
      '⚠️ Datei ist groß für die Bildabmessungen - komprimieren erwägen'
    )
  }

  if (widthPx > 2000) {
    feedback.push('💡 Breite > 2000px - für Web normalerweise unnötig')
  }

  if ((widthPx / heightPx) > 3 || (heightPx / widthPx) > 3) {
    feedback.push('💡 Ungewöhnliches Seitenverhältnis - überprüfen')
  }

  if (fileSizeKB > 500) {
    feedback.push('⚠️ Datei > 500KB - WebP oder AVIF erwägen')
  }

  if (feedback.length === 0) {
    feedback.push('✅ Bild ist gut optimiert')
  }

  return feedback
}

/**
 * Image component wrapper configuration for common use cases
 */
export const imageConfigs = {
  hero: {
    sizes: getResponsiveImageSizes('hero'),
    priority: true,
    width: 1280,
    height: 720,
  },
  gallery: {
    sizes: getResponsiveImageSizes('gallery'),
    priority: false,
    width: 400,
    height: 400,
  },
  thumbnail: {
    sizes: getResponsiveImageSizes('thumbnail'),
    priority: false,
    width: 200,
    height: 200,
  },
  banner: {
    sizes: getResponsiveImageSizes('banner'),
    priority: true,
    width: 1440,
    height: 320,
  },
  avatar: {
    sizes: getResponsiveImageSizes('avatar'),
    priority: false,
    width: 64,
    height: 64,
  },
}
