import { useMemo, useRef, useState, type FormEvent } from 'react'
import { usePortfolio } from '../../hooks/usePortfolio'
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
  demo: '',
  preview: '',
  published: true,
}

export default function PortfolioAdmin() {
  const items = usePortfolio(true)
  const [form, setForm] = useState<PortfolioFormData>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const categories = useMemo(() => getCategories(), [items])

  function showMessage(text: string) {
    setMessage(text)
    window.setTimeout(() => setMessage(''), 2500)
  }

  function startCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  function startEdit(item: PortfolioItem) {
    setEditingId(item.id)
    setForm({
      id: item.id,
      name: item.name,
      category: item.category,
      tone: item.tone,
      desc: item.desc,
      demo: item.demo,
      preview: item.preview || '',
      published: item.published,
      sortOrder: item.sortOrder,
    })
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
          <h1>Kelola Portfolio</h1>
          <p>Atur nama project, kategori, deskripsi, link demo, dan link preview mockup.</p>
        </div>
        <div className="admin-head-actions">
          <button type="button" className="btn btn-ghost" onClick={handleExport}>
            Export JSON
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
            Import JSON
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              if (window.confirm('Reset ke data default?')) {
                resetPortfolioItems()
                startCreate()
                showMessage('Data direset ke default.')
              }
            }}
          >
            Reset Default
          </button>
          <button type="button" className="btn btn-primary" onClick={startCreate}>
            + Tambah Portfolio
          </button>
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
      </header>

      {message ? <div className="admin-alert success">{message}</div> : null}

      <div className="admin-grid">
        <section className="glass admin-panel">
          <h2>{editingId ? 'Edit Portfolio' : 'Tambah Portfolio'}</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
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
              <span>Deskripsi</span>
              <textarea
                rows={3}
                value={form.desc}
                onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                placeholder="Ringkasan singkat project untuk card portfolio"
                required
              />
            </label>

            <label className="admin-field">
              <span>Link Demo (tombol Lihat Demo)</span>
              <input
                value={form.demo}
                onChange={(e) => setForm((f) => ({ ...f, demo: e.target.value }))}
                placeholder="https://... atau /demos/petshop/..."
                required
              />
            </label>

            <label className="admin-field">
              <span>Link Preview Mockup (opsional)</span>
              <input
                value={form.preview || ''}
                onChange={(e) => setForm((f) => ({ ...f, preview: e.target.value }))}
                placeholder="Kosongkan jika sama dengan link demo"
              />
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

              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                />
                <span>Tampilkan di website (published)</span>
              </label>
            </div>

            <div className="admin-form-actions">
              {editingId ? (
                <button type="button" className="btn btn-ghost" onClick={startCreate}>
                  Batal Edit
                </button>
              ) : null}
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Simpan Perubahan' : 'Tambah Portfolio'}
              </button>
            </div>
          </form>
        </section>

        <section className="glass admin-panel">
          <h2>Daftar Portfolio ({items.length})</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Urutan</th>
                  <th>Project</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Demo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className={editingId === item.id ? 'is-editing' : ''}>
                    <td>{item.sortOrder}</td>
                    <td>
                      <strong>{item.name}</strong>
                      <small>{item.desc}</small>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <span className={`admin-badge ${item.published ? 'on' : 'off'}`}>
                        {item.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <a href={item.demo} target="_blank" rel="noreferrer" className="admin-link">
                        Buka
                      </a>
                    </td>
                    <td className="admin-row-actions">
                      <button type="button" className="btn btn-ghost" onClick={() => startEdit(item)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
