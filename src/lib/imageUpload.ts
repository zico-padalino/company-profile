import type { DeviceKind } from '../types/portfolio'

/** Resize image file ke data URL agar hemat localStorage */
export function fileToCompressedDataUrl(
  file: File,
  maxWidth = 1280,
  quality = 0.82,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Gambar tidak valid'))
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const width = Math.round(img.width * scale)
        const height = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas tidak tersedia'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i

export const DEVICE_VIEWPORTS: Record<
  Exclude<DeviceKind, 'all'>,
  { width: number; height: number }
> = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 820, height: 1180 },
  phone: { width: 390, height: 844 },
}

export function isDirectImageUrl(url: string): boolean {
  const value = url.trim()
  if (!value) return false
  if (value.startsWith('data:image/')) return true
  try {
    const parsed = new URL(value, window.location.origin)
    return IMAGE_EXT.test(parsed.pathname)
  } catch {
    return IMAGE_EXT.test(value)
  }
}

function toAbsoluteUrl(input: string): string {
  if (input.startsWith('data:')) return input
  try {
    return new URL(input, window.location.origin).href
  } catch {
    return input
  }
}

/** Ambil screenshot dari link website, opsional per viewport device */
export function websiteToPreviewImageUrl(
  siteUrl: string,
  device: DeviceKind = 'all',
): string {
  const params = new URLSearchParams({
    url: toAbsoluteUrl(siteUrl),
    screenshot: 'true',
    meta: 'false',
    embed: 'screenshot.url',
  })

  if (device !== 'all') {
    const vp = DEVICE_VIEWPORTS[device]
    params.set('viewport.width', String(vp.width))
    params.set('viewport.height', String(vp.height))
  }

  return `https://api.microlink.io/?${params.toString()}`
}

/**
 * Resolve input menjadi URL gambar:
 * - file gambar langsung dipakai
 * - link website diambil screenshot-nya (bisa per device)
 */
export async function resolveImageSource(
  input: string,
  device: DeviceKind = 'all',
): Promise<string> {
  const value = input.trim()
  if (!value) throw new Error('URL kosong')

  if (value.startsWith('data:image/')) {
    return value
  }

  if (isDirectImageUrl(value)) {
    return toAbsoluteUrl(value)
  }

  return websiteToPreviewImageUrl(value, device)
}
