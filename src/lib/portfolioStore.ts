import { DEFAULT_CATEGORIES, DEFAULT_PORTFOLIO } from '../data/defaultPortfolio'
import type { PortfolioFormData, PortfolioItem } from '../types/portfolio'

const STORAGE_KEY = 'karsa_portfolio_v1'
const AUTH_KEY = 'karsa_admin_session'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'karsa2026'

function uid() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

function readRaw(): PortfolioItem[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PortfolioItem[]
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function getPortfolioItems(includeDraft = false): PortfolioItem[] {
  const items = readRaw() ?? DEFAULT_PORTFOLIO
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder)
  return includeDraft ? sorted : sorted.filter((i) => i.published)
}

export function savePortfolioItems(items: PortfolioItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('karsa-portfolio-updated'))
}

export function upsertPortfolioItem(data: PortfolioFormData): PortfolioItem {
  const items = getPortfolioItems(true)
  if (data.id) {
    const next = items.map((item) =>
      item.id === data.id
        ? {
            ...item,
            name: data.name.trim(),
            category: data.category.trim(),
            tone: data.tone,
            desc: data.desc.trim(),
            demo: data.demo.trim(),
            preview: data.preview?.trim() || undefined,
            published: data.published,
            sortOrder: data.sortOrder ?? item.sortOrder,
          }
        : item,
    )
    savePortfolioItems(next)
    return next.find((i) => i.id === data.id)!
  }

  const created: PortfolioItem = {
    id: uid(),
    name: data.name.trim(),
    category: data.category.trim(),
    tone: data.tone,
    desc: data.desc.trim(),
    demo: data.demo.trim(),
    preview: data.preview?.trim() || undefined,
    published: data.published,
    sortOrder: data.sortOrder ?? items.length + 1,
  }
  savePortfolioItems([...items, created])
  return created
}

export function deletePortfolioItem(id: string) {
  savePortfolioItems(getPortfolioItems(true).filter((i) => i.id !== id))
}

export function resetPortfolioItems() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('karsa-portfolio-updated'))
}

export function getCategories(): string[] {
  const fromItems = getPortfolioItems(true).map((i) => i.category)
  return [...new Set([...DEFAULT_CATEGORIES, ...fromItems])].filter(Boolean)
}

export function loginAdmin(password: string): boolean {
  if (password !== ADMIN_PASSWORD) return false
  sessionStorage.setItem(AUTH_KEY, '1')
  return true
}

export function logoutAdmin() {
  sessionStorage.removeItem(AUTH_KEY)
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === '1'
}

export function exportPortfolioJson(): string {
  return JSON.stringify(getPortfolioItems(true), null, 2)
}

export function importPortfolioJson(json: string): number {
  const parsed = JSON.parse(json) as PortfolioItem[]
  if (!Array.isArray(parsed)) throw new Error('Format JSON tidak valid')
  const normalized = parsed.map((item, index) => ({
    id: item.id || uid(),
    name: String(item.name || 'Untitled'),
    category: String(item.category || 'Lainnya'),
    tone: (item.tone === 'warm' || item.tone === 'green' ? item.tone : 'default') as PortfolioItem['tone'],
    desc: String(item.desc || ''),
    demo: String(item.demo || '#'),
    preview: item.preview ? String(item.preview) : undefined,
    published: Boolean(item.published),
    sortOrder: Number(item.sortOrder) || index + 1,
  }))
  savePortfolioItems(normalized)
  return normalized.length
}
