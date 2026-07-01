# EcoVision AI 🌍🤖

EcoVision AI adalah aplikasi web berbasis Artificial Intelligence yang membantu masyarakat memilah sampah dengan benar melalui analisis gambar secara real-time, memberikan edukasi lingkungan, rekomendasi daur ulang, dan pelacakan dampak CO₂.

> Dikembangkan untuk **Ekshibisi Kecerdasan Artifisial (AI) pada LKS Nasional 2026**.

---

## 🚀 Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **AI Waste Scanner** | Upload foto sampah → teridentifikasi secara instan oleh Gemini 2.5 Flash |
| **AI Eco-Assistant** | Chatbot berbasis Gemini dengan dukungan analisis gambar dan riwayat percakapan |
| **Model Testing Dashboard** | Upload dataset foto + label target → validasi akurasi model secara batch |
| **Scan History** | Riwayat semua scan tersimpan (MySQL atau browser localStorage) |
| **Chat History** | Riwayat percakapan tersimpan per sesi, dapat dilanjutkan kapan saja |
| **Knowledge Engine** | Basis data edukasi lokal untuk 9 kategori sampah |
| **Environmental Impact** | Estimasi CO₂ offset dari setiap scan |
| **Dual Storage Mode** | Pilih antara MySQL (dengan auth) atau localStorage (Guest Mode tanpa login) |
| **Authentication** | Sistem login/register berbasis JWT + MySQL (mode MySQL) |
| **Bilingual UI** | Antarmuka Bahasa Indonesia & English |
| **Dark Mode** | Tema gelap/terang dengan transisi halus |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS + custom CSS animations
- **AI Model**: Google Gemini 2.5 Flash via `@google/genai`
- **Database**: MySQL 8+ via `mysql2` (opsional — hanya mode MySQL)
- **Auth**: JWT tokens dalam HTTP-only cookies (hanya mode MySQL)
- **Runtime**: Node.js 18+

---

## 📋 Prasyarat

1. **Node.js** ≥ 18 — [nodejs.org](https://nodejs.org/)
2. **Google Gemini API Key** — [aistudio.google.com](https://aistudio.google.com/)
3. **MySQL 8+** *(hanya diperlukan untuk mode MySQL)*

---

## 💻 Setup & Menjalankan

### 1. Install dependensi
```bash
npm install
```

### 2. Konfigurasi environment
```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# Linux / macOS
cp .env.example .env.local
```

Edit `.env.local` dan isi nilai-nilainya (lihat [docs/environment.md](docs/environment.md)).

### 3. Pilih mode penyimpanan

**Mode MySQL** (data tersimpan di database, membutuhkan login):
```env
NEXT_PUBLIC_DB_STORAGE=mysql
```
Jalankan migrasi database:
```bash
npm run db:migrate
```

**Mode localStorage / Guest** (tidak perlu MySQL atau login):
```env
NEXT_PUBLIC_DB_STORAGE=localstorage
```

### 4. Jalankan development server
```bash
npm run dev
```

Buka: 👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🗄️ Mode Penyimpanan

| | Mode MySQL | Mode localStorage |
|---|---|---|
| **Login diperlukan** | ✅ Ya | ❌ Tidak (Guest) |
| **Penyimpanan data** | MySQL server | Browser localStorage |
| **Sinkronisasi antar perangkat** | ✅ Ya | ❌ Tidak |
| **Butuh MySQL** | ✅ Ya | ❌ Tidak |
| **Cocok untuk** | Produksi, pengembangan | Demo, offline, presentasi |

---

## 📁 Struktur Folder

```
ecovision-ai/
├── database/migrations/     # TypeScript migration files (mode MySQL)
├── docs/                    # Dokumentasi lengkap per fitur
│   ├── environment.md       # Panduan konfigurasi .env
│   ├── api.md               # Dokumentasi semua API endpoint
│   ├── ai-engine.md         # Arsitektur AI & provider system
│   ├── database.md          # Skema database MySQL & mode localStorage
│   ├── authentication.md    # Sistem login/register/JWT
│   ├── scanner.md           # Fitur AI Waste Scanner
│   ├── assistant.md         # Fitur AI Eco-Assistant & chat history
│   ├── testing.md           # Fitur Model Testing Dashboard
│   ├── dashboard.md         # Fitur Dashboard & riwayat pengguna
│   ├── knowledge-engine.md  # Knowledge Engine & data sampah
│   └── architecture.md      # Arsitektur sistem & data flow
├── scripts/                 # Script migrasi & utilitas
├── src/
│   ├── app/                 # Next.js App Router (halaman + API routes)
│   ├── components/          # Komponen UI modular
│   ├── data/                # Basis data pengetahuan lokal
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   ├── apiKey.ts        # Helper API key (client-side)
│   │   ├── clientStorage.ts # Helper localStorage (Guest Mode)
│   │   ├── db.ts            # Helper MySQL queries
│   │   ├── knowledge.ts     # Query Knowledge Engine
│   │   └── labelMapper.ts   # Fuzzy label mapper
│   ├── services/ai/         # AI provider layer (Factory Pattern)
│   └── types/               # TypeScript type definitions
└── .env.example             # Template konfigurasi environment
```

---

## 📚 Dokumentasi Lengkap

Seluruh dokumentasi fitur tersedia di folder [`docs/`](docs/):

- [Environment Variables](docs/environment.md)
- [API Endpoints](docs/api.md)
- [AI Engine & Providers](docs/ai-engine.md)
- [Database & Penyimpanan](docs/database.md)
- [Authentication](docs/authentication.md)
- [AI Waste Scanner](docs/scanner.md)
- [AI Eco-Assistant](docs/assistant.md)
- [Model Testing Dashboard](docs/testing.md)
- [Dashboard & History](docs/dashboard.md)
- [Knowledge Engine](docs/knowledge-engine.md)
- [Architecture Overview](docs/architecture.md)

---

## 💡 Tips Diagnostik

Jika terjadi masalah koneksi Gemini API (error 403/PERMISSION_DENIED):
```bash
node test-gemini.mjs
```
Script ini membaca `.env.local` dan melaporkan status koneksi API secara rinci.
