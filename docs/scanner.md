# AI Waste Scanner

Dokumentasi untuk fitur pemindaian sampah berbasis AI di halaman `/scan`.

---

## Gambaran Umum

Fitur ini adalah inti dari aplikasi EcoVision AI. Pengguna mengunggah atau mendrag-and-drop foto sampah, kemudian sistem mengklasifikasikannya menggunakan Google Gemini 2.5 Flash dan menampilkan hasilnya di halaman `/result`.

---

## Halaman & Komponen

| File | Peran |
|---|---|
| `src/app/scan/page.tsx` | Halaman utama scanner |
| `src/components/UploadZone.tsx` | Area drag-and-drop upload gambar |
| `src/components/ImagePreview.tsx` | Pratinjau gambar yang dipilih |
| `src/components/LoadingOverlay.tsx` | Overlay animasi saat analisis berlangsung |
| `src/app/result/page.tsx` | Halaman tampil hasil analisis |
| `src/components/ResultCard.tsx` | Kartu detail hasil klasifikasi |

---

## Alur Pengguna

```
1. User buka /scan
2. Drag-and-drop atau klik untuk memilih gambar (JPEG/PNG, maks 10MB)
3. ImagePreview menampilkan gambar yang dipilih
4. User klik "Analyze" / "Analisis"
5. LoadingOverlay tampil
6. Request POST /api/analyze dengan gambar + x-api-key header
7. Server klasifikasi via Gemini → return { id, confidence }
8. Redirect ke /result?id=plastic-pet&confidence=94
9. Result page query Knowledge Engine → tampil info lengkap
```

---

## Validasi Gambar

Validasi dilakukan di dua level:

**Client-side (UploadZone):**
- Hanya file `image/jpeg` dan `image/png` yang diterima
- File lebih dari 10MB ditolak dengan pesan error

**Server-side (API route):**
- Cek `image.type.startsWith("image/")`
- Cek `image.size > 10 * 1024 * 1024`

---

## Hasil Analisis (`/result`)

Halaman result membaca query parameter `?id=` dan `?confidence=`, lalu memanggil `getWasteKnowledge(id, lang)` untuk mendapatkan informasi lengkap.

**Informasi yang ditampilkan:**
- Nama & kategori sampah
- Confidence score dengan color-coded badge
- Deskripsi material & cara pembuangan
- Langkah-langkah daur ulang yang actionable
- Estimasi CO₂ offset jika didaur ulang
- Waktu dekomposisi di alam
- Confidence note (konteks mengapa skor tinggi/rendah)
- Peringatan jika confidence < 80%

---

## Persistensi Riwayat

Jika user sedang login (cookie JWT valid), hasil scan secara otomatis disimpan ke tabel `scan_history` di database MySQL via `/api/history` POST request yang dilakukan dari halaman result.

---

## State Management

`src/app/scan/page.tsx` menggunakan state lokal React:

| State | Tipe | Deskripsi |
|---|---|---|
| `selectedFile` | `File \| null` | File gambar yang dipilih |
| `previewUrl` | `string \| null` | Object URL untuk preview |
| `isAnalyzing` | `boolean` | Proses analisis berlangsung |
| `errorMessage` | `string \| null` | Pesan error jika gagal |
