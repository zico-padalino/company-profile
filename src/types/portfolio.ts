export type PortfolioTone = 'default' | 'warm' | 'green'

export type DeviceKind = 'desktop' | 'tablet' | 'phone' | 'all'

export type PortfolioImage = {
  src: string
  device: DeviceKind
}

export type PortfolioItem = {
  id: string
  name: string
  category: string
  tone: PortfolioTone
  desc: string
  /** Deskripsi lengkap (markdown) untuk modal detail */
  detail?: string
  /** Galeri gambar detail per device */
  images?: PortfolioImage[]
  demo: string
  preview?: string
  published: boolean
  sortOrder: number
}

export type PortfolioFormData = Omit<PortfolioItem, 'id' | 'sortOrder'> & {
  id?: string
  sortOrder?: number
}

export const DEVICE_LABELS: Record<DeviceKind, string> = {
  all: 'Semua device',
  desktop: 'Desktop',
  tablet: 'Tablet',
  phone: 'HP',
}
