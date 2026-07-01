# Knowledge Engine

Dokumentasi untuk sistem basis data pengetahuan lokal yang digunakan EcoVision AI untuk memberikan informasi edukasi tentang sampah.

---

## Gambaran Umum

Knowledge Engine adalah modul offline yang memetakan hasil klasifikasi AI ke informasi edukasi lengkap tentang setiap jenis sampah. Seluruh data disimpan secara lokal dalam TypeScript (tanpa perlu database eksternal), memastikan informasi selalu tersedia bahkan tanpa koneksi internet.

---

## Komponen

### Data Store
**File:** `src/data/wasteKnowledge.ts`

Array statis berisi 9 entri (satu per kategori sampah), masing-masing dengan field bilingual (EN + ID).

### Query Helper
**File:** `src/lib/knowledge.ts`

Fungsi `getWasteKnowledge(id, lang)` yang mengambil dan memformat data untuk satu kategori:

```typescript
getWasteKnowledge(wasteId: string, lang: "en" | "id"): WasteItem | null
```

### Label Mapper
**File:** `src/lib/labelMapper.ts`

Fungsi `normalizeLabel(rawLabel)` yang memetakan output bebas dari AI (misalnya `"PET plastic bottle"`, `"Botol plastik"`) ke ID kategori standar menggunakan fuzzy matching.

---

## Kategori Sampah

### 1. `plastic-pet` — Plastik PET
- **Contoh**: Botol air mineral, botol minuman ringan
- **Dapat didaur ulang**: Ya
- **CO₂ offset**: ~0.3 kg per item
- **Waktu dekomposisi**: 450 tahun

### 2. `plastic-hdpe` — Plastik HDPE
- **Contoh**: Jerigen, galon, botol detergen
- **Dapat didaur ulang**: Ya
- **CO₂ offset**: ~0.5 kg per item
- **Waktu dekomposisi**: 400+ tahun

### 3. `paper` — Kertas
- **Contoh**: Koran, kertas HVS, majalah
- **Dapat didaur ulang**: Ya (jika bersih)
- **CO₂ offset**: ~0.1 kg per item
- **Waktu dekomposisi**: 2–6 minggu

### 4. `cardboard` — Karton/Kardus
- **Contoh**: Kotak belanja, kardus pengiriman
- **Dapat didaur ulang**: Ya
- **CO₂ offset**: ~0.2 kg per item
- **Waktu dekomposisi**: 2 bulan

### 5. `glass` — Kaca
- **Contoh**: Botol kaca, stoples, gelas pecah
- **Dapat didaur ulang**: Ya (100%)
- **CO₂ offset**: ~0.3 kg per item
- **Waktu dekomposisi**: 1 juta tahun

### 6. `metal-can` — Kaleng Logam
- **Contoh**: Kaleng minuman, kaleng makanan
- **Dapat didaur ulang**: Ya
- **CO₂ offset**: ~0.8 kg per item
- **Waktu dekomposisi**: 80–200 tahun

### 7. `organic` — Sampah Organik
- **Contoh**: Sisa makanan, sayuran, buah
- **Dapat didaur ulang**: Melalui composting
- **CO₂ offset**: ~0.05 kg per item
- **Waktu dekomposisi**: 2–4 minggu

### 8. `battery` — Baterai
- **Contoh**: Baterai AA, baterai lithium, aki
- **Dapat didaur ulang**: Harus ke fasilitas khusus (B3)
- **CO₂ offset**: ~0.1 kg per item
- **Waktu dekomposisi**: 100 tahun

### 9. `electronic` — Elektronik (E-Waste)
- **Contoh**: Ponsel bekas, kabel, komputer
- **Dapat didaur ulang**: Harus ke fasilitas e-waste resmi
- **CO₂ offset**: ~2.0 kg per item
- **Waktu dekomposisi**: Ratusan tahun (material beragam)

---

## Struktur Data

Setiap entri di `wasteKnowledge.ts` memiliki field:

```typescript
{
  id: string;                    // ID unik (misalnya "plastic-pet")
  nameEn: string;                // Nama dalam Bahasa Inggris
  nameId: string;                // Nama dalam Bahasa Indonesia
  category: string;              // Kategori umum ("plastic", "paper", dll)
  descriptionEn: string;        // Deskripsi Bahasa Inggris
  descriptionId: string;        // Deskripsi Bahasa Indonesia
  disposalStepsEn: string[];    // Langkah pembuangan (EN)
  disposalStepsId: string[];    // Langkah pembuangan (ID)
  recyclingTipsEn: string[];    // Tips daur ulang (EN)
  recyclingTipsId: string[];    // Tips daur ulang (ID)
  co2Offset: number;             // Estimasi CO₂ offset (kg)
  decompositionTime: string;     // Waktu dekomposisi
  recyclable: boolean;           // Dapat didaur ulang standar
  confidenceNoteEn: string;     // Konteks confidence score (EN)
  confidenceNoteId: string;     // Konteks confidence score (ID)
}
```

---

## Label Mapper (Fuzzy Matching)

`normalizeLabel()` menggunakan pendekatan multi-layer:
1. **Exact match**: Cek apakah label sudah merupakan ID valid
2. **Keyword mapping**: Daftar kata kunci per kategori (misalnya `"bottle"` → `plastic-pet`)
3. **Partial match**: Pencocokan substring case-insensitive
4. **Fallback**: Kembalikan `"organic"` jika tidak ada kecocokan

Ini memungkinkan Gemini mengembalikan teks bebas seperti `"aluminum can"` atau `"kaleng aluminium"` dan tetap dipetakan ke `metal-can` dengan benar.
