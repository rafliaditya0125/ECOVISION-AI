# AI Engine & Provider System

Dokumentasi untuk sistem AI classification yang digunakan oleh EcoVision AI, termasuk arsitektur provider, alur request, dan cara kerja confidence score.

---

## Gambaran Umum

EcoVision AI menggunakan **Factory Pattern** untuk memisahkan logika pemilihan provider dari logika bisnis aplikasi. Sistem ini memungkinkan peralihan antara model AI nyata (Gemini) dan simulasi offline (Mock) hanya dengan mengubah satu environment variable.

```
Client Request
    │
    ├─ x-api-key header
    │
    ▼
API Route (analyze / chat)
    │
    ├─ req.headers.get("x-api-key")
    │
    ▼
ProviderManager.getProvider(apiKey?)
    │
    ├─ NEXT_PUBLIC_AI_PROVIDER=gemini → GeminiProvider(apiKey)
    └─ NEXT_PUBLIC_AI_PROVIDER=mock  → MockProvider()
```

---

## Komponen

### `AIProvider` Interface
**File:** `src/services/ai/provider.ts`

Interface dasar yang mendefinisikan kontrak untuk semua provider AI:
```typescript
interface AIProvider {
  analyze(image: File): Promise<AIResult>;
  chat(messages: Message[]): Promise<string>;
}
```

---

### `ProviderManager`
**File:** `src/services/ai/providerManager.ts`

Factory class yang memilih provider berdasarkan `NEXT_PUBLIC_AI_PROVIDER`:

```typescript
ProviderManager.getProvider(apiKey?: string): AIProvider
```

| Parameter | Deskripsi |
|---|---|
| `apiKey` | Opsional. API key yang diteruskan dari header HTTP `x-api-key`. Jika diisi, menimpa nilai dari environment variable server. |

---

### `GeminiProvider`
**File:** `src/services/ai/geminiProvider.ts`

Provider nyata yang berkomunikasi dengan Google Gemini 2.5 Flash.

**Konstruktor:**
```typescript
new GeminiProvider(headerApiKey?: string)
```

**Prioritas API Key:**
1. `headerApiKey` (dari request HTTP header `x-api-key`)
2. `process.env.GEMINI_API_KEY` (fallback server-side)
3. Error jika keduanya kosong

**Alur `analyze(image)`:**
1. Konversi `File` → base64 (`fileToBase64`)
2. Bangun payload multimodal (gambar + prompt teks)
3. Kirim ke Gemini via `generateContent()`
4. Parse respons JSON `{ detectedLabel, confidence }`
5. Validasi label terhadap daftar VALID_LABELS
6. Clamp confidence ke rentang 0–100

**System Prompt Klasifikasi:**
```
You are an image classification model.
Identify the main waste object in the image.
Return ONLY valid JSON. No markdown, no explanation, no code fences.

Example response:
{"detectedLabel":"plastic-pet","confidence":96}

Choose detectedLabel from ONLY these values:
plastic-pet, plastic-hdpe, paper, cardboard, glass, metal-can, organic, battery, electronic

If unsure, return the closest matching label.
```

**Label yang Valid:**
| Label | Kategori |
|---|---|
| `plastic-pet` | Plastik PET (botol air mineral, dll) |
| `plastic-hdpe` | Plastik HDPE (jerigen, dll) |
| `paper` | Kertas |
| `cardboard` | Karton/kardus |
| `glass` | Kaca |
| `metal-can` | Kaleng logam |
| `organic` | Sampah organik |
| `battery` | Baterai |
| `electronic` | Elektronik (e-waste) |

---

### `MockProvider`
**File:** `src/services/ai/mockProvider.ts`

Provider simulasi untuk pengembangan lokal atau demo offline.

- **`analyze()`**: Selalu mengembalikan `{ detectedLabel: "plastic-pet", confidence: 96 }`
- **`chat()`**: Mengembalikan respons teks statis berisi instruksi daur ulang umum
- Tidak membutuhkan API key atau koneksi internet

---

### `AIService`
**File:** `src/services/ai/aiService.ts`

Layer orkestrator yang menerima provider dan mengekspos method `analyze` dan `chat` ke API routes.

---

## Confidence Score

Confidence score adalah nilai integer antara `0` dan `100` yang menunjukkan seberapa yakin model AI terhadap klasifikasinya.

**Sumber nilai:**
- **GeminiProvider**: Nilai dihasilkan langsung oleh model Gemini dari analisis visual gambar. Fungsi `clampConfidence()` memastikan nilai tetap di rentang valid.
- **MockProvider**: Nilai konstan `96` (digunakan untuk testing/demo).

**Interpretasi:**
| Rentang | Interpretasi | UI |
|---|---|---|
| ≥ 80% | Tinggi — Hasil dapat diandalkan | Badge hijau |
| 60–79% | Sedang — Disarankan verifikasi | Badge kuning |
| < 60% | Rendah — Dianjurkan verifikasi manual | Banner peringatan merah |

---

## Alur API Key via HTTP Header

Sejak refactor, API key dikirim dari browser ke server melalui HTTP header `x-api-key` pada setiap request:

```
Browser (src/lib/apiKey.ts)
    │
    ├─ localStorage.getItem("gemini_api_key")  ← override manual
    │   └─ jika kosong:
    └─ process.env.NEXT_PUBLIC_GEMINI_API_KEY  ← .env.local
    │
    ▼
fetch("/api/analyze", { headers: { "x-api-key": key } })
    │
    ▼
Server (route.ts)
    │
    ├─ req.headers.get("x-api-key")
    └─ ProviderManager.getProvider(key)
           └─ GeminiProvider(key)
                  └─ new GoogleGenAI({ apiKey: key })
```

**Override runtime di browser console:**
```javascript
localStorage.setItem("gemini_api_key", "API_KEY_BARU_ANDA");
location.reload();
```
