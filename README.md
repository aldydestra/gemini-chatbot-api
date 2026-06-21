# Gemini AI Chatbot - IT Department Assistant

Final Project **Maju Bareng AI** yang diselenggarakan oleh **Hacktiv8**.

Project ini adalah aplikasi chatbot berbasis web yang menggunakan **Google Gemini AI** sebagai asisten untuk kebutuhan **IT Department**, khususnya untuk membantu topik seputar **Programmer**, **Data Analyst**, dan **IT Support**.

Aplikasi ini terdiri dari frontend sederhana berbasis HTML, CSS, dan JavaScript, serta backend menggunakan Node.js dan Express untuk menghubungkan aplikasi dengan Google Gemini API.

---

## Deskripsi Project

**Gemini AI Chatbot - IT Department Assistant** dibuat untuk membantu pengguna bertanya seputar kebutuhan teknis di lingkungan IT, seperti:

- Review bug atau logic error pada kode.
- Analisis data, formula, query, atau insight.
- Troubleshooting aplikasi, jaringan, device, dan kebutuhan user support.
- Dokumentasi teknis dan dukungan operasional IT.

Chatbot ini menggunakan instruksi sistem agar jawaban tetap fokus pada konteks **IT Department** dan tidak menjawab pertanyaan di luar ruang lingkup tersebut.

---

## Fitur Utama

- Chat interface modern dan responsif.
- Integrasi dengan Google Gemini AI.
- Backend API menggunakan Express.js.
- Penyimpanan conversation history di sisi frontend selama sesi berjalan.
- Prompt cepat untuk kategori:
  - Programmer
  - Data Analyst
  - IT Support
- Loading state saat AI sedang memproses jawaban.
- Tombol reset untuk menghapus percakapan.
- Auto-resize textarea.
- Character counter.
- Error handling jika server atau API gagal merespons.

---

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- CORS
- dotenv
- Google GenAI SDK
- Gemini 2.5 Flash

---

## Struktur Folder

Struktur folder yang direkomendasikan:

```bash
gemini-ai-chatbot/
│
├── index.js
├── package.json
├── .env
├── .env.example
├── .gitignore
│
└── public/
    ├── index.html
    ├── style.css
    └── script.js
```

> Catatan: file `index.html`, `style.css`, dan `script.js` sebaiknya berada di dalam folder `public`, karena backend Express menggunakan konfigurasi `express.static(path.join(__dirname, 'public'))`.

---

## Instalasi dan Menjalankan Project

### 1. Clone repository

```bash
git clone https://github.com/username/nama-repository.git
cd nama-repository
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat file `.env`

Buat file `.env` di root project, lalu isi dengan API key Gemini:

```env
GEMINI_API_KEY=masukkan_api_key_gemini_anda_di_sini
```

### 4. Jalankan server

```bash
node index.js
```

Server akan berjalan di:

```bash
http://localhost:3000
```

---

## Environment Variable

Project ini membutuhkan API key dari Google Gemini.

Gunakan file `.env` untuk menyimpan API key secara lokal.

Contoh isi file `.env.example`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## Contoh `package.json`

Jika belum memiliki file `package.json`, gunakan contoh berikut:

```json
{
  "name": "gemini-ai-chatbot-it-department",
  "version": "1.0.0",
  "description": "Final Project Maju Bareng AI Hacktiv8 - Gemini AI Chatbot for IT Department",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@google/genai": "^1.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.0"
  }
}
```

Setelah itu, server dapat dijalankan dengan:

```bash
npm start
```

---

## Alur Kerja Aplikasi

1. Pengguna menulis pertanyaan pada chat interface.
2. Frontend menyimpan pesan pengguna ke dalam `conversationHistory`.
3. Frontend mengirim data percakapan ke backend melalui endpoint:

```http
POST /api/chat
```

4. Backend menerima conversation, mengubahnya ke format `contents`, lalu mengirim request ke Google Gemini API.
5. Gemini AI menghasilkan jawaban berdasarkan instruksi sistem.
6. Backend mengirim hasil jawaban ke frontend.
7. Frontend menampilkan jawaban AI di chat box.

---

## System Instruction

Chatbot diarahkan agar berperan sebagai asisten IT Department.

Ruang lingkup bantuan meliputi:

- Programmer
- Data Analyst
- IT Support
- Troubleshooting teknis
- Dokumentasi teknis
- Dukungan operasional IT

Chatbot tidak diarahkan untuk menjawab pertanyaan di luar konteks IT Department.

---

## Tampilan Aplikasi

Aplikasi memiliki tampilan chat modern dengan:

- Header aplikasi
- Status online
- Empty state / welcome panel
- Prompt chips
- Bubble chat user dan AI
- Tombol reset
- Input chat responsif
- Desain mobile responsive

---

## Endpoint API

### `POST /api/chat`

Endpoint untuk mengirim conversation dari frontend ke Gemini API.

#### Request Body

```json
{
  "conversation": [
    {
      "role": "user",
      "text": "Bantu saya review bug pada kode berikut"
    }
  ]
}
```

#### Success Response

```json
{
  "result": "Jawaban dari Gemini AI"
}
```

#### Error Response

```json
{
  "error": "Pesan error"
}
```

## Status

Repository ini adalah Final Project yang dibuat sebagai bagian dari program **Maju Bareng AI** yang diselenggarakan oleh **Hacktiv8**.

---

## License

Project ini dibuat untuk kebutuhan pembelajaran dan final project.
