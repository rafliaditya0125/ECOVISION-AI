# Database & Migrations

Dokumentasi skema database MySQL dan sistem migrasi TypeScript yang digunakan oleh EcoVision AI.

---

## Prasyarat

- MySQL 8+ berjalan di localhost
- Database `ecovision_db` sudah dibuat (dibuat otomatis saat migrasi pertama)
- Konfigurasi koneksi di `.env.local` (lihat [environment.md](environment.md))

---

## Menjalankan Migrasi

```bash
npm run db:migrate
```

Script ini (`scripts/migrate.ts`, dijalankan via `tsx`) akan:
1. Terhubung ke MySQL menggunakan config dari `.env.local`
2. Membuat tabel `_migrations` jika belum ada
3. Mendeteksi migration file mana yang belum dijalankan
4. Menjalankan setiap pending migration secara berurutan
5. Mencatat nama migration ke tabel `_migrations`

---

## Skema Tabel

### `users`
Dibuat oleh: `database/migrations/001_create_users_and_history.ts`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `CHAR(36)` PK | UUID v4 |
| `name` | `VARCHAR(255)` | Nama tampilan pengguna |
| `email` | `VARCHAR(255)` UNIQUE | Email login |
| `password_hash` | `VARCHAR(255)` | Hash bcrypt dari password |
| `created_at` | `DATETIME` | Waktu registrasi |

---

### `scan_history`
Dibuat oleh: `database/migrations/001_create_users_and_history.ts`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `CHAR(36)` PK | UUID v4 |
| `user_id` | `CHAR(36)` FK | Referensi ke `users.id` (CASCADE DELETE) |
| `waste_id` | `VARCHAR(100)` | ID kategori sampah (misalnya `plastic-pet`) |
| `name` | `VARCHAR(255)` | Nama sampah yang terdeteksi |
| `category` | `VARCHAR(100)` | Kategori umum (misalnya `plastic`) |
| `confidence` | `INT` | Confidence score 0–100 |
| `scanned_at` | `DATETIME` | Waktu scan |
| `co2_offset` | `DECIMAL(10,4)` | Estimasi CO₂ offset (kg) |
| `recyclable` | `TINYINT(1)` | 1 jika dapat didaur ulang |

---

### `chat_sessions`
Dibuat oleh: `database/migrations/002_create_chats.ts`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `CHAR(36)` PK | UUID v4 sesi percakapan |
| `user_id` | `CHAR(36)` FK | Referensi ke `users.id` (CASCADE DELETE) |
| `title` | `VARCHAR(255)` | Judul sesi (dari pesan pertama user) |
| `created_at` | `DATETIME` | Waktu sesi dibuat |
| `updated_at` | `DATETIME` | Waktu pesan terakhir |

---

### `chat_messages`
Dibuat oleh: `database/migrations/002_create_chats.ts`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `CHAR(36)` PK | UUID v4 pesan |
| `session_id` | `CHAR(36)` FK | Referensi ke `chat_sessions.id` (CASCADE DELETE) |
| `role` | `ENUM('user','assistant')` | Pengirim pesan |
| `content` | `TEXT` | Isi pesan |
| `created_at` | `DATETIME` | Waktu pesan |

---

### `_migrations`
Tabel internal untuk tracking migrasi yang sudah dijalankan.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `name` | `VARCHAR(255)` PK | Nama file migration |
| `run_at` | `DATETIME` | Waktu migration dijalankan |

---

## Helper Database (`src/lib/db.ts`)

File ini berisi semua fungsi query yang digunakan oleh API routes:

| Fungsi | Deskripsi |
|---|---|
| `getConnection()` | Membuat koneksi MySQL baru dari env config |
| `getUserByEmail(email)` | Ambil user berdasarkan email |
| `getUserByToken(token)` | Decode JWT + ambil user |
| `createUser(name, email, hash)` | Buat akun baru |
| `saveScanHistory(userId, item)` | Simpan hasil scan ke database |
| `getScanHistory(userId)` | Ambil semua riwayat scan user |
| `getStats(userId)` | Hitung statistik agregat scan |
| `getChatSessions(userId)` | Ambil daftar sesi chat user |
| `getChatMessages(sessionId)` | Ambil semua pesan dalam satu sesi |
| `saveChatMessage(sessionId, token, role, content)` | Simpan pesan & auto-buat sesi baru jika perlu |
