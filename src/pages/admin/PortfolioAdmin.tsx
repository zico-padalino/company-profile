import { useMemo, useRef, useState, type FormEvent } from 'react'
import { usePortfolio } from '../../hooks/usePortfolio'
import { fileToCompressedDataUrl } from '../../lib/imageUpload'
import {
  deletePortfolioItem,
  exportPortfolioJson,
  getCategories,
  importPortfolioJson,
  resetPortfolioItems,
  upsertPortfolioItem,
} from '../../lib/portfolioStore'
import type { PortfolioFormData, PortfolioItem, PortfolioTone } from '../../types/portfolio'
import './admin.css'

const EMPTY_FORM: PortfolioFormData = {
  name: '',
  category: 'Retail',
  tone: 'default',
  desc: '',
  detail: '',
  images: [],
  demo: '',
  preview: '',
  published: true,
}

export default function PortfolioAdmin() {
  const items = usePortfolio(true)
  const [form, setForm] = useState<PortfolioFormData>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const categories = useMemo(() => getCategories(), [items])
  const formImages = form.images ?? []

  const publishedCount = items.filter((i) => i.published).length
  const draftCount = items.length - publishedCount

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.desc.toLowerCase().includes(q),
    )
  }, [items, query])

  function showMessage(text: string) {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 2800)
  }

  function startCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setImageUrl('')
  }

  function startEdit(item: PortfolioItem) {
    setEditingId(item.id)
    setForm({
      id: item.id,
      name: item.name,
      category: item.category,
      tone: item.tone,
      desc: item.desc,
      detail: item.detail || '',
      images: item.images || [],
      demo: item.demo,
      preview: item.preview || '',
      published: item.published,
      sortOrder: item.sortOrder,
    })
    setImageUrl('')
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function addImage(src: string) {
    const next = src.trim()
    if (!next) return
    setForm((f) => ({ ...f, images: [...(f.images || []), next] }))
  }

  function removeImage(index: number) {
    setForm((f) => ({
      ...f,
      images: (f.images || []).filter((_, i) => i !== index),
    }))
  }

  async function handleImageFiles(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        uploaded.push(await fileToCompressedDataUrl(file))
      }
      setForm((f) => ({ ...f, images: [...(f.images || []), ...uploaded] }))
      showMessage(`${uploaded.length} gambar ditambahkan.`)
    } catch {
      showMessage('Gagal upload gambar. Pastikan file berupa image.')
    } finally {
      setUploading(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.demo.trim()) {
      showMessage('Nama dan link demo wajib diisi.')
      return
    }
    upsertPortfolioItem({
      ...form,
      id: editingId || undefined,
    })
    showMessage(editingId ? 'Portfolio berhasil diperbarui.' : 'Portfolio berhasil ditambahkan.')
    startCreate()
  }

  function handleDelete(id: string) {
    if (!window.confirm('Hapus portfolio ini?')) return
    deletePortfolioItem(id)
    if (editingId === id) startCreate()
    showMessage('Portfolio dihapus.')
  }

  function handleExport() {
    const blob = new Blob([exportPortfolioJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'karsa-portfolio.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(file: File) {
    try {
      const text = await file.text()
      const count = importPortfolioJson(text)
      showMessage(`${count} portfolio berhasil diimpor.`)
      startCreate()
    } catch {
      showMessage('Gagal impor JSON. Periksa format file.')
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Backend / Portfolio</p>
          <h1>Kelola Portfolio</h1>
          <p>Atur project, deskripsi, link demo, dan preview yang tampil di website.</p>
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={startCreate}>
          + Tambah Portfolio
        </button>
      </header>

      <div className="admin-stats">
        <article>
          <span>Total</span>
          <strong>{items.length}</strong>
        </article>
        <article>
          <span>Published</span>
          <strong>{publishedCount}</strong>
        </article>
        <article>
          <span>Draft</span>
          <strong>{draftCount}</strong>
        </article>
      </div>

      {message ? <div className="admin-alert success">{message}</div> : null}

      <div className="admin-grid">
        <section className="admin-panel admin-panel-form">
          <div className="admin-panel-head">
            <div>
              <h2>{editingId ? 'Edit Portfolio' : 'Tambah Portfolio'}</h2>
              <p>{editingId ? 'Perbarui detail project yang dipilih.' : 'Isi form untuk menambah project baru.'}</p>
            </div>
            {editingId ? <span className="admin-chip">Mode Edit</span> : null}
          </div>

          <form className="admin-form" onSubmit={handleSubmit} ref={formRef}>
            <div className="admin-form-section">
              <h3>Informasi Project</h3>
              <label className="admin-field">
                <span>Nama Project</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Contoh: PetShop - E-POS"
                  required
                />
              </label>

              <div className="admin-row-2">
                <label className="admin-field">
                  <span>Kategori</span>
                  <input
                    list="category-list"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="Retail / Kuliner / Fashion / Jasa"
                    required
                  />
                  <datalist id="category-list">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </label>

                <label className="admin-field">
                  <span>Warna Mockup</span>
                  <select
                    value={form.tone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tone: e.target.value as PortfolioTone }))
                    }
                  >
                    <option value="default">Biru (default)</option>
                    <option value="warm">Warm</option>
                    <option value="green">Hijau</option>
                  </select>
                </label>
              </div>

              <label className="admin-field">
                <span>Deskripsi Singkat (card)</span>
                <textarea
                  rows={3}
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  placeholder="Maksimal 1–2 kalimat. Jangan tempel Markdown panjang di sini."
                  required
                  maxLength={280}
                />
                <em>
                  Untuk card depan saja ({form.desc.length}/280). Teks panjang & Markdown taruh di
                  Deskripsi Lengkap.
                </em>
              </label>

              <label className="admin-field">
                <span>Deskripsi Lengkap (modal Detail)</span>
                <textarea
                  rows={10}
                  value={form.detail || ''}
                  onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))}
                  placeholder="Tempel deskripsi lengkap di sini (boleh Markdown: ## Judul, - list, **tebal**)"
                />
                <em>Ditampilkan saat pengunjung klik tombol “Detail” di portfolio.</em>
              </label>
            </div>

            <div className="admin-form-section">
              <h3>Galeri Gambar Detail</h3>
              <em className="admin-section-hint">
                Gambar ini muncul di modal Detail. Bisa upload file atau tempel URL.
              </em>

              <div className="admin-image-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-soft"
                  disabled={uploading}
                  onClick={() => imageInputRef.current?.click()}
                >
                  {uploading ? 'Mengupload...' : 'Upload Gambar'}
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    void handleImageFiles(e.target.files)
                    e.target.value = ''
                  }}
                />
              </div>

              <div className="admin-row-2">
                <label className="admin-field">
                  <span>Atau tempel URL gambar</span>
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://.../screenshot.png"
                  />
                </label>
                <div className="admin-field" style={{ justifyContent: 'end' }}>
                  <span>&nbsp;</span>
                  <button
                    type="button"
                    className="admin-btn admin-btn-soft"
                    onClick={() => {
                      addImage(imageUrl)
                      setImageUrl('')
                    }}
                  >
                    Tambah URL
                  </button>
                </div>
              </div>

              {formImages.length > 0 ? (
                <div className="admin-image-grid">
                  {formImages.map((src, index) => (
                    <div key={`${index}-${src.slice(0, 24)}`} className="admin-image-card">
                      <img src={src} alt={`Preview ${index + 1}`} />
                      <button type="button" onClick={() => removeImage(index)}>
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-empty-images">Belum ada gambar detail.</div>
              )}
            </div>

            <div className="admin-form-section">
              <h3>Link & Tampilan</h3>
              <label className="admin-field">
                <span>Link Demo</span>
                <input
                  value={form.demo}
                  onChange={(e) => setForm((f) => ({ ...f, demo: e.target.value }))}
                  placeholder="https://... atau /demos/petshop/..."
                  required
                />
                <em>Dipakai tombol “Lihat Demo” di website.</em>
              </label>

              <label className="admin-field">
                <span>Link Preview Mockup</span>
                <input
                  value={form.preview || ''}
                  onChange={(e) => setForm((f) => ({ ...f, preview: e.target.value }))}
                  placeholder="Kosongkan jika sama dengan link demo"
                />
                <em>URL yang ditampilkan di dalam mockup HP/tablet/desktop.</em>
              </label>

              <div className="admin-row-2">
                <label className="admin-field">
                  <span>Urutan Tampil</span>
                  <input
                    type="number"
                    min={1}
                    value={form.sortOrder ?? items.length + 1}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 1 }))
                    }
                  />
                </label>

                <label className={`admin-switch ${form.published ? 'on' : ''}`}>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  />
                  <span className="admin-switch-ui" />
                  <span className="admin-switch-text">
                    {form.published ? 'Published di website' : 'Disimpan sebagai draft'}
                  </span>
                </label>
              </div>
            </div>

            <div className="admin-form-actions">
              {editingId ? (
                <button type="button" className="admin-btn admin-btn-soft" onClick={startCreate}>
                  Batal
                </button>
              ) : null}
              <button type="submit" className="admin-btn admin-btn-primary">
                {editingId ? 'Simpan Perubahan' : 'Tambah Portfolio'}
              </button>
            </div>
          </form>
        </section>

        <section className="admin-panel admin-panel-list">
          <div className="admin-panel-head">
            <div>
              <h2>Daftar Portfolio</h2>
              <p>{filtered.length} dari {items.length} project</p>
            </div>
            <div className="admin-toolbar">
              <input
                className="admin-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari project..."
              />
              <button type="button" className="admin-btn admin-btn-soft" onClick={handleExport}>
                Export
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-soft"
                onClick={() => fileRef.current?.click()}
              >
                Import
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-soft"
                onClick={() => {
                  if (window.confirm('Reset ke data default?')) {
                    resetPortfolioItems()
                    startCreate()
                    showMessage('Data direset ke default.')
                  }
                }}
              >
                Reset
              </button>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleImport(file)
              e.target.value = ''
            }}
          />

          <div className="admin-card-list">
            {filtered.map((item) => (
              <article
                key={item.id}
                className={`admin-item-card ${editingId === item.id ? 'is-editing' : ''}`}
              >
                <div className="admin-item-top">
                  <div>
                    <div className="admin-item-meta">
                      <span className="admin-order">#{item.sortOrder}</span>
                      <span className="admin-cat">{item.category}</span>
                      <span className={`admin-badge ${item.published ? 'on' : 'off'}`}>
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h3>{item.name}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>

                <div className="admin-item-links">
                  <div>
                    <span>Demo</span>
                    <a href={item.demo} target="_blank" rel="noreferrer">
                      {item.demo}
                    </a>
                  </div>
                  {item.preview ? (
                    <div>
                      <span>Preview</span>
                      <a href={item.preview} target="_blank" rel="noreferrer">
                        {item.preview}
                      </a>
                    </div>
                  ) : null}
                </div>

                <div className="admin-item-actions">
                  <button type="button" className="admin-btn admin-btn-soft" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                  <a
                    className="admin-btn admin-btn-soft"
                    href={item.demo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Buka Demo
                  </a>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </button>
                </div>
              </article>
            ))}

            {filtered.length === 0 ? (
              <div className="admin-empty">Tidak ada portfolio yang cocok dengan pencarian.</div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}
