# KARSA DIGITAL — Company Profile

Website company profile untuk **KARSA DIGITAL**: solusi digital website UMKM, toko online, landing page, dan custom app.

## Stack

- React + TypeScript
- Vite
- Deploy siap [Netlify](https://www.netlify.com/)

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy ke Netlify

1. Push repo ke GitHub: `https://github.com/zico-padalino/company-profile.git`
2. Di Netlify: **Add new site → Import an existing project**
3. Pilih repo `company-profile`
4. Build settings (sudah ada di `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy site

## Customisasi cepat

- Logo: `public/logo-karsa.jpeg`
- Nomor WhatsApp & email: edit di `src/pages/HomePage.tsx` bagian kontak
- Portfolio/demo: kelola lewat backend `/admin`

## Backend Admin (Portfolio)

1. Buka `/admin` atau `/admin/login`
2. Password default: `karsa2026` (bisa diganti lewat `VITE_ADMIN_PASSWORD` di `.env`)
3. Di menu **Portfolio** Anda bisa:
   - Tambah / edit / hapus project
   - Atur nama, kategori, deskripsi, link demo, link preview mockup
   - Publish / draft
   - Export & import JSON

Data portfolio disimpan di `localStorage` browser (cocok untuk Netlify static).
