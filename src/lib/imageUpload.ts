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

/** Ambil screenshot dari link website (bukan file gambar) */
export function websiteToPreviewImageUrl(siteUrl: string): string {
  const params = new URLSearchParams({
    url: siteUrl,
    screenshot: 'true',
    meta: 'false',
    embed: 'screenshot.url',
  })
  return `https://api.microlink.io/?${params.toString()}`
}

function toAbsoluteUrl(input: string): string {
  if (input.startsWith('data:')) return input
  try {
    return new URL(input, window.location.origin).href
  } catch {
    return input
  }
}

/**
 * Resolve input menjadi URL gambar:
 * - file gambar langsung dipakai
 * - link website diambil screenshot-nya
 */
export async function resolveImageSource(input: string): Promise<string> {
  const value = input.trim()
  if (!value) throw new Error('URL kosong')

  if (value.startsWith('data:image/')) {
    return value
  }

  if (isDirectImageUrl(value)) {
    return toAbsoluteUrl(value)
  }

  // Path lokal / website → screenshot otomatis (pakai absolute URL)
  return websiteToPreviewImageUrl(toAbsoluteUrl(value))
}
