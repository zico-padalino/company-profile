import { useEffect, useRef, useState } from 'react'
import { DEVICE_VIEWPORTS } from '../lib/imageUpload'
import { getImagesForDevice } from '../lib/portfolioStore'
import type { DeviceKind, PortfolioImage } from '../types/portfolio'

export type ViewDevice = Exclude<DeviceKind, 'all'>

function LiveDeviceScreen({
  url,
  imageSrc,
  label,
  device,
}: {
  url: string
  imageSrc?: string
  label: string
  device: ViewDevice
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.2)
  const viewport = DEVICE_VIEWPORTS[device]

  useEffect(() => {
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
  }, [viewport.width, viewport.height])

  if (imageSrc) {
    return (
      <div className={`live-screen live-screen--${device} live-screen--image`}>
        <img src={imageSrc} alt={`${label} ${device}`} />
      </div>
    )
  }

  if (!url) {
    return (
      <div className="device-screen-fallback">
        <strong>{label}</strong>
        <div className="device-bar" />
        <div className="device-bar short" />
        <div className="device-cards">
          <span />
          <span />
          <span />
        </div>
      </div>
    )
  }

  return (
    <div className={`live-screen live-screen--${device}`} ref={frameRef}>
      <iframe
        src={url}
        title={`${label} ${device} preview`}
        loading="lazy"
        tabIndex={-1}
        style={{
          width: viewport.width,
          height: viewport.height,
          transform: `scale(${scale})`,
        }}
      />
    </div>
  )
}

export function ProjectThumb({
  name,
  tone,
  demo,
  preview,
  images,
  onOpenDevice,
}: {
  name: string
  tone: string
  demo: string
  preview?: string
  images?: PortfolioImage[]
  onOpenDevice: (device: ViewDevice) => void
}) {
  const liveUrl =
    preview || (demo.startsWith('http') || demo.startsWith('/') ? demo : '')
  const label = name.split(' ')[0]

  const desktopImage = getImagesForDevice(images, 'desktop')[0]?.src
  const tabletImage = getImagesForDevice(images, 'tablet')[0]?.src
  const phoneImage = getImagesForDevice(images, 'phone')[0]?.src

  return (
    <div className="project-thumb project-thumb--devices" data-tone={tone}>
      <div className="device-stage">
        <button
          type="button"
          className="device device-desktop device-hit"
          onClick={() => onOpenDevice('desktop')}
          aria-label="Lihat mockup desktop"
        >
          <div className="device-chrome">
            <span />
            <span />
            <span />
          </div>
          <div className="device-bezel">
            <LiveDeviceScreen
              url={liveUrl}
              imageSrc={desktopImage}
              label={label}
              device="desktop"
            />
          </div>
          <div className="device-stand" />
          <div className="device-base" />
        </button>

        <button
          type="button"
          className="device device-tablet device-hit"
          onClick={() => onOpenDevice('tablet')}
          aria-label="Lihat mockup tablet"
        >
          <div className="device-bezel">
            <LiveDeviceScreen
              url={liveUrl}
              imageSrc={tabletImage}
              label={label}
              device="tablet"
            />
          </div>
        </button>

        <button
          type="button"
          className="device device-phone device-hit"
          onClick={() => onOpenDevice('phone')}
          aria-label="Lihat mockup HP"
        >
          <div className="device-bezel phone-bezel">
            <div className="phone-notch" />
            <LiveDeviceScreen
              url={liveUrl}
              imageSrc={phoneImage}
              label={label}
              device="phone"
            />
          </div>
        </button>
      </div>
    </div>
  )
}
