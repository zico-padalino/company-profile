import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import type { PortfolioImage, PortfolioItem } from '../types/portfolio'
import { DEVICE_LABELS } from '../types/portfolio'
import './PortfolioDetailModal.css'

function isExternalLink(url: string) {
  return url.startsWith('http') || url.startsWith('/')
}

function imageKey(img: PortfolioImage, index: number) {
  return `${img.device}-${img.src.slice(0, 32)}-${index}`
}

export function PortfolioDetailModal({
  item,
  onClose,
}: {
  item: PortfolioItem | null
  onClose: () => void
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!item) return
    const images = item.images ?? []
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null)
        else onClose()
      }
      if (lightboxIndex === null || !images.length) return
      if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => ((i ?? 0) + 1) % images.length)
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => ((i ?? 0) - 1 + images.length) % images.length)
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose, lightboxIndex])

  useEffect(() => {
    setLightboxIndex(null)
  }, [item?.id])

  if (!item) return null

  const detail = item.detail?.trim() || item.desc
  const images = item.images ?? []
  const active = lightboxIndex !== null ? images[lightboxIndex] : null

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
          {images.length > 0 ? (
            <section className="detail-gallery">
              <h3>Galeri Project</h3>
              <div className="detail-gallery-grid">
                {images.map((img, index) => (
                  <button
                    key={imageKey(img, index)}
                    type="button"
                    className="detail-gallery-item"
                    onClick={() => setLightboxIndex(index)}
                  >
                    <img src={img.src} alt={`${item.name} ${DEVICE_LABELS[img.device]}`} loading="lazy" />
                    <span className="detail-gallery-device">{DEVICE_LABELS[img.device]}</span>
                    <span>Lihat</span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

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

      {active ? (
        <div
          className="detail-lightbox"
          onClick={() => setLightboxIndex(null)}
          role="presentation"
        >
          <button
            type="button"
            className="detail-lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Tutup gambar"
          >
            ×
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="detail-lightbox-nav prev"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((i) => ((i ?? 0) - 1 + images.length) % images.length)
                }}
                aria-label="Gambar sebelumnya"
              >
                ‹
              </button>
              <button
                type="button"
                className="detail-lightbox-nav next"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex((i) => ((i ?? 0) + 1) % images.length)
                }}
                aria-label="Gambar berikutnya"
              >
                ›
              </button>
            </>
          ) : null}
          <img
            src={active.src}
            alt={`${item.name} ${DEVICE_LABELS[active.device]}`}
            onClick={(e) => e.stopPropagation()}
          />
          <p className="detail-lightbox-caption">
            {DEVICE_LABELS[active.device]} · {(lightboxIndex ?? 0) + 1} / {images.length}
          </p>
        </div>
      ) : null}
    </div>
  )
}
