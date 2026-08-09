import { useEffect, useMemo, useRef, useState } from 'react'
import { DEVICE_VIEWPORTS } from '../lib/imageUpload'
import { getImagesForDevice } from '../lib/portfolioStore'
import type { DeviceKind, PortfolioImage } from '../types/portfolio'
import { DEVICE_LABELS } from '../types/portfolio'
import './DeviceViewModal.css'

type ViewDevice = Exclude<DeviceKind, 'all'>

export function DeviceViewModal({
  open,
  device,
  title,
  liveUrl,
  images,
  onClose,
  onChangeDevice,
}: {
  open: boolean
  device: ViewDevice
  title: string
  liveUrl?: string
  images?: PortfolioImage[]
  onClose: () => void
  onChangeDevice: (device: ViewDevice) => void
}) {
  const viewport = DEVICE_VIEWPORTS[device]
  const deviceImages = getImagesForDevice(images, device)
  const imageSrc = deviceImages[0]?.src
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)

  const frameStyle = useMemo(() => {
    if (device === 'desktop') return { aspectRatio: '16 / 10', maxWidth: 960 }
    if (device === 'tablet') return { aspectRatio: '3 / 4', maxWidth: 420 }
    return { aspectRatio: '9 / 19', maxWidth: 320 }
  }, [device])

  useEffect(() => {
    if (!open || imageSrc) return
    const el = frameRef.current
    if (!el) return

    const updateScale = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width < 2 || height < 2) return
      setScale(Math.min(width / viewport.width, height / viewport.height))
    }

    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(el)
    return () => observer.disconnect()
  }, [open, imageSrc, device, viewport.width, viewport.height])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="device-view-overlay" onClick={onClose} role="presentation">
      <div
        className="device-view-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="device-view-head">
          <div>
            <p>Preview Mockup</p>
            <h3>
              {title} · {DEVICE_LABELS[device]}
            </h3>
          </div>
          <button type="button" className="device-view-close" onClick={onClose} aria-label="Tutup">
            ×
          </button>
        </header>

        <div className="device-view-tabs">
          {(['desktop', 'tablet', 'phone'] as ViewDevice[]).map((d) => {
            const hasImage = getImagesForDevice(images, d).length > 0
            return (
              <button
                key={d}
                type="button"
                className={d === device ? 'active' : ''}
                onClick={() => onChangeDevice(d)}
              >
                {DEVICE_LABELS[d]}
                {hasImage ? <em className="device-tab-dot" aria-hidden /> : null}
              </button>
            )
          })}
        </div>

        <div className="device-view-stage">
          <div
            className={`device-view-frame device-view-frame--${device}`}
            style={frameStyle}
            ref={frameRef}
          >
            {imageSrc ? (
              <img src={imageSrc} alt={`${title} ${device}`} />
            ) : liveUrl ? (
              <iframe
                src={liveUrl}
                title={`${title} ${device}`}
                style={{
                  width: viewport.width,
                  height: viewport.height,
                  transform: `scale(${scale})`,
                }}
              />
            ) : (
              <div className="device-view-empty">Belum ada gambar untuk {DEVICE_LABELS[device]}.</div>
            )}
          </div>
        </div>

        <p className="device-view-hint">
          {imageSrc
            ? 'Menampilkan gambar khusus device ini.'
            : liveUrl
              ? 'Menampilkan preview live dari link demo/preview.'
              : 'Tambahkan gambar device di admin portfolio.'}
        </p>
      </div>
    </div>
  )
}
