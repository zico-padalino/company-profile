import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DEVICE_VIEWPORTS } from '../lib/imageUpload'
import { DEVICE_LABELS } from '../types/portfolio'
import type { ViewDevice } from './ProjectThumb'
import './DeviceViewModal.css'

function DeviceShell({
  device,
  title,
  liveUrl,
}: {
  device: ViewDevice
  title: string
  liveUrl?: string
}) {
  const screenRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.35)
  const viewport = DEVICE_VIEWPORTS[device]

  useEffect(() => {
    const el = screenRef.current
    if (!el) return

    const updateScale = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width < 2 || height < 2) return
      const fitW = width / viewport.width
      const fitH = height / viewport.height
      setScale(device === 'desktop' ? Math.min(fitW, fitH) : Math.max(fitW, fitH))
    }

    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(el)
    return () => observer.disconnect()
  }, [device, viewport.width, viewport.height])

  const screen = (
    <div className={`device-shell-screen device-shell-screen--${device}`} ref={screenRef}>
      {liveUrl ? (
        <iframe
          key={`${device}-${liveUrl}`}
          src={liveUrl}
          title={`${title} ${device}`}
          style={{
            width: viewport.width,
            height: viewport.height,
            transform: `scale(${scale})`,
          }}
        />
      ) : (
        <div className="device-view-empty">
          Isi Link Demo / Preview di admin agar mockup {DEVICE_LABELS[device]} tampil live.
        </div>
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

        <div className="device-view-tabs" role="tablist" aria-label="Pilih device">
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

        <div className={`device-view-stage device-view-stage--${device}`}>
          <DeviceShell key={device} device={device} title={title} liveUrl={liveUrl} />
        </div>

        <p className="device-view-hint">
          {liveUrl
            ? `Preview live responsif · viewport ${DEVICE_VIEWPORTS[device].width}×${DEVICE_VIEWPORTS[device].height}px`
            : 'Isi Link Demo / Preview di admin untuk menampilkan mockup live.'}
        </p>
      </div>
    </div>,
    document.body,
  )
}
