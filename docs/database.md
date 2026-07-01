# Database & Penyimpanan Data

Dokumentasi skema database MySQL, sistem migrasi TypeScript, dan mode penyimpanan alternatif (localStorage) yang digunakan oleh EcoVision AI.

---

## Dua Mode Penyimpanan

EcoVision AI mendukung dua mode penyimpanan yang dapat diatur via environment variable `NEXT_PUBLIC_DB_STORAGE`:

| Mode | Variabel | Login Diperlukan | Teknologi | Cocok untuk |
|---|---|---|---|---|
| **MySQL** | `mysql` | ✅ Ya | MySQL 8+ | Produksi, pengembangan penuh |
| **localStorage** | `localstorage` | ❌ Tidak | Browser localStorage | Demo, offline, tanpa MySQL |

---

## Mode MySQL

### Prasyarat

- MySQL 8+ berjalan di localhost
- Konfigurasi koneksi di `.env.local` (lihat [environment.md](environment.md))

### Menjalankan Migrasi

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

## Skema Tabel (MySQL)

### `users`
Dibuat oleh: `database/migrations/001_create_users_and_history.ts`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `VARCHAR(50)` PK | ID unik pengguna |
| `name` | `VARCHAR(100)` | Nama tampilan |
| `email` | `VARCHAR(100)` UNIQUE | Email login |
| `password_hash` | `VARCHAR(255)` | Hash bcrypt dari password |
| `created_at` | `TIMESTAMP` | Waktu registrasi |

---

### `scan_history`
Dibuat oleh: `database/migrations/001_create_users_and_history.ts`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `VARCHAR(50)` PK | ID unik scan |
| `user_id` | `VARCHAR(50)` FK | Referensi ke `users.id` (CASCADE DELETE) |
| `waste_id` | `VARCHAR(50)` | ID kategori sampah (misalnya `plastic-pet`) |
| `name` | `VARCHAR(100)` | Nama sampah yang terdeteksi |
| `category` | `VARCHAR(50)` | Kategori umum (misalnya `plastic`) |
| `confidence` | `INT` | Confidence score 0–100 |
| `scanned_at` | `TIMESTAMP` | Waktu scan |
| `co2_offset` | `DECIMAL(5,2)` | Estimasi CO₂ offset (kg) |
| `recyclable` | `TINYINT(1)` | 1 jika dapat didaur ulang |

---

### `chat_sessions`
Dibuat oleh: `database/migrations/002_create_chats.ts`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `VARCHAR(50)` PK | ID unik sesi percakapan |
| `user_id` | `VARCHAR(50)` FK | Referensi ke `users.id` (CASCADE DELETE) |
| `title` | `VARCHAR(255)` | Judul sesi (dari pesan pertama user) |
| `created_at` | `DATETIME` | Waktu sesi dibuat |
| `updated_at` | `DATETIME` | Waktu pesan terakhir |

---

### `chat_messages`
Dibuat oleh: `database/migrations/002_create_chats.ts`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | `INT` PK AUTO_INCREMENT | ID pesan |
| `session_id` | `VARCHAR(50)` FK | Referensi ke `chat_sessions.id` (CASCADE DELETE) |
| `role` | `ENUM('user','assistant')` | Pengirim pesan |
| `content` | `TEXT` | Isi pesan |
| `image` | `MEDIUMTEXT` | Base64 gambar (opsional) |
| `created_at` | `DATETIME` | Waktu pesan |

---

### `_migrations`
Tabel internal untuk tracking migrasi.

| Kolom | Tipe | Keterangan |
|---|---|---|
| `name` | `VARCHAR(255)` PK | Nama file migration |
| `run_at` | `DATETIME` | Waktu migration dijalankan |

---

## Mode localStorage (Guest Mode)

Pada mode ini, **tidak dibutuhkan MySQL sama sekali**. Semua data disimpan langsung di browser pengguna via browser `localStorage`.

**File:** `src/lib/clientStorage.ts`

> [!WARNING]
> Data di mode `localstorage` bersifat lokal per browser. Jika pengguna menghapus data browser atau membuka di browser/perangkat lain, data tidak akan tersedia.

### Struktur Data di Browser

| localStorage Key | Isi | Tipe |
|---|---|---|
| `ecovision_scan_history` | Semua riwayat scan | `LocalScanItem[]` |
| `ecovision_chat_sessions` | Daftar sesi percakapan | `LocalChatSession[]` |
| `ecovision_chat_messages_<sessionId>` | Pesan per sesi | `LocalChatMessage[]` |

### Fungsi yang Tersedia

| Fungsi | Deskripsi |
|---|---|
| `isLocalStorageMode()` | Cek apakah mode aktif adalah `localstorage` |
| `getScanHistory()` | Ambil semua riwayat scan dari localStorage |
| `saveScan(item)` | Simpan hasil scan ke localStorage |
| `getStats()` | Hitung statistik agregat dari data localStorage |
| `getChatSessions()` | Ambil daftar sesi chat dari localStorage |
| `getChatMessages(sessionId)` | Ambil pesan dalam satu sesi |
| `saveChatMessage(sessionId, role, content)` | Simpan pesan chat; auto-buat sesi baru jika perlu |

---

## Helper Database MySQL (`src/lib/db.ts`)

Fungsi-fungsi query untuk mode MySQL:

| Fungsi | Deskripsi |
|---|---|
| `getPool()` | Inisialisasi dan kembalikan MySQL connection pool |
| `getUsers()` | Ambil semua user (admin) |
| `saveUser(user)` | Buat akun baru |
| `findUserByEmail(email)` | Cari user berdasarkan email |
| `findUserById(id)` | Cari user berdasarkan ID |
| `getUserHistory(userId)` | Ambil riwayat scan user |
| `saveScan(userId, item)` | Simpan hasil scan ke MySQL |
| `getUserStats(userId)` | Hitung statistik agregat scan |
| `getChatSessions(userId)` | Ambil daftar sesi chat user |
| `getChatMessages(sessionId)` | Ambil semua pesan dalam satu sesi |
| `saveChatMessage(sessionId, userId, role, content)` | Simpan pesan & auto-buat sesi baru jika perlu |
