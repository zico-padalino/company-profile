import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DEVICE_VIEWPORTS } from '../lib/imageUpload'
import { DEVICE_LABELS } from '../types/portfolio'
import type { ViewDevice } from './ProjectThumb'
import './DeviceViewModal.css'

type Box = { screenW: number; screenH: number; scale: number }

const MAX_SCREEN: Record<ViewDevice, number> = {
  desktop: 520,
  tablet: 240,
  phone: 200,
}

const CHROME: Record<ViewDevice, { x: number; y: number }> = {
  desktop: { x: 16, y: 36 }, // padding + traffic lights
  tablet: { x: 20, y: 36 }, // bezel + home bar
  phone: { x: 16, y: 16 },
}

function useFitScale(device: ViewDevice, liveUrl?: string) {
  const shellRef = useRef<HTMLDivElement>(null)
  const viewport = DEVICE_VIEWPORTS[device]
  const [box, setBox] = useState<Box>({
    screenW: 280,
    screenH: 175,
    scale: 280 / viewport.width,
  })

  useLayoutEffect(() => {
    const shell = shellRef.current
    if (!shell) return

    const update = () => {
      const stage = shell.parentElement
      if (!stage) return

      const availW = Math.max(stage.clientWidth - 20, 120)
      const availH = Math.max(stage.clientHeight - 20, 120)
      const chrome = CHROME[device]
      const aspect = viewport.width / viewport.height

      // Ruang untuk layar (setelah chrome device)
      let screenW = Math.min(availW - chrome.x, MAX_SCREEN[device])
      let screenH = screenW / aspect

      if (screenH + chrome.y > availH) {
        screenH = Math.max(availH - chrome.y, 100)
        screenW = screenH * aspect
      }

      setBox({
        screenW,
        screenH,
        scale: screenW / viewport.width,
      })
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(shell.parentElement || shell)
    window.addEventListener('resize', update)
    const t1 = window.setTimeout(update, 30)
    const t2 = window.setTimeout(update, 120)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [device, viewport.width, viewport.height, liveUrl])

  return { shellRef, box, viewport }
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
  const { shellRef, box, viewport } = useFitScale(device, liveUrl)

  const screen = (
    <div
      className="device-shell-screen"
      style={{ width: box.screenW, height: box.screenH }}
    >
      {liveUrl ? (
        <iframe
          key={`${device}-${liveUrl}`}
          src={liveUrl}
          title={`${title} ${device}`}
          style={{
            width: viewport.width,
            height: viewport.height,
            transform: `scale(${box.scale})`,
            transformOrigin: 'top left',
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
      <div className="device-shell device-shell--desktop" ref={shellRef}>
        <div className="device-shell-monitor" style={{ width: box.screenW + 16 }}>
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
      <div className="device-shell device-shell--tablet" ref={shellRef}>
        <div
          className="device-shell-body"
          style={{ width: box.screenW + 20, height: box.screenH + 36 }}
        >
          {screen}
          <div className="device-shell-home" aria-hidden />
        </div>
      </div>
    )
  }

  return (
    <div className="device-shell device-shell--phone" ref={shellRef}>
      <div
        className="device-shell-body"
        style={{ width: box.screenW + 16, height: box.screenH + 16 }}
      >
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
  useLayoutEffect(() => {
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

        <p className="device-view-hint">Klik di luar atau Esc untuk menutup</p>
      </div>
    </div>,
    document.body,
  )
}
