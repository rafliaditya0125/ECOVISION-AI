# Dashboard & Riwayat Pengguna

Dokumentasi untuk fitur dashboard di halaman `/dashboard` yang menampilkan statistik, riwayat scan, dan riwayat chat.

---

## Gambaran Umum

Dashboard adalah halaman personal pengguna yang menampilkan seluruh aktivitas: scan sampah, percakapan AI, statistik agregat, dan dampak lingkungan yang telah dikontribusikan.

Dashboard mendukung dua mode:
- **Mode MySQL**: Membutuhkan login. Data diambil dari API.
- **Mode localStorage**: Akses langsung tanpa login. Data dibaca dari browser localStorage.

---

## Akses

| Mode | Akses |
|---|---|
| `mysql` | Halaman `/dashboard` hanya untuk pengguna yang sudah login. Jika belum login, diredirect ke `/login`. |
| `localstorage` | Dashboard langsung dapat diakses tanpa login. Link Dashboard ditampilkan langsung di Navbar. |

---

## Halaman

| File | Peran |
|---|---|
| `src/app/dashboard/page.tsx` | Halaman dashboard utama |

---

## Bagian-bagian Dashboard

### 1. Header & Profil

- **Mode MySQL**: Salam personal ("Halo, {nama}!") berdasarkan data akun.
- **Mode localStorage**: Salam generik untuk tamu (Guest).

---

### 2. Kartu Statistik

Empat kartu statistik:

| Kartu | Sumber MySQL | Sumber localStorage |
|---|---|---|
| **Total Scan** | `GET /api/stats` | `getStats()` dari clientStorage |
| **CO₂ Offset** | `GET /api/stats` | `getStats()` dari clientStorage |
| **Dapat Didaur Ulang** | `GET /api/stats` | `getStats()` dari clientStorage |
| **Recycling Rate** | `GET /api/stats` | `getStats()` dari clientStorage |

---

### 3. Tab Selector: Riwayat Scan vs Riwayat Chat

Pengguna dapat beralih antara dua tab:

#### Tab "Riwayat Pindai" (Scan History)

Menampilkan semua scan yang tersimpan:

| Kolom | Mode MySQL | Mode localStorage |
|---|---|---|
| Nama sampah | `item.name` | `item.name` |
| Kategori | `item.category` | `item.category` |
| Confidence | `item.confidence` | `item.confidence` |
| Tanggal | `item.scannedAt` | `item.scannedAt` |
| CO₂ offset | `item.co2Offset` | `item.co2Offset` |

#### Tab "Riwayat Obrolan" (Chat History)

Menampilkan semua sesi chat:

| Kolom | Mode MySQL | Mode localStorage |
|---|---|---|
| Judul sesi | `session.title` | `session.title` |
| Tanggal | `session.updatedAt` | `session.updatedAt` |
| Aksi | "Lanjutkan Percakapan" | "Lanjutkan Percakapan" |

**Tombol "Lanjutkan Percakapan"** mengarahkan ke `/assistant?session=<id>`, yang memuat ulang semua pesan historis dari sesi tersebut di kedua mode.

---

## Data Fetching

| Mode | Cara Ambil Data |
|---|---|
| **MySQL** | `GET /api/stats`, `GET /api/history`, `GET /api/chat/sessions` (memerlukan cookie JWT) |
| **localStorage** | `getStats()`, `getScanHistory()`, `getChatSessions()` dari `src/lib/clientStorage.ts` (langsung di browser) |

---

## Navbar

Di mode `localstorage`, Navbar menyembunyikan link Login/Register dan menampilkan tombol Dashboard secara langsung (baik di desktop maupun mobile).
