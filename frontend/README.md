# Concert Manager - Admin Web (Next.js)

Konversi dari desain HTML/Tailwind (Google Stitch) ke Next.js App Router + TypeScript + Tailwind CSS.

## Halaman

| Route | Deskripsi |
| --- | --- |
| `/login` | Admin login |
| `/dashboard` | Dashboard overview (stat cards, chart, transaksi terbaru) |
| `/artis` | Kelola Artis (tabel + modal tambah/edit) |
| `/event` | Kelola Event (tabel + filter + toggle status penjualan) |
| `/kategori-tiket` | Manajemen Kategori Tiket (metrik + tabel kuota + modal tambah) |
| `/verifikasi` | Verifikasi Transaksi (tabel + modal preview bukti bayar) |
| `/pengguna` | Kelola Pengguna (stat cards + tabel + live search filter) |
| `/laporan` | Laporan Analitik (summary cards, chart tren, sales by category, top locations) |
| `/pengaturan` | Pengaturan Sistem (tabs General/Branding/Security/Notifications, form, toggle maintenance mode) |

Layout sidebar & topbar admin dipusatkan di `src/components/AdminLayout.tsx` supaya konsisten di semua halaman (di desain asli tiap file HTML punya markup sidebar duplikat sendiri-sendiri).

Warna, tipografi, radius, dan spacing diambil dari `sonic_admin/DESIGN.md` / konfigurasi Tailwind di tiap `code.html`, dipindahkan ke `tailwind.config.ts`.

## Menjalankan project

Project ini dibuat manual (tanpa akses internet di lingkungan kerja saya), jadi `node_modules` belum ter-install. Di komputermu:

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:3000` (otomatis redirect ke `/login`).

## Catatan

- Gambar (foto artis, poster event, avatar admin, bukti transfer) masih memakai URL placeholder dari desain asli (`lh3.googleusercontent.com`) — domain ini sudah didaftarkan di `next.config.mjs` supaya `next/image` bisa memuatnya. Ganti dengan aset/API asli saat backend Express sudah tersedia.
- Semua data (artis, event, kategori tiket, transaksi) masih hardcoded di tiap `page.tsx` (`const ARTISTS = [...]`, dst). Nanti tinggal diganti fetch ke API backend.
- Tombol form (Save Artist, Simpan Kategori, Verify & Approve, dll) belum terhubung ke backend — masih UI-only sesuai desain.
