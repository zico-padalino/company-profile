import type { PortfolioItem } from '../types/portfolio'
import { PETSHOP_DETAIL, PETSHOP_SHORT_DESC } from './petshopDetail'

export const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'petshop-epos',
    name: 'Pet Shop E-POS',
    category: 'Retail',
    tone: 'green',
    desc: PETSHOP_SHORT_DESC,
    detail: PETSHOP_DETAIL,
    demo: '/demos/petshop/index.html?demo=1#/dashboard',
    preview: '/demos/petshop/index.html?demo=1#/dashboard',
    published: true,
    sortOrder: 1,
  },
  {
    id: 'warung-rasa',
    name: 'Warung Rasa Nusantara',
    category: 'Kuliner',
    tone: 'warm',
    desc: 'Website menu & pemesanan untuk resto lokal dengan fokus mobile.',
    detail:
      '## Tentang project\n\nWebsite menu digital untuk warung/resto lokal. Fokus tampilan mobile, daftar menu, dan alur pemesanan yang simpel agar pelanggan mudah order.',
    demo: '#demo',
    published: true,
    sortOrder: 2,
  },
  {
    id: 'butik-melati',
    name: 'Butik Melati',
    category: 'Fashion',
    tone: 'default',
    desc: 'Katalog produk fashion UMKM dengan filter kategori dan WhatsApp order.',
    detail:
      '## Tentang project\n\nKatalog fashion UMKM dengan filter kategori dan tombol order via WhatsApp. Cocok untuk butik yang ingin tampil rapi tanpa sistem checkout kompleks.',
    demo: '#demo',
    published: true,
    sortOrder: 3,
  },
  {
    id: 'klinik-sehat',
    name: 'Klinik Sehat Prima',
    category: 'Jasa',
    tone: 'green',
    desc: 'Company profile klinik + form booking konsultasi sederhana.',
    detail:
      '## Tentang project\n\nCompany profile klinik dengan informasi layanan dan form booking konsultasi sederhana untuk menjaring pasien baru.',
    demo: '#demo',
    published: true,
    sortOrder: 4,
  },
  {
    id: 'kopi-pagi',
    name: 'Kopi Pagi Studio',
    category: 'Kuliner',
    tone: 'warm',
    desc: 'Landing page coffee shop untuk promo membership dan event.',
    detail:
      '## Tentang project\n\nLanding page coffee shop untuk promo membership, menu andalan, dan event — dibuat ringkas agar cepat convert ke WhatsApp/reservasi.',
    demo: '#demo',
    published: true,
    sortOrder: 5,
  },
  {
    id: 'techfix',
    name: 'TechFix Service',
    category: 'Jasa',
    tone: 'default',
    desc: 'Situs jasa servis perangkat dengan tracking status perbaikan.',
    detail:
      '## Tentang project\n\nWebsite jasa servis perangkat dengan alur tracking status perbaikan agar pelanggan tahu progres ordernya.',
    demo: '#demo',
    published: true,
    sortOrder: 6,
  },
  {
    id: 'glow-beauty',
    name: 'Glow Beauty Care',
    category: 'Fashion',
    tone: 'green',
    desc: 'Toko online skincare dengan highlight produk best seller.',
    detail:
      '## Tentang project\n\nToko online skincare dengan highlight produk best seller dan katalog yang mudah dibaca di mobile.',
    demo: '#demo',
    published: true,
    sortOrder: 7,
  },
]

export const DEFAULT_CATEGORIES = ['Retail', 'Kuliner', 'Fashion', 'Jasa']
