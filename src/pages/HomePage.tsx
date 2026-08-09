import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PortfolioDetailModal } from '../components/PortfolioDetailModal'
import { ProjectThumb } from '../components/ProjectThumb'
import { usePortfolio } from '../hooks/usePortfolio'
import type { PortfolioItem } from '../types/portfolio'
import '../App.css'

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

const steps = [
  { num: '01', title: 'Konsultasi', desc: 'Diskusi kebutuhan, target pelanggan, dan gaya brand bisnis Anda.' },
  { num: '02', title: 'Desain UI', desc: 'Rancangan tampilan modern yang sesuai identitas usaha.' },
  { num: '03', title: 'Development', desc: 'Website dibangun responsif, cepat, dan siap dipakai.' },
  { num: '04', title: 'Launch', desc: 'Deploy ke hosting, training singkat, dan support awal.' },
]

const chartHeights = [45, 70, 55, 85, 60, 95, 75, 88]

function isExternalLink(url: string) {
  return url.startsWith('http') || url.startsWith('/')
}

export default function HomePage() {
  const projects = usePortfolio(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  const filters = useMemo(() => {
    const cats = [...new Set(projects.map((p) => p.category))]
    return ['Semua', ...cats]
  }, [projects])

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
                Setiap demo bisa dibuka langsung. Kelola daftar project lewat menu backend.
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
                <article key={p.id} className="glass project-card">
                  <ProjectThumb
                    name={p.name}
                    tone={p.tone}
                    demo={p.demo}
                    preview={p.preview}
                  />
                  <div className="project-body">
                    <span className="project-cat">{p.category}</span>
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                    <div className="project-actions">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setSelected(p)}
                      >
                        Detail
                      </button>
                      <a
                        href={p.demo}
                        className="btn btn-primary"
                        {...(isExternalLink(p.demo)
                          ? { target: '_blank', rel: 'noreferrer' }
                          : {})}
                      >
                        Lihat Demo
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <PortfolioDetailModal item={selected} onClose={() => setSelected(null)} />

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
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
