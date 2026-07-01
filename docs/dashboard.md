# Dashboard & Riwayat Pengguna

Dokumentasi untuk fitur dashboard di halaman `/dashboard` yang menampilkan statistik, riwayat scan, dan riwayat chat.

---

## Gambaran Umum

Dashboard adalah halaman personal pengguna yang terotentikasi. Halaman ini mengumpulkan dan menampilkan seluruh aktivitas pengguna: scan sampah, percakapan AI, statistik agregat, dan dampak lingkungan yang telah dikontribusikan.

---

## Akses

Halaman `/dashboard` hanya dapat diakses oleh pengguna yang sudah login. Jika belum login, pengguna akan diredirect ke `/login` oleh hook `useAuth`.

---

## Halaman

| File | Peran |
|---|---|
| `src/app/dashboard/page.tsx` | Halaman dashboard utama |

---

## Bagian-bagian Dashboard

### 1. Header & Profil

Menampilkan salam personal ("Halo, {nama}!") dan ringkasan aktivitas terkini.

---

### 2. Kartu Statistik

Empat kartu statistik yang diambil dari `GET /api/stats`:

| Kartu | Data | Deskripsi |
|---|---|---|
| **Total Scans** | `stats.total_scans` | Jumlah semua scan yang pernah dilakukan |
| **CO₂ Offset** | `stats.total_co2_offset` kg | Estimasi total CO₂ yang terhindarkan |
| **Recyclable** | `stats.recyclable_count` | Jumlah scan yang itemnya dapat didaur ulang |
| **Accuracy** | Ditampilkan dari confidence rata-rata | Rata-rata confidence model |

---

### 3. Tab Selector: Scan History vs Chat History

Pengguna dapat beralih antara dua tab:

#### Tab "Riwayat Pindai" (Scan History)

Menampilkan semua scan yang tersimpan dari `GET /api/history`:

| Kolom | Sumber |
|---|---|
| Thumbnail kategori (emoji) | Berdasarkan `category` |
| Nama sampah | `item.name` |
| Kategori | `item.category` |
| Confidence score | `item.confidence` |
| Tanggal scan | `item.scanned_at` (diformat lokal) |
| Dapat didaur ulang | `item.recyclable` |

Jika belum ada riwayat, ditampilkan prompt untuk mulai scan pertama.

#### Tab "Riwayat Obrolan" (Chat History)

Menampilkan semua sesi chat dari `GET /api/chat/sessions`:

| Kolom | Sumber |
|---|---|
| Judul sesi | `session.title` (dari pesan pertama) |
| Tanggal terakhir aktif | `session.updated_at` |
| Tombol aksi | "Lanjutkan Percakapan" |

**Tombol "Lanjutkan Percakapan"** mengarahkan ke `/assistant?session=<id>`, yang memuat ulang semua pesan historis dari sesi tersebut.

---

## Data Fetching

Semua data diambil saat komponen mount menggunakan `useEffect`:

```typescript
// Fetch scan history
GET /api/history   → Cookie: session_token

// Fetch chat sessions
GET /api/chat/sessions   → Cookie: session_token

// Fetch stats
GET /api/stats   → Cookie: session_token
```

State loading ditampilkan selama fetch berlangsung.

---

## Lokalisasi

Semua label di dashboard mendukung bilingual (EN/ID) via `useLanguage` hook:

| Key | EN | ID |
|---|---|---|
| `dashboard.scanHistory` | Scan History | Riwayat Pindai |
| `dashboard.chatHistory` | Chat History | Riwayat Obrolan |
| `dashboard.noChatHistory` | No chat history... | Belum ada riwayat... |
| `dashboard.continueChat` | Continue Conversation | Lanjutkan Percakapan |
