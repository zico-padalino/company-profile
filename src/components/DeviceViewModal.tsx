import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DEVICE_VIEWPORTS } from '../lib/imageUpload'
import { getImagesForDevice } from '../lib/portfolioStore'
import type { DeviceKind, PortfolioImage } from '../types/portfolio'
import { DEVICE_LABELS } from '../types/portfolio'
import './DeviceViewModal.css'

type ViewDevice = Exclude<DeviceKind, 'all'>

function DeviceShell({
  device,
  title,
  imageSrc,
  liveUrl,
}: {
  device: ViewDevice
  title: string
  imageSrc?: string
  liveUrl?: string
}) {
  const screenRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.4)
  const viewport = DEVICE_VIEWPORTS[device]

  useEffect(() => {
    if (imageSrc) return
    const el = screenRef.current
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
  }, [imageSrc, device, viewport.width, viewport.height])

  const screen = (
    <div className="device-shell-screen" ref={screenRef}>
      {imageSrc ? (
        <img src={imageSrc} alt={`${title} ${DEVICE_LABELS[device]}`} />
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
  )

  if (device === 'desktop') {
    return (
      <div className="device-shell device-shell--desktop">
        <div className="device-shell-monitor">
          <div className="device-shell-chrome">
            <span />
            <span />
            <span />
          </div>
          {screen}
        </div>
        <div className="device-shell-neck" />
        <div className="device-shell-base" />
      </div>
    )
  }

  if (device === 'tablet') {
    return (
      <div className="device-shell device-shell--tablet">
        <div className="device-shell-body">
          {screen}
          <div className="device-shell-home" aria-hidden />
        </div>
      </div>
    )
  }

  return (
    <div className="device-shell device-shell--phone">
      <div className="device-shell-body">
        <div className="device-shell-notch" aria-hidden />
        {screen}
      </div>
    </div>
  )
}

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
  const deviceImages = getImagesForDevice(images, device)
  const imageSrc = deviceImages[0]?.src

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="device-view-overlay" onClick={onClose} role="presentation">
      <div
        className={`device-view-modal device-view-modal--${device}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Preview ${title} ${DEVICE_LABELS[device]}`}
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

        <div className={`device-view-stage device-view-stage--${device}`}>
          <DeviceShell device={device} title={title} imageSrc={imageSrc} liveUrl={liveUrl} />
        </div>

        <p className="device-view-hint">Klik di luar atau tekan Esc untuk menutup.</p>
      </div>
    </div>,
    document.body,
  )
}
