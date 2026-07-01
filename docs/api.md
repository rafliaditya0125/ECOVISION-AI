# API Endpoints

Dokumentasi lengkap untuk semua REST API route yang tersedia di EcoVision AI.  
Semua route berada di bawah prefix `/api/` dan diimplementasikan sebagai Next.js Route Handlers.

---

## Daftar Endpoint

| Method | Path | Auth | Deskripsi |
|---|---|---|---|
| `POST` | `/api/analyze` | Tidak | Klasifikasi gambar sampah via Gemini |
| `POST` | `/api/chat` | Tidak (persist jika login) | Chat dengan AI Eco-Assistant |
| `GET` | `/api/chat/sessions` | Cookie JWT | Ambil daftar sesi chat / pesan satu sesi |
| `POST` | `/api/auth/register` | Tidak | Registrasi akun baru |
| `POST` | `/api/auth/login` | Tidak | Login & set cookie sesi |
| `POST` | `/api/auth/logout` | Cookie JWT | Hapus cookie sesi |
| `GET` | `/api/auth/me` | Cookie JWT | Ambil data user yang sedang login |
| `GET` | `/api/history` | Cookie JWT | Ambil riwayat scan user |
| `GET` | `/api/stats` | Cookie JWT | Ambil statistik aggregat user |

---

## Detail Endpoint

### `POST /api/analyze`

Mengirim gambar ke model AI untuk diklasifikasikan sebagai jenis sampah.

**Headers:**
| Header | Wajib | Deskripsi |
|---|---|---|
| `x-api-key` | Ya | API Key Gemini yang dikirim dari client |
| `Content-Type` | Ya | `multipart/form-data` (otomatis dari FormData) |

**Request Body (FormData):**
| Field | Tipe | Wajib | Deskripsi |
|---|---|---|---|
| `image` | `File` | Ya | File gambar (JPEG/PNG, maks 10MB) |

**Response Sukses (`200`):**
```json
{
  "success": true,
  "id": "plastic-pet",
  "confidence": 94,
  "detectedLabel": "plastic-pet"
}
```

**Response Error:**
```json
{ "success": false, "message": "No image file provided." }      // 400
{ "success": false, "message": "Invalid image." }               // 400
{ "success": false, "message": "Image size exceeds 10MB." }     // 400
{ "success": false, "message": "Internal server error." }       // 500
```

---

### `POST /api/chat`

Mengirim percakapan ke Gemini untuk mendapatkan respons AI Eco-Assistant. Jika user sedang login (cookie valid), pesan akan otomatis disimpan ke database.

**Headers:**
| Header | Wajib | Deskripsi |
|---|---|---|
| `x-api-key` | Ya | API Key Gemini |
| `Content-Type` | Ya | `application/json` |

**Request Body (JSON):**
```json
{
  "messages": [
    { "role": "user", "content": "Bagaimana cara mendaur ulang botol plastik?" }
  ],
  "sessionId": "uuid-opsional"
}
```

| Field | Tipe | Wajib | Deskripsi |
|---|---|---|---|
| `messages` | `Message[]` | Ya | Array pesan (role: `user` / `assistant`) |
| `sessionId` | `string` | Tidak | ID sesi untuk melanjutkan percakapan |

**Response Sukses (`200`):**
```json
{
  "success": true,
  "response": "Botol plastik PET dapat didaur ulang dengan cara...",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### `GET /api/chat/sessions`

Mengambil daftar sesi chat atau isi pesan dari satu sesi.

**Headers:**
| Header | Wajib | Deskripsi |
|---|---|---|
| `Cookie` | Ya | Cookie `session_token` dari login |

**Query Params:**
| Param | Wajib | Deskripsi |
|---|---|---|
| `id` | Tidak | Jika diisi, mengembalikan daftar pesan sesi tersebut |

**Response — Daftar Sesi (tanpa `?id`):**
```json
{
  "success": true,
  "sessions": [
    {
      "id": "550e8400-...",
      "title": "Bagaimana cara mendaur ulang botol plastik?",
      "updated_at": "2026-07-01T03:00:00Z"
    }
  ]
}
```

**Response — Pesan Sesi (dengan `?id=xxx`):**
```json
{
  "success": true,
  "messages": [
    { "role": "user", "content": "Bagaimana cara mendaur ulang botol plastik?" },
    { "role": "assistant", "content": "Botol plastik PET dapat didaur ulang..." }
  ]
}
```

---

### `POST /api/auth/register`

**Request Body (JSON):**
```json
{ "name": "Budi", "email": "budi@mail.com", "password": "password123" }
```
**Response:** `{ "success": true, "message": "Account created." }`

---

### `POST /api/auth/login`

**Request Body (JSON):**
```json
{ "email": "budi@mail.com", "password": "password123" }
```
**Response:** Set HTTP-only cookie `session_token`. `{ "success": true, "user": {...} }`

---

### `GET /api/auth/me`

Membutuhkan cookie `session_token`. Mengembalikan data user yang sedang login.

---

### `GET /api/history`

Membutuhkan cookie `session_token`. Mengembalikan riwayat scan user.

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": "uuid",
      "name": "PET Plastic Bottle",
      "category": "plastic",
      "confidence": 94,
      "scanned_at": "2026-07-01T03:00:00Z",
      "co2_offset": 0.3,
      "recyclable": true
    }
  ]
}
```

---

### `GET /api/stats`

Membutuhkan cookie `session_token`. Mengembalikan statistik agregat user.

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_scans": 42,
    "total_co2_offset": 12.6,
    "recyclable_count": 35,
    "categories": { "plastic": 20, "paper": 10, "metal-can": 5, ... }
  }
}
```
