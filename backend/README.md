# Gigpass API Service - Tiket & Konser Musik

REST API Service menggunakan Node.js & Express.js dengan integrasi database Supabase (PostgreSQL).

## Setup & Instalasi
```bash
npm install
# Migrasi otomatis ke Supabase:
npm run migrate
# Menjalankan server development:
npm run dev
```

`.env`: Kredensial database Supabase / MySQL, `JWT_SECRET`, `PORT`.
Bukti transfer manual disimpan di `uploads/proofs/` (tidak diakses publik, lihat `GET /api/admin/payments/:id/proof`).

Cek alur pembayaran tanpa database: `node tests/payment.check.js`

## Endpoint

Semua response: `{ success, message, data }`. Header `Authorization: Bearer <token>` untuk endpoint selain yang ditandai publik.

| Area | Endpoint | Akses |
|---|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` | publik |
| Profil | `GET/PUT /api/users/profile` (`name`, `email`, `phone`, `password`) | login |
| Konser | `GET /api/concerts`, `GET /api/concerts/:id`, `GET /api/concerts/:id/artists` | publik |
| | `POST/PUT/DELETE /api/concerts[/:id]` | admin |
| | `POST /api/concerts/:id/artists` (`{artist_id}`), `DELETE /api/concerts/:id/artists/:artistId` | admin |
| Artis | `GET /api/artists[/:id]` | login |
| | `POST/PUT/DELETE /api/artists[/:id]` (`name`, `description`, `image`) | admin |
| Kategori tiket | `GET /api/tickets/concert/:concertId` | publik |
| | `POST/PUT/DELETE /api/tickets[/:id]` | admin |
| Order | `POST /api/orders`, `GET /api/orders/my-orders`, `GET /api/orders/:id`, `PATCH /api/orders/:id/cancel`, `PATCH /api/orders/:id/expire` | login |
| Pembayaran | `POST /api/payments` (`order_id`, `payment_method`) | login |
| | `PATCH /api/payments/:id/success` (selain `manual_transfer`) | login |
| | `POST /api/payments/:id/proof` (form-data: `proof` (png/jpg/webp, maks 2MB), `sender_bank`, `sender_name`) | login |
| Tiket saya | `GET /api/tickets/my-tickets` | login |
| Scan tiket | `POST /api/tickets/scan` (`{ticket_code}`), juga `/validate` & `PATCH /use` | admin |
| Favorit | `GET /api/favorites`, `POST/DELETE /api/favorites/:concertId` | login |
| Notifikasi | `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all` | login |
| Admin | `GET /api/admin/dashboard`, `GET /api/admin/reports?start_date&end_date&concert_id` | admin |
| | `GET /api/admin/users`, `PATCH /api/admin/users/:id/role` (`{role: user\|admin}`) | admin |
| | `GET /api/admin/payments?status=waiting\|approved\|rejected` | admin |
| | `GET /api/admin/payments/:id/proof` (gambar), `PATCH .../:id/verify`, `PATCH .../:id/reject` (`{reason?}`) | admin |

## Alur transfer bank manual

1. `POST /api/orders` lalu `POST /api/payments` dengan `payment_method: "manual_transfer"`.
2. `POST /api/payments/:id/proof` (unggah bukti). Status tetap `pending` = "Menunggu Verifikasi".
3. Admin `verify` → payment `success`, order `paid`, tiket diterbitkan, user dapat notifikasi.
   Admin `reject` → payment `failed`, user dapat notifikasi beserta alasan.
4. Order yang bukti transfernya sedang menunggu verifikasi tidak di-expire cron (15 menit). Setelah ditolak, order expire pada siklus cron berikutnya dan stok dikembalikan.
