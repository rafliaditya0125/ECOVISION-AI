# AI Eco-Assistant & Chat History

Dokumentasi untuk fitur chatbot AI berbasis Gemini di halaman `/assistant`, termasuk dukungan upload gambar, penyimpanan riwayat, dan fitur lanjut percakapan.

---

## Gambaran Umum

AI Eco-Assistant adalah chatbot interaktif yang membantu pengguna mempelajari cara memilah sampah, mengurangi jejak karbon, dan menerapkan kebiasaan ramah lingkungan. Chatbot ini didukung oleh Gemini 2.5 Flash dengan system prompt khusus eco-education.

**Kemampuan utama:**
- Jawab pertanyaan tentang sampah, daur ulang, dan lingkungan
- Analisis gambar yang diupload langsung di chat (multimodal)
- Render Markdown pada respons AI (bold, list, heading)
- Simpan seluruh percakapan ke database jika user login
- Lanjutkan percakapan sebelumnya dari halaman Dashboard

---

## Halaman & Komponen

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

Respons Gemini sering mengandung format Markdown (`**bold**`, `# Heading`, `- list`). Fungsi `renderMarkdown()` di `page.tsx` mengurai dan mengonversinya ke HTML:

| Sintaks Markdown | Output HTML |
|---|---|
| `**teks**` | `<strong>teks</strong>` |
| `# Heading` | `<h3>` |
| `## Heading` | `<h4>` |
| `- item` | `<li>` dalam `<ul>` |
| `\n\n` | `<br>` (spasi antar paragraf) |

### Upload Gambar di Chat

Pengguna dapat melampirkan gambar ke pesan. Alurnya:
1. User klik ikon 📎 → pilih file gambar
2. Thumbnail tampil di area input
3. Saat dikirim: gambar dikonversi ke base64 dan disertakan dalam payload ke `/api/chat`
4. Gemini menganalisis gambar bersama teks pertanyaan

### Persistensi Percakapan

Jika user sedang login:
1. Setiap pasangan pesan (user + assistant) disimpan ke tabel `chat_messages` via `saveChatMessage()`
2. Sesi baru otomatis dibuat saat pesan pertama dikirim, dengan judul = 50 karakter pertama dari pesan user
3. `session_id` dikembalikan oleh API dan disimpan di state React `currentSessionId`
4. URL browser diperbarui ke `/assistant?session=<id>` menggunakan `window.history.pushState()` (tanpa full reload)

### Lanjut Percakapan (Resume)

Dari halaman Dashboard, user dapat klik **"Lanjutkan Percakapan"** pada sesi chat sebelumnya:
1. Link mengarah ke `/assistant?session=<sessionId>`
2. Saat halaman dimuat, `useEffect` membaca query parameter `?session=`
3. Request `GET /api/chat/sessions?id=<sessionId>` mengambil semua pesan historis
4. Pesan ditampilkan di UI seolah-olah percakapan baru saja dimulai
5. User dapat melanjutkan dari titik percakapan terakhir

---

## State Management

| State | Tipe | Deskripsi |
|---|---|---|
| `messages` | `Message[]` | Array seluruh pesan dalam sesi |
| `input` | `string` | Teks input yang sedang diketik |
| `isLoading` | `boolean` | Menunggu respons Gemini |
| `errorMsg` | `string \| null` | Pesan error |
| `currentSessionId` | `string \| null` | ID sesi yang aktif |
| `attachedImage` | `File \| null` | Gambar yang dilampirkan ke pesan berikutnya |

---

## System Prompt

Gemini dikonfigurasi dengan system prompt yang menekankan peran sebagai konsultan lingkungan:

> "You are EcoVision AI, a friendly and knowledgeable eco-assistant. Help users understand waste sorting, recycling methods, and environmental impact. Always provide actionable advice and educational information about sustainability. Respond in the same language as the user."

---

## API yang Digunakan

| Endpoint | Metode | Kapan |
|---|---|---|
| `POST /api/chat` | Setiap kirim pesan | Mendapat respons AI + simpan ke DB |
| `GET /api/chat/sessions?id=` | Saat load sesi lama | Muat riwayat percakapan |
