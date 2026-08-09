import { PETSHOP_SHORT_DESC } from '../data/petshopDetail'

/** Hapus sintaks markdown sederhana untuk tampilan card */
export function toPlainCardText(input: string): string {
  return input
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/\n{2,}/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function looksLikeFullMarkdown(text: string): boolean {
  const t = text.trim()
  if (t.length > 280) return true
  return /^#\s|##\s|\*\*|^\s*[-*]\s+/m.test(t)
}

/** Ambil ringkasan pendek untuk card */
export function getCardSummary(desc: string, detail?: string): string {
  const source = looksLikeFullMarkdown(desc) ? desc : desc || detail || ''
  const plain = toPlainCardText(source)

  // Prefer kalimat pembuka yang relevan
  const firstSentence = plain.split(/(?<=\.)\s+/)[0] || plain
  if (firstSentence.length <= 160) return firstSentence
  return `${firstSentence.slice(0, 157).trim()}...`
}

export function healPortfolioCopy(item: {
  id: string
  name: string
  desc: string
  detail?: string
}): { desc: string; detail?: string; name: string } {
  let { name, desc, detail } = item

  if (item.id === 'petshop-epos' || /pet\s*shop/i.test(name)) {
    name = 'Pet Shop E-POS'
    if (looksLikeFullMarkdown(desc)) {
      detail = detail?.trim() ? detail : desc
      desc = PETSHOP_SHORT_DESC
    } else if (!desc.trim() || desc.length > 220) {
      desc = PETSHOP_SHORT_DESC
    }
    return { name, desc, detail }
  }

  if (looksLikeFullMarkdown(desc)) {
    return {
      name,
      desc: getCardSummary(desc),
      detail: detail?.trim() ? detail : desc,
    }
  }

  return { name, desc, detail }
}
