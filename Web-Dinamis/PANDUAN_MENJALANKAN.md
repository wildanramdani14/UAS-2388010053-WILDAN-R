# 🚀 PANDUAN CARA MENJALANKAN PROJECT PERPUSTAKAAN DIGITAL

## 📋 Daftar Isi
1. [Info Project](#info-project)
2. [Cara Menjalankan](#cara-menjalankan)
3. [Demo Akun](#demo-akun)
4. [Fitur-Fitur](#fitur-fitur)
5. [Struktur Halaman](#struktur-halaman)
6. [API Documentation](#api-documentation)

---

## 📌 Info Project

**Nama**: Perpustakaan Digital - Sistem Manajemen Perpustakaan Dinamis  
**Framework**: Next.js 14 dengan TypeScript  
**Styling**: Tailwind CSS  
**Status**: ✅ Siap Dijalankan

### Tech Stack
- Next.js 14.2.35
- React 18
- TypeScript 5
- Tailwind CSS 3.3.0
- Axios 1.6.0
- React Icons 4.12.0

---

## 🎬 Cara Menjalankan

### Persyaratan
- Node.js v16 atau lebih tinggi
- npm atau yarn

### Langkah 1: Buka Terminal
Buka PowerShell atau terminal dan navigasi ke folder project:

```powershell
cd "c:\Users\ACER\OneDrive\Documents\UAS_Administrasi Server\web-dinamis"
```

### Langkah 2: Jalankan Development Server

```powershell
npm run dev
```

**Output yang akan muncul:**
```
> web-dinamis@1.0.0 dev
> next dev

  ▲ Next.js 14.2.35

  ✓ Ready in 1.2s
  ✓ Local:        http://localhost:3000
```

### Langkah 3: Buka di Browser
Buka browser dan masuk ke: **http://localhost:3000**

### Langkah 4: Hentikan Server
Tekan **Ctrl + C** di terminal untuk menghentikan server

---

## 👥 Demo Akun

### Akun Admin
```
Email    : admin@perpus.com
Password : admin123
Role     : Admin (dapat mengelola buku)
```

### Akun User
```
Email    : budi@example.com
Password : user123
Role     : User (dapat meminjam dan mengembalikan buku)
```

### Cara Login
1. Klik tombol **"Login"** di halaman beranda
2. Masukkan email dan password dari salah satu akun di atas
3. Klik **"Masuk"**
4. Anda akan diarahkan ke dashboard sesuai role

---

## ✨ Fitur-Fitur

### 🔐 Autentikasi
- ✅ Login user dan admin
- ✅ Registrasi akun baru
- ✅ Session management
- ✅ Role-based access control

### 📚 CRUD Buku (Admin Only)
- ✅ **CREATE** - Tambah buku baru
- ✅ **READ** - Lihat daftar dan detail buku
- ✅ **UPDATE** - Edit informasi buku
- ✅ **DELETE** - Hapus buku

### 📖 Katalog Buku (Public)
- ✅ Cari buku berdasarkan judul atau pengarang
- ✅ Filter berdasarkan kategori
- ✅ Lihat detail buku
- ✅ Informasi ketersediaan stok

### 👤 Dashboard User
- ✅ Lihat peminjaman aktif
- ✅ Riwayat pengembalian
- ✅ Status peminjaman real-time
- ✅ Peringatan keterlambatan

### 📚 Sistem Peminjaman
- ✅ Pinjam buku dengan durasi fleksibel (3, 7, 14, 30 hari)
- ✅ Tracking target pengembalian
- ✅ Otomatis kurangi stok
- ✅ Validasi ketersediaan buku

### 🔄 Sistem Pengembalian
- ✅ Input kondisi buku saat dikembalikan
- ✅ Perhitungan denda otomatis (Rp 5.000/hari)
- ✅ Biaya kerusakan buku
- ✅ Catatan pengembalian
- ✅ Ringkasan biaya

---

## 🗺️ Struktur Halaman

### Halaman Publik (Tanpa Login)
```
/ (Beranda)
  ├── Tentang perpustakaan
  ├── Fitur unggulan
  ├── CTA untuk daftar
  └── Tombol login

/login (Halaman Login)
  ├── Form login email & password
  ├── Link ke halaman registrasi
  └── Demo credentials

/register (Halaman Registrasi)
  ├── Form nama, email, password
  └── Link ke halaman login

/katalog (Katalog Buku)
  ├── Search buku
  ├── Filter kategori
  └── Grid buku dengan kartu interaktif

/katalog/[id] (Detail Buku)
  ├── Informasi lengkap buku
  ├── Form peminjaman
  └── Durasi peminjaman
```

### Halaman User (Login sebagai User)
```
/dashboard/user (Dashboard User)
  ├── Peminjaman aktif
  ├── Riwayat pengembalian
  ├── Tombol kembalikan buku
  └── Tombol jelajahi buku

/dashboard/user/pengembalian/[id] (Pengembalian Buku)
  ├── Info buku yang dipinjam
  ├── Status kondisi buku
  ├── Input biaya kerusakan
  ├── Perhitungan denda otomatis
  └── Ringkasan biaya total
```

### Halaman Admin (Login sebagai Admin)
```
/dashboard/admin (Admin Dashboard)
  ├── Statistik (total buku, stok tersedia, kategori)
  ├── Form tambah buku
  ├── Tabel daftar buku
  ├── Tombol edit
  └── Tombol hapus
```

---

## 🔌 API Documentation

### Authentication
```
POST /api/auth/login
  - Input: { email, password }
  - Output: { token, user { id, nama, email, role } }

POST /api/auth/register
  - Input: { nama, email, password }
  - Output: { token, user { id, nama, email, role } }
```

### Buku (CRUD)
```
GET /api/books
  - Output: { data: [Book] }

GET /api/books/[id]
  - Output: { data: Book }

POST /api/books
  - Input: { judul, pengarang, isbn, ... }
  - Output: { data: Book (baru) }

PUT /api/books/[id]
  - Input: { judul, pengarang, ... }
  - Output: { data: Book (updated) }

DELETE /api/books/[id]
  - Output: { data: Book (deleted) }
```

### Peminjaman
```
GET /api/peminjaman?userId=[id]
  - Output: { data: [Peminjaman] }

POST /api/peminjaman
  - Input: { userId, bookId, durasi }
  - Output: { data: Peminjaman (baru) }
```

### Pengembalian
```
GET /api/pengembalian
  - Output: { data: [Pengembalian] }

POST /api/pengembalian
  - Input: { peminjamanId, statusBuku, biayaKerusakan, catatan }
  - Output: { data: { denda, biayaKerusakan, totalBiaya } }
```

---

## 🧑‍💻 Tips Penggunaan

### Untuk Admin
1. Masuk dengan akun admin
2. Klik "Admin Panel" di navbar
3. Lihat statistik buku
4. Klik "Tambah Buku Baru" untuk menambah buku
5. Isi form dengan detail buku
6. Klik "Tambah Buku" untuk menyimpan
7. Edit atau hapus buku dari tabel

### Untuk User
1. Masuk dengan akun user
2. Klik "Katalog" untuk melihat daftar buku
3. Cari atau filter buku sesuai kebutuhan
4. Klik buku untuk lihat detail
5. Pilih durasi peminjaman
6. Klik "Pinjam Sekarang"
7. Klik "Dashboard" untuk lihat peminjaman aktif
8. Klik "Kembalikan Buku" untuk mengembalikan
9. Pilih kondisi buku dan input biaya jika rusak
10. Klik "Kembalikan Buku" untuk konfirmasi

---

## 💾 Data & Penyimpanan

### Penyimpanan Data
- Semua data saat ini disimpan di memory (temporary)
- Data akan hilang saat server di-restart
- Untuk production, hubungkan ke database sejati

### Contoh Data yang Tersimpan
- User accounts (login credentials)
- Daftar buku (katalog)
- Peminjaman (history peminjaman)
- Pengembalian (history pengembalian)

---

## ⚠️ Catatan Penting

1. **Password**: Password saat ini plaintext. Untuk production, gunakan bcryptjs
2. **Token**: Gunakan JWT yang proper untuk authentication
3. **Database**: Setup database real (MongoDB, PostgreSQL, MySQL)
4. **Upload**: Gunakan cloud storage (AWS S3, Firebase) untuk gambar
5. **CORS**: Setup CORS secara proper untuk API calls
6. **Validation**: Tambahkan server-side validation

---

## 🐛 Troubleshooting

### Error: "Port 3000 already in use"
```powershell
# Gunakan port lain
npm run dev -- -p 3001
```

### Error: "Cannot find module 'react'"
```powershell
# Install dependencies
npm install
```

### Build error
```powershell
# Bersihkan cache
npm run build
```

---

## 📞 Bantuan

Untuk bantuan lebih lanjut:
1. Baca dokumentasi Next.js: https://nextjs.org/docs
2. Baca dokumentasi Tailwind CSS: https://tailwindcss.com
3. Baca README.md di folder project

---

**Dibuat dengan ❤️ untuk sistem manajemen perpustakaan modern**
