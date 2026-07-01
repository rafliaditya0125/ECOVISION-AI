# AI Eco-Assistant & Chat History

Dokumentasi untuk fitur chatbot AI berbasis Gemini di halaman `/assistant`, termasuk dukungan upload gambar, penyimpanan riwayat, dan fitur lanjut percakapan.

---

## Gambaran Umum

AI Eco-Assistant adalah chatbot interaktif yang membantu pengguna mempelajari cara memilah sampah, mengurangi jejak karbon, dan menerapkan kebiasaan ramah lingkungan. Chatbot ini didukung oleh Gemini 2.5 Flash dengan system prompt khusus eco-education.

**Kemampuan utama:**
- Jawab pertanyaan tentang sampah, daur ulang, dan lingkungan
- Analisis gambar yang diupload langsung di chat (multimodal)
- Render Markdown pada respons AI (bold, list, heading)
- Simpan seluruh percakapan (MySQL mode: ke database; localStorage mode: ke browser)
- Lanjutkan percakapan sebelumnya dari halaman Dashboard

---

## Halaman

| File | Peran |
|---|---|
| `src/app/assistant/page.tsx` | Halaman utama chatbot |

---

## Fitur Detail

### Antarmuka Chat

- Input teks dengan tombol kirim
- Tombol lampiran foto (📎) untuk upload gambar ke chat
- Preview thumbnail gambar yang dilampirkan sebelum dikirim
- Respons AI dirender sebagai Markdown menggunakan parser custom

### Render Markdown

Respons Gemini sering mengandung format Markdown. Fungsi `parseMarkdown()` di `page.tsx` mengurai dan mengonversinya ke HTML:

| Sintaks Markdown | Output HTML |
|---|---|
| `**teks**` | `<strong>teks</strong>` |
| `# Heading` | `<h3>` |
| `## Heading` | `<h4>` |
| `- item` | `<li>` dalam `<ul>` |
| `\n\n` | `<br>` (spasi antar paragraf) |

### Upload Gambar di Chat

Pengguna dapat melampirkan gambar ke pesan:
1. Klik ikon 📎 → pilih file gambar
2. Thumbnail tampil di area input
3. Saat dikirim: gambar dikonversi ke base64 dan disertakan dalam payload ke `/api/chat`
4. Gemini menganalisis gambar bersama teks pertanyaan

---

## Persistensi Percakapan

| Mode | Cara Simpan | Cara Load |
|---|---|---|
| **MySQL** | API `/api/chat` menyimpan pesan ke database via `saveChatMessage()` | `GET /api/chat/sessions?id=<sessionId>` |
| **localStorage** | `saveChatMessage()` dari `src/lib/clientStorage.ts` disimpan di browser | `getChatMessages(sessionId)` dari clientStorage |

Di kedua mode:
- Sesi baru otomatis dibuat saat pesan pertama dikirim, dengan judul = 40 karakter pertama dari pesan user
- `session_id` disimpan di state React `currentSessionId`
- URL browser diperbarui ke `/assistant?session=<id>` menggunakan `window.history.pushState()` (tanpa full reload)

### Lanjut Percakapan (Resume)

Dari halaman Dashboard, klik **"Lanjutkan Percakapan"**:
1. Link mengarah ke `/assistant?session=<sessionId>`
2. Halaman membaca query parameter `?session=`
3. Di mode MySQL: `GET /api/chat/sessions?id=` mengambil pesan historis
4. Di mode localStorage: `getChatMessages(sessionId)` membaca dari browser
5. Pesan tampil di UI dan percakapan dapat dilanjutkan

---

## State Management

| State | Tipe | Deskripsi |
|---|---|---|
| `messages` | `Message[]` | Array seluruh pesan dalam sesi aktif |
| `input` | `string` | Teks input yang sedang diketik |
| `isLoading` | `boolean` | Menunggu respons Gemini |
| `errorMsg` | `string \| null` | Pesan error |
| `currentSessionId` | `string \| null` | ID sesi yang aktif |
| `attachedImage` | `string \| null` | Base64 gambar yang dilampirkan |

---

## System Prompt

Gemini dikonfigurasi dengan system prompt eco-consultant:

> "You are EcoVision AI, a friendly and knowledgeable eco-assistant. Help users understand waste sorting, recycling methods, and environmental impact. Always provide actionable advice and educational information about sustainability. Respond in the same language as the user."

---

## API yang Digunakan

| Endpoint | Mode | Kapan |
|---|---|---|
| `POST /api/chat` | Keduanya | Mendapat respons Gemini |
| `GET /api/chat/sessions?id=` | MySQL | Muat riwayat percakapan |
| `clientStorage.getChatMessages()` | localStorage | Muat riwayat percakapan |
| `clientStorage.saveChatMessage()` | localStorage | Simpan pesan setelah respons diterima |
