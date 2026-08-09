import { useEffect, useRef, useState } from 'react'

const DEVICE_VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 820, height: 1180 },
  phone: { width: 390, height: 844 },
} as const

function LiveDeviceScreen({
  url,
  label,
  device,
}: {
  url: string
  label: string
  device: keyof typeof DEVICE_VIEWPORTS
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
}: {
  name: string
  tone: string
  demo: string
  preview?: string
}) {
  const liveUrl =
    preview ||
    (demo.startsWith('http') || demo.startsWith('/') ? demo : '')
  const label = name.split(' ')[0]

  return (
    <div className="project-thumb project-thumb--devices" data-tone={tone}>
      <div className="device-stage" aria-hidden="true">
        <div className="device device-desktop">
          <div className="device-chrome">
            <span />
            <span />
            <span />
          </div>
          <div className="device-bezel">
            <LiveDeviceScreen url={liveUrl} label={label} device="desktop" />
          </div>
          <div className="device-stand" />
          <div className="device-base" />
        </div>

        <div className="device device-tablet">
          <div className="device-bezel">
            <LiveDeviceScreen url={liveUrl} label={label} device="tablet" />
          </div>
        </div>

        <div className="device device-phone">
          <div className="device-bezel phone-bezel">
            <div className="phone-notch" />
            <LiveDeviceScreen url={liveUrl} label={label} device="phone" />
          </div>
        </div>
      </div>
    </div>
  )
}
