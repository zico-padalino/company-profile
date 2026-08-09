import { useState } from 'react'
import './App.css'

function autoPreviewUrl(demo: string) {
  // Preview otomatis dari URL live — tidak perlu screenshot manual
  const params = new URLSearchParams({
    url: demo,
    screenshot: 'true',
    meta: 'false',
    embed: 'screenshot.url',
  })
  return `https://api.microlink.io/?${params.toString()}`
}

const PETSHOP_MENUS = [
  { title: 'Jual Barang', desc: 'Catat penjualan di kasir', tone: 'teal' },
  { title: 'Uang Kasir', desc: 'Setor, tarik & saldo laci', tone: 'green' },
  { title: 'Absensi', desc: 'Barcode + selfie + GPS', tone: 'blue' },
  { title: 'Titip Hewan', desc: 'Pet hotel & penitipan', tone: 'orange' },
  { title: 'Lihat Kamar', desc: 'Kamar hotel tersedia', tone: 'orange' },
  { title: 'Riwayat Jual', desc: 'Lihat semua penjualan', tone: 'yellow' },
  { title: 'Stok Barang', desc: 'Daftar produk toko', tone: 'blue' },
  { title: 'Stok Opname', desc: 'Admin & Owner cek hasil', tone: 'blue' },
  { title: 'Laporan Uang', desc: 'Rekap penjualan toko', tone: 'teal' },
  { title: 'Kategori', desc: 'Kelompok produk', tone: 'yellow' },
  { title: 'Pengguna', desc: 'Akun karyawan toko', tone: 'green' },
  { title: 'Toko & Struk', desc: 'Nama, logo, teks struk', tone: 'teal' },
] as const

function PetshopTopbar({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`ps-topbar ${compact ? 'is-compact' : ''}`}>
      <span className="ps-burger" />
      {!compact ? (
        <div className="ps-brandline">
          <strong>PetShop</strong>
          <small>Toko & penitipan hewan</small>
        </div>
      ) : (
        <span className="ps-role">Administrator</span>
      )}
      <div className="ps-user">
        {!compact ? <span className="ps-role">Administrator</span> : null}
        <span className="ps-avatar">A</span>
        {!compact ? (
          <div className="ps-user-text">
            <b>Admin PetShop</b>
            <small>Logout</small>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function PetshopHero() {
  return (
    <div className="ps-hero">
      <div>
        <p>Selamat pagi, Admin</p>
        <strong>PetShop</strong>
        <small>Toko & penitipan hewan</small>
      </div>
      <div className="ps-paws" aria-hidden="true">
        <span />
        <span />
      </div>
    </div>
  )
}

function PetshopMenuGrid({ count, columns }: { count: number; columns: number }) {
  return (
    <div className="ps-menu-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {PETSHOP_MENUS.slice(0, count).map((item) => (
        <div key={item.title} className={`ps-menu-card tone-${item.tone}`}>
          <i />
          <b>{item.title}</b>
          <small>{item.desc}</small>
        </div>
      ))}
    </div>
  )
}

function PetshopDashboardScreen({ device }: { device: 'desktop' | 'tablet' | 'phone' }) {
  if (device === 'desktop') {
    return (
      <div className="ps-app ps-desktop">
        <aside className="ps-sidebar">
          <div className="ps-side-brand">
            <span className="ps-logo" />
            <b>PetShop Dzikra</b>
          </div>
          <p className="ps-side-label">Utama</p>
          <span className="ps-side-link active">Beranda</span>
          <p className="ps-side-label">Toko</p>
          <span className="ps-side-link">Jual Barang</span>
          <span className="ps-side-link">Uang Kasir</span>
          <span className="ps-side-link">Absensi</span>
          <span className="ps-side-link">Riwayat Jual</span>
          <span className="ps-side-link">Titip Hewan</span>
          <p className="ps-side-label">Barang & Laporan</p>
          <span className="ps-side-link">Stok Barang</span>
          <span className="ps-side-link">Stok Opname</span>
          <span className="ps-side-link">Laporan Uang</span>
          <p className="ps-side-label">Pengaturan</p>
          <span className="ps-side-link">Pengguna</span>
          <span className="ps-side-link">Toko & Struk</span>
        </aside>
        <div className="ps-main">
          <PetshopTopbar />
          <div className="ps-content">
            <PetshopHero />
            <p className="ps-section-title">Mau ngapain hari ini?</p>
            <PetshopMenuGrid count={10} columns={5} />
          </div>
        </div>
      </div>
    )
  }

  if (device === 'tablet') {
    return (
      <div className="ps-app ps-tablet">
        <PetshopTopbar />
        <div className="ps-content">
          <PetshopHero />
          <p className="ps-section-title">Mau ngapain hari ini?</p>
          <PetshopMenuGrid count={8} columns={4} />
          <p className="ps-section-title">Ringkasan hari ini</p>
          <div className="ps-summary">
            <div>
              <b>5</b>
              <small>Penjualan</small>
            </div>
            <div>
              <b>637rb</b>
              <small>Uang masuk</small>
            </div>
            <div>
              <b>3</b>
              <small>Hewan titip</small>
            </div>
            <div>
              <b>4</b>
              <small>Reservasi</small>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ps-app ps-phone">
      <PetshopTopbar compact />
      <div className="ps-content">
        <PetshopHero />
        <p className="ps-section-title">Mau ngapain hari ini?</p>
        <PetshopMenuGrid count={6} columns={2} />
      </div>
      <nav className="ps-bottomnav">
        <span className="active">Beranda</span>
        <span>Jual</span>
        <span>Titip</span>
        <span>Riwayat</span>
        <span>Stok</span>
      </nav>
    </div>
  )
}

function DeviceScreen({
  label,
  imageSrc,
  failed,
  onImageError,
  screen,
  device,
}: {
  label: string
  imageSrc: string
  failed: boolean
  onImageError: () => void
  screen?: 'dashboard'
  device: 'desktop' | 'tablet' | 'phone'
}) {
  if (screen === 'dashboard') {
    return <PetshopDashboardScreen device={device} />
  }

  if (imageSrc && !failed) {
    return (
      <img
        src={imageSrc}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        className="device-screen-img"
        onError={onImageError}
      />
    )
  }

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

function ProjectThumb({
  name,
  tone,
  demo,
  screen,
}: {
  name: string
  tone: string
  demo: string
  screen?: 'dashboard'
}) {
  const isLive = demo.startsWith('http')
  const imageSrc = isLive && !screen ? autoPreviewUrl(demo) : ''
  const [failed, setFailed] = useState(false)
  const label = name.split(' ')[0]

  const handleImageError = () => setFailed(true)

  return (
    <div className="project-thumb project-thumb--devices" data-tone={tone}>
      <div className="device-stage" aria-hidden="true">
        <div className="device device-desktop">
          <div className="device-bezel">
            <DeviceScreen
              label={label}
              imageSrc={imageSrc}
              failed={failed}
              onImageError={handleImageError}
              screen={screen}
              device="desktop"
            />
          </div>
          <div className="device-stand" />
          <div className="device-base" />
        </div>

        <div className="device device-tablet">
          <div className="device-bezel">
            <DeviceScreen
              label={label}
              imageSrc={imageSrc}
              failed={failed}
              onImageError={handleImageError}
              screen={screen}
              device="tablet"
            />
          </div>
        </div>

        <div className="device device-phone">
          <div className="device-bezel phone-bezel">
            <div className="phone-notch" />
            <DeviceScreen
              label={label}
              imageSrc={imageSrc}
              failed={failed}
              onImageError={handleImageError}
              screen={screen}
              device="phone"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const services = [
  {
    title: 'Website UMKM',
    desc: 'Profil bisnis yang rapi, cepat, dan siap tampil profesional di Google serta WhatsApp.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 20h8M12 18v2" />
      </svg>
    ),
  },
  {
    title: 'Toko Online',
    desc: 'Katalog produk, keranjang, dan checkout yang memudahkan pelanggan pesan langsung.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 7h12l-1 11H7L6 7z" />
        <path d="M9 7V5a3 3 0 016 0v2" />
      </svg>
    ),
  },
  {
    title: 'Landing Page',
    desc: 'Halaman promosi fokus fokus untuk campaign, pre-order, atau penawaran layanan.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19h16M7 16V8m5 8V5m5 11v-6" />
      </svg>
    ),
  },
  {
    title: 'Company Profile',
    desc: 'Situs perusahaan yang membangun kredibilitas brand dan menarik klien baru.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    title: 'Maintenance & SEO',
    desc: 'Perawatan rutin, update konten, dan optimasi agar website mudah ditemukan.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    ),
  },
  {
    title: 'Custom App',
    desc: 'Sistem booking, dashboard, atau aplikasi web sesuai alur bisnis Anda.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 9h8M8 13h5" />
      </svg>
    ),
  },
]

const projects = [
  {
    name: 'PetShop - E-POS',
    category: 'Retail',
    tone: 'green',
    desc: 'Sistem kasir & katalog petshop untuk UMKM — login, transaksi, dan kelola produk.',
    demo: 'https://pet-shop-karsadigital.netlify.app/#/login',
    screen: 'dashboard' as const,
  },
  {
    name: 'Warung Rasa Nusantara',
    category: 'Kuliner',
    tone: 'warm',
    desc: 'Website menu & pemesanan untuk resto lokal dengan fokus mobile.',
    demo: '#demo',
  },
  {
    name: 'Butik Melati',
    category: 'Fashion',
    tone: 'default',
    desc: 'Katalog produk fashion UMKM dengan filter kategori dan WhatsApp order.',
    demo: '#demo',
  },
  {
    name: 'Klinik Sehat Prima',
    category: 'Jasa',
    tone: 'green',
    desc: 'Company profile klinik + form booking konsultasi sederhana.',
    demo: '#demo',
  },
  {
    name: 'Kopi Pagi Studio',
    category: 'Kuliner',
    tone: 'warm',
    desc: 'Landing page coffee shop untuk promo membership dan event.',
    demo: '#demo',
  },
  {
    name: 'TechFix Service',
    category: 'Jasa',
    tone: 'default',
    desc: 'Situs jasa servis perangkat dengan tracking status perbaikan.',
    demo: '#demo',
  },
  {
    name: 'Glow Beauty Care',
    category: 'Fashion',
    tone: 'green',
    desc: 'Toko online skincare dengan highlight produk best seller.',
    demo: '#demo',
  },
]

const filters = ['Semua', 'Retail', 'Kuliner', 'Fashion', 'Jasa'] as const

const steps = [
  { num: '01', title: 'Konsultasi', desc: 'Diskusi kebutuhan, target pelanggan, dan gaya brand bisnis Anda.' },
  { num: '02', title: 'Desain UI', desc: 'Rancangan tampilan modern yang sesuai identitas usaha.' },
  { num: '03', title: 'Development', desc: 'Website dibangun responsif, cepat, dan siap dipakai.' },
  { num: '04', title: 'Launch', desc: 'Deploy ke hosting, training singkat, dan support awal.' },
]

const chartHeights = [45, 70, 55, 85, 60, 95, 75, 88]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('Semua')

  const filteredProjects =
    activeFilter === 'Semua'
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="app-shell">
      <header className="nav">
        <div className="container nav-inner">
          <a href="#beranda" className="brand" onClick={closeMenu}>
            <img src="/logo-karsa.jpeg" alt="KARSA DIGITAL" className="brand-logo" />
            <div className="brand-text">
              <div className="brand-name">
                KARSA <span>DIGITAL</span>
              </div>
              <div className="brand-tag">Daya Cipta Solusi Digital</div>
            </div>
          </a>

          <button
            className={`nav-toggle ${menuOpen ? 'open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="#layanan" onClick={closeMenu}>
              Layanan
            </a>
            <a href="#portfolio" onClick={closeMenu}>
              Portfolio
            </a>
            <a href="#proses" onClick={closeMenu}>
              Proses
            </a>
            <a href="#kontak" onClick={closeMenu}>
              Kontak
            </a>
            <a href="#kontak" className="btn btn-primary nav-cta" onClick={closeMenu}>
              Konsultasi Gratis
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="beranda">
          <div className="container hero-grid">
            <div>
              <h1 className="hero-brand">
                KARSA
                <span>DIGITAL</span>
              </h1>
              <p className="hero-title">Daya Cipta Solusi Digital Bisnis Anda</p>
              <p className="hero-desc">
                Kami membantu UMKM dan brand lokal punya website profesional — dari company
                profile, toko online, hingga sistem custom yang siap tumbuh bersama bisnis.
              </p>
              <div className="hero-actions">
                <a href="#portfolio" className="btn btn-primary">
                  Lihat Demo Project
                </a>
                <a href="#kontak" className="btn btn-ghost">
                  Hubungi Kami
                </a>
              </div>
            </div>

            <div className="hero-visual">
              <div className="glass hero-panel">
                <div className="hero-panel-top">
                  <div className="hero-avatar">
                    <img src="/logo-karsa.jpeg" alt="" className="hero-avatar-img" />
                    <div>
                      <strong>KARSA DIGITAL</strong>
                      <span>Web Studio</span>
                    </div>
                  </div>
                  <div className="live-dot">Online</div>
                </div>

                <div className="hero-stats">
                  <div className="stat-card">
                    <strong>50+</strong>
                    <span>Project Selesai</span>
                  </div>
                  <div className="stat-card">
                    <strong>98%</strong>
                    <span>Klien Puas</span>
                  </div>
                  <div className="stat-card">
                    <strong>24/7</strong>
                    <span>Support Awal</span>
                  </div>
                </div>

                <div className="hero-chart">
                  <h4>Pertumbuhan Trafik Klien</h4>
                  <div className="chart-bars" aria-hidden="true">
                    {chartHeights.map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${h}%`, animationDelay: `${0.05 * i}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="layanan">
          <div className="container">
            <div className="section-head">
              <span className="section-label">Layanan</span>
              <h2 className="section-title">Solusi digital untuk tumbuh lebih cepat</h2>
              <p className="section-desc">
                Paket fleksibel untuk UMKM yang ingin tampil profesional tanpa proses yang rumit.
              </p>
            </div>
            <div className="services-grid">
              {services.map((s) => (
                <article key={s.title} className="glass service-item">
                  <div className="service-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="portfolio">
          <div className="container">
            <div className="section-head">
              <span className="section-label">Portfolio & Demo</span>
              <h2 className="section-title">Contoh karya yang bisa Anda coba</h2>
              <p className="section-desc">
                Setiap demo bisa dibuka langsung. Nanti Anda bisa mengganti link ini ke project live
                Anda sendiri.
              </p>
            </div>

            <div className="portfolio-filters">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="portfolio-grid">
              {filteredProjects.map((p) => (
                <article key={p.name} className="glass project-card">
                  <ProjectThumb
                    name={p.name}
                    tone={p.tone}
                    demo={p.demo}
                    screen={'screen' in p ? p.screen : undefined}
                  />
                  <div className="project-body">
                    <span className="project-cat">{p.category}</span>
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                    <div className="project-actions">
                      <a
                        href={p.demo}
                        className="btn btn-primary"
                        {...(p.demo.startsWith('http')
                          ? { target: '_blank', rel: 'noreferrer' }
                          : {})}
                      >
                        Lihat Demo
                      </a>
                      <a href="#kontak" className="btn btn-ghost">
                        Order Mirip Ini
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="proses">
          <div className="container">
            <div className="section-head">
              <span className="section-label">Cara Kerja</span>
              <h2 className="section-title">Dari ide sampai website live</h2>
              <p className="section-desc">
                Alur sederhana agar Anda tahu progresnya di setiap tahap.
              </p>
            </div>
            <div className="process-grid">
              {steps.map((s) => (
                <article key={s.num} className="glass process-step">
                  <span className="process-num">{s.num}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="kontak">
          <div className="container">
            <div className="glass cta-banner">
              <div>
                <h2>
                  Siap naikkan kredibilitas bisnis dengan website yang berkesan?
                </h2>
                <p>
                  Ceritakan kebutuhan Anda. Tim KARSA DIGITAL siap bantu dari konsep, desain,
                  sampai deploy — termasuk menyiapkan demo project untuk portfolio Anda.
                </p>
                <div className="cta-actions">
                  <a
                    className="btn btn-primary"
                    href="https://wa.me/6285161852230?text=Halo%20KARSA%20DIGITAL%2C%20saya%20ingin%20konsultasi%20website"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Chat WhatsApp
                  </a>
                  <a className="btn btn-ghost" href="mailto:padalinozico@gmail.com">
                    Kirim Email
                  </a>
                </div>
              </div>
              <div className="contact-panel">
                <div className="contact-row">
                  <span>Brand</span>
                  <strong>KARSA DIGITAL</strong>
                </div>
                <div className="contact-row">
                  <span>Tagline</span>
                  <strong>Daya Cipta Solusi Digital Bisnis Anda</strong>
                </div>
                <div className="contact-row">
                  <span>Email</span>
                  <strong>padalinozico@gmail.com</strong>
                </div>
                <div className="contact-row">
                  <span>WhatsApp</span>
                  <strong>0851-6185-2230</strong>
                </div>
                <div className="contact-row">
                  <span>Lokasi</span>
                  <strong>Serang, Banten, Indonesia</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="brand">
            <img src="/logo-karsa.jpeg" alt="" className="brand-logo" />
            <div className="brand-text">
              <div className="brand-name">
                KARSA <span>DIGITAL</span>
              </div>
              <p className="footer-copy">© {new Date().getFullYear()} KARSA DIGITAL</p>
            </div>
          </div>
          <div className="footer-links">
            <a href="#layanan">Layanan</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#kontak">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
