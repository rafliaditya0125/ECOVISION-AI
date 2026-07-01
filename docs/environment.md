# Environment Variables

Dokumen ini menjelaskan semua environment variable yang digunakan oleh EcoVision AI.

---

## Cara Setup

Salin file template ke `.env.local`:

```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# Linux / macOS
cp .env.example .env.local
```

Kemudian isi nilai setiap variabel sesuai panduan di bawah ini.

---

## Referensi Variabel

### 1. Gemini API Keys

| Variabel | Scope | Wajib | Deskripsi |
|---|---|---|---|
| `GEMINI_API_KEY` | Server-side | Ya (jika `gemini`) | API key Gemini untuk server fallback |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Client + Server | Ya (jika `gemini`) | API key yang dikirim via header HTTP `x-api-key` dari browser |

**Cara mendapatkan API Key:**
1. Buka [https://aistudio.google.com/](https://aistudio.google.com/)
2. Login dengan akun Google
3. Klik **Get API Key** → **Create API Key**
4. Salin hasilnya dan tempel ke kedua variabel di atas

**Perbedaan kedua variabel:**
- `GEMINI_API_KEY` → Hanya tersedia di server Node.js. Digunakan sebagai *fallback* jika header `x-api-key` tidak ada dalam request.
- `NEXT_PUBLIC_GEMINI_API_KEY` → Dibundel ke browser. Dibaca oleh `src/lib/apiKey.ts` dan dikirim ke server melalui header HTTP `x-api-key` pada setiap request ke `/api/analyze` dan `/api/chat`.

**Override API key di runtime (tanpa mengubah file):**

Buka browser DevTools → Console, lalu jalankan:
```javascript
localStorage.setItem("gemini_api_key", "API_KEY_ANDA");
location.reload();
```

`getClientApiKey()` akan membaca `localStorage` terlebih dahulu sebelum fallback ke `NEXT_PUBLIC_GEMINI_API_KEY`.

---

### 2. AI Provider Selection

| Variabel | Nilai | Default | Deskripsi |
|---|---|---|---|
| `NEXT_PUBLIC_AI_PROVIDER` | `gemini` / `mock` | `mock` | Menentukan backend AI yang digunakan |

| Nilai | Keterangan |
|---|---|
| `gemini` | Menggunakan model Gemini 2.5 Flash secara live. Membutuhkan API Key valid. |
| `mock` | Simulasi offline. Selalu mengembalikan `plastic-pet` dengan confidence 96%. Tidak butuh internet. |

---

### 3. MySQL Database

| Variabel | Default | Deskripsi |
|---|---|---|
| `MYSQL_HOST` | `localhost` | Alamat host server MySQL |
| `MYSQL_USER` | `root` | Username database MySQL |
| `MYSQL_PASSWORD` | *(kosong)* | Password database MySQL |
| `MYSQL_DATABASE` | `ecovision_db` | Nama database yang digunakan |
| `MYSQL_PORT` | `3306` | Port koneksi MySQL |

Setelah konfigurasi, jalankan migrasi untuk membuat tabel:
```bash
npm run db:migrate
```

---

## Contoh `.env.local` Lengkap

```env
# Gemini API Keys
GEMINI_API_KEY=AQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_GEMINI_API_KEY=AQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# AI Provider
NEXT_PUBLIC_AI_PROVIDER=gemini

# MySQL
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=password_saya
MYSQL_DATABASE=ecovision_db
MYSQL_PORT=3306
```
