import { useEffect } from 'react'
import Markdown from 'react-markdown'
import type { PortfolioItem } from '../types/portfolio'
import './PortfolioDetailModal.css'

function isExternalLink(url: string) {
  return url.startsWith('http') || url.startsWith('/')
}

export function PortfolioDetailModal({
  item,
  onClose,
}: {
  item: PortfolioItem | null
  onClose: () => void
}) {
  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  if (!item) return null

  const detail = item.detail?.trim() || item.desc

  return (
    <div className="detail-overlay" onClick={onClose} role="presentation">
      <div
        className="detail-modal glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="detail-head">
          <div>
            <span className="detail-cat">{item.category}</span>
            <h2 id="detail-title">{item.name}</h2>
            <p className="detail-lead">{item.desc}</p>
          </div>
          <button type="button" className="detail-close" onClick={onClose} aria-label="Tutup">
            ×
          </button>
        </header>

        <div className="detail-body">
          <div className="detail-markdown">
            <Markdown>{detail}</Markdown>
          </div>
        </div>

        <footer className="detail-foot">
          <a href="#kontak" className="btn btn-ghost" onClick={onClose}>
            Order Mirip Ini
          </a>
          <a
            href={item.demo}
            className="btn btn-primary"
            {...(isExternalLink(item.demo) ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            Lihat Demo
          </a>
        </footer>
      </div>
    </div>
  )
}
