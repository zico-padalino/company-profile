import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DEVICE_LABELS } from '../types/portfolio'
import type { ViewDevice } from './ProjectThumb'
import './DeviceViewModal.css'

/**
 * Ukuran frame visual (px) + viewport internal iframe.
 * Scale = frameW / vw agar isi selalu penuh tanpa area kosong.
 * Iframe HARUS position:absolute agar tidak mendongkrak tinggi modal.
 */
const FRAMES: Record<
  ViewDevice,
  { frameW: number; frameH: number; vw: number; vh: number }
> = {
  desktop: { frameW: 560, frameH: 350, vw: 1440, vh: 900 },
  tablet: { frameW: 300, frameH: 400, vw: 768, vh: 1024 },
  phone: { frameW: 230, frameH: 498, vw: 390, vh: 844 },
}

function DeviceShell({
  device,
  title,
  liveUrl,
}: {
  device: ViewDevice
  title: string
  liveUrl?: string
}) {
  const frame = FRAMES[device]
  const scale = frame.frameW / frame.vw

  const screen = (
    <div
      className="dvm-screen"
      style={{
        width: frame.frameW,
        height: frame.frameH,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        background: '#f4f7fb',
      }}
    >
      {liveUrl ? (
        <iframe
          key={`${device}-${liveUrl}`}
          src={liveUrl}
          title={`${title} ${device}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: frame.vw,
            height: frame.vh,
            border: 0,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            background: '#f4f7fb',
          }}
        />
      ) : (
        <div className="dvm-empty">
          Isi Link Demo / Preview di admin agar mockup tampil live.
        </div>
      )}
    </div>
  )

  if (device === 'desktop') {
    return (
      <div className="dvm-shell dvm-shell-desktop">
        <div className="dvm-monitor" style={{ width: frame.frameW + 16 }}>
          <div className="dvm-chrome">
            <span />
            <span />
            <span />
          </div>
          {screen}
        </div>
      </div>
    )
  }

  if (device === 'tablet') {
    return (
      <div className="dvm-shell dvm-shell-tablet">
        <div
          className="dvm-body"
          style={{ width: frame.frameW + 20, padding: '10px 10px 12px' }}
        >
          {screen}
          <div className="dvm-home" aria-hidden />
        </div>
      </div>
    )
  }

  return (
    <div className="dvm-shell dvm-shell-phone">
      <div className="dvm-body" style={{ width: frame.frameW + 16, padding: 8 }}>
        <div className="dvm-notch" aria-hidden />
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
  onClose,
  onChangeDevice,
}: {
  open: boolean
  device: ViewDevice
  title: string
  liveUrl?: string
  onClose: () => void
  onChangeDevice: (device: ViewDevice) => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="dvm-overlay" onClick={onClose} role="presentation">
      <div
        className={`dvm-modal dvm-modal-${device}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Preview ${title} ${DEVICE_LABELS[device]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="dvm-head">
          <div>
            <p>Preview Mockup</p>
            <h3>
              {title} · {DEVICE_LABELS[device]}
            </h3>
          </div>
          <button type="button" className="dvm-close" onClick={onClose} aria-label="Tutup">
            ×
          </button>
        </header>

        <div className="dvm-tabs" role="tablist">
          {(['desktop', 'tablet', 'phone'] as ViewDevice[]).map((d) => (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={d === device}
              className={d === device ? 'active' : ''}
              onClick={() => onChangeDevice(d)}
            >
              {DEVICE_LABELS[d]}
            </button>
          ))}
        </div>

        <div className="dvm-stage">
          <DeviceShell key={device} device={device} title={title} liveUrl={liveUrl} />
        </div>

        <p className="dvm-hint">Klik di luar atau Esc untuk menutup</p>
      </div>
    </div>,
    document.body,
  )
}
