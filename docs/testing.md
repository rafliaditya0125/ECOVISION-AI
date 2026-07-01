# Model Testing Dashboard

Dokumentasi untuk fitur pengujian akurasi model AI secara batch di halaman `/testing`.

---

## Gambaran Umum

Model Testing Dashboard adalah alat internal untuk mengukur performa model klasifikasi Gemini secara kuantitatif. Pengguna mengupload kumpulan gambar sampah beserta label target (ground truth), lalu sistem menjalankan klasifikasi satu per satu dan menghitung metrik akurasi secara otomatis.

**Kasus penggunaan utama:**
- Validasi akurasi model sebelum presentasi atau demo
- Membandingkan performa `gemini` vs `mock` provider
- Mengidentifikasi kategori sampah mana yang sering salah diklasifikasi

---

## Halaman

| File | Peran |
|---|---|
| `src/app/testing/page.tsx` | Halaman utama dataset testing |

Akses: **Menu Navbar → "Model Testing" / "Pengujian Model"**

---

## Cara Penggunaan

### 1. Upload Gambar Dataset

Klik area upload atau tombol **"Pilih Dataset Gambar"** → pilih satu atau lebih file gambar (JPEG/PNG).

**Auto-parse label dari nama file:**

Sistem secara otomatis mendeteksi label target berdasarkan prefiks nama file:

| Nama File | Label Target Terdeteksi |
|---|---|
| `plastic-pet_botol_aqua.jpg` | `plastic-pet` |
| `organic_sisa_makanan.png` | `organic` |
| `glass_jar_selai.jpg` | `glass` |
| `foto_random.jpg` | `plastic-pet` *(default fallback)* |

Jika prefiks tidak terdeteksi, label default adalah `plastic-pet`. Pengguna dapat mengubah label melalui dropdown di setiap baris.

### 2. Review & Edit Label Target

Setiap gambar yang diupload ditampilkan dalam daftar dengan:
- Thumbnail preview
- Nama file & ukuran
- Dropdown selector label target (9 pilihan)
- Tombol hapus item (×)

### 3. Jalankan Validasi

Klik **"Jalankan Validasi Model"**. Sistem akan:
1. Memproses setiap gambar secara berurutan
2. Menampilkan status `Running` (animasi pulse) pada baris yang sedang diproses
3. Menunggu 300ms antara setiap request (rate limiting)
4. Menampilkan hasil prediksi + confidence score + badge Match/Mismatch

### 4. Baca Hasil

**Metrik Summary (card kiri):**
| Metrik | Deskripsi |
|---|---|
| Validation Accuracy | Persentase prediksi yang sesuai label target |
| Average Confidence | Rata-rata confidence score dari semua prediksi sukses |
| Success Count | Jumlah prediksi benar vs total yang diproses |

**Status per baris:**
| Badge | Arti |
|---|---|
| `Pending` | Belum diproses |
| `Running` (animasi) | Sedang dianalisis |
| `Match` (hijau) | Prediksi = label target |
| `Mismatch` (merah) | Prediksi ≠ label target |
| `Error` (merah) | Request gagal |

---

## Label yang Tersedia

| Label | Kategori Sampah |
|---|---|
| `plastic-pet` | Plastik PET (botol air mineral) |
| `plastic-hdpe` | Plastik HDPE (jerigen, galon) |
| `paper` | Kertas |
| `cardboard` | Karton / kardus |
| `glass` | Kaca |
| `metal-can` | Kaleng logam |
| `organic` | Sampah organik |
| `battery` | Baterai |
| `electronic` | Elektronik (e-waste) |

---

## Progress Indicator

Selama proses berjalan, progress bar menunjukkan persentase gambar yang sudah selesai:
```
Processing... [████████░░░░░░░░░░░░] 40%
```

Tombol "Jalankan Validasi" dan "Hapus Semua" dinonaktifkan selama proses berlangsung.

---

## Teknis

- Request ke `/api/analyze` dengan header `x-api-key` dari `getClientApiKey()`
- Delay 300ms antar request untuk menghindari rate limiting API
- `URL.createObjectURL()` digunakan untuk preview gambar (dibersihkan saat item dihapus)
- Metrik dihitung secara real-time dari state React `testItems`
