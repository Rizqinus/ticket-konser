# DESIGN MANIFESTO: TICKET KONSER (ANTI-SLOP EDITION)

Dokumen ini adalah acuan visual dan interaksi tunggal untuk seluruh antarmuka (Web Admin & Mobile App). Dibuat untuk menghapus pola generik AI ("AI Slop") dan menghadirkan desain yang berkarakter, berdaya guna tinggi, serta berorientasi pada manusia.

---

## 1. Filosofi & Karakter Visual

* **Tema Utama**: *Live Stage & High-Clarity Concert Ticketing*.
* **Bukan Template**: Tidak ada ornamen lingkaran gradien kabur (*blur orbs*), tidak ada kartu ungu lavender Material Design generik yang kaku, dan tidak ada elemen dekoratif tanpa fungsi.
* **Karakter**: Bersih, tegas, kontras tajam, terinspirasi oleh tiket konser fisik modern (editorial typography, crisp borders, tactile press states, layout yang bernafas).

---

## 2. Palet Warna (Color System)

Beralih dari palet ungu AI klise ke palet bernuansa *stage venue & high-contrast surfaces*:

### Base / Dark Surfaces (Venue & Accent)
* **Carbon Ink (Primary Dark)**: `#0B0F19` (Background tegas & teks utama berbobot)
* **Slate Surface (Card & Container)**: `#1E293B` (Untuk panel gelap / dark mode)
* **Subtle Border**: `#E2E8F0` (Light) / `#334155` (Dark)

### Accent & Identity
* **Stage Electric Blue / Cyan (Primary Accent)**: `#2563EB` (Action utama, trust, visibilitas tinggi)
* **Neon Amber / Stage Gold**: `#F59E0B` (Highlight konser, kategori VIP, status pending)
* **Vibrant Emerald**: `#10B981` (Status lunas, tiket aktif, QR valid)
* **Crimson Red**: `#EF4444` (Batal, expired, kuota habis)

### Light Surfaces
* **Canvas Light**: `#F8FAFC` (Latar belakang bersih, bukan abu-abu kotor)
* **Pure Surface**: `#FFFFFF` (Kartu putih dengan border 1px solid yang presisi)
* **Text High-Contrast**: `#0F172A` (Teks judul & angka metrik)
* **Text Muted**: `#64748B` (Keterangan pendukung, label teknis)

---

## 3. Tipografi & Hirarki

* **Font Utama**: Inter / System Sans-serif modern.
* **Hirarki Kontras**:
  * Judul halaman tegas (`text-2xl` s/d `text-3xl`, `font-extrabold`, letter-spacing rapat `-0.02em`).
  * Angka metrik / harga: Monospace tabular atau semi-bold tegas untuk memudahkan scanning cepat.
  * Label status: Huruf kecil dengan bobot tebal (`text-xs font-semibold uppercase tracking-wider`).

---

## 4. Copywriting Anti-Slop (No Robotic Tone)

* **Dilarang**:
  * Em dash (`—`) atau double hyphen (`--`). Gunakan koma, titik dua, atau kurung.
  * Frasa klise: *"Enterprise Administration Portal"*, *"Unlock the power of"*, *"Seamless experience"*, *"Welcome back Music Explorer"*.
* **Gunakan Bahasa Nyata & Lugas**:
  * *"Portal Pengelola Tiket"* atau *"Pusat Kendali Konser"*.
  * *"Selamat datang kembali, [Nama]"*.
  * *"Ringkasan Penjualan"* (bukan *"Dashboard Overview"*).
  * *"Perlu Verifikasi"* (bukan *"Pending Verification Actionables"*).

---

## 5. Standar Aksesibilitas & Ergonomi (Hard Gates)

1. **Touch Targets (Mobile)**: Seluruh tombol, link, dan chip filter wajib memiliki area tap minimal **44px x 44px**.
2. **Kontras WCAG**: Semua kombinasi teks dan background wajib lulus kontras minimal 4.5:1 (AA) dan 7:1 untuk teks utama (AAA).
3. **No Horizontal Overflow**: Kontainer mobile tidak boleh memiliki scroll horizontal tak disengaja.
4. **Micro-States Nyata**:
   * Setiap tombol memiliki visual state: `hover:opacity-90`, `active:scale-98`, dan `focus-visible:ring-2`.
   * Form input memiliki border halus saat pasif dan ring kontras saat fokus.
