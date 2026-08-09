export type PortfolioTone = 'default' | 'warm' | 'green'

export type PortfolioItem = {
  id: string
  name: string
  category: string
  tone: PortfolioTone
  desc: string
  /** Deskripsi lengkap (markdown) untuk modal detail */
  detail?: string
  /** Galeri gambar detail (URL atau data URL) */
  images?: string[]
  demo: string
  preview?: string
  published: boolean
  sortOrder: number
}

export type PortfolioFormData = Omit<PortfolioItem, 'id' | 'sortOrder'> & {
  id?: string
  sortOrder?: number
}
