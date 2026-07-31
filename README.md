# Ticket Konser - Monorepo

Sistem Manajemen & Pemesanan Tiket Konser.

## 📁 Struktur Repositori (Monorepo)

- **`frontend/`**: Aplikasi Web (Next.js & Tailwind CSS)
- **`backend/`**: REST API Service (Node.js / Express.js)
- **`mobile/`**: Aplikasi Mobile (Flutter / React Native)

---

## 🚀 Cara Menjalankan Project

### 1. Frontend (Web)
```bash
cd frontend
npm install
npm run dev
```
Buka browser di `http://localhost:3000`.

### 2. Backend (API)
```bash
cd backend
npm install
npm run dev
```

### 3. Mobile
```bash
cd mobile
# Instruksi jalankan aplikasi mobile
```

---

## 🌿 Branching Strategy

- **`main`**: Kode stabil / Production (Terproteksi, merge wajib lewat PR).
- **`dev`**: Kode pengembangan aktif.
- **`feature/nama-fitur`**: Branch fitur baru yang dibuat dari `dev`.
