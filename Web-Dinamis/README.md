# 📚 Perpustakaan Digital - Sistem Manajemen Perpustakaan Dinamis

Website perpustakaan modern dengan fitur CRUD lengkap, dashboard user dan admin, sistem peminjaman dan pengembalian buku, serta upload gambar.

## ✨ Fitur Utama

### 🔐 Autentikasi
- Login user dan admin
- Registrasi akun baru
- Session management dengan localStorage
- Role-based access control

### 📖 Manajemen Buku (Admin)
- ✅ CREATE - Tambah buku baru
- ✅ READ - Lihat daftar dan detail buku
- ✅ UPDATE - Edit informasi buku
- ✅ DELETE - Hapus buku dari katalog
- Kategori buku yang fleksibel
- Tracking stok buku otomatis

### 👤 Dashboard User
- Lihat peminjaman aktif
- Riwayat pengembalian buku
- Status peminjaman real-time
- Peringatan keterlambatan otomatis

### 📚 Sistem Peminjaman
- Peminjaman buku dengan durasi flexible (3, 7, 14, 30 hari)
- Tracking target pengembalian
- Otomatis mengurangi stok
- Notifikasi keterlambatan

### 🔄 Sistem Pengembalian
- Laporan kondisi buku saat dikembalikan
- Perhitungan denda otomatis (Rp 5.000/hari)
- Biaya kerusakan buku
- Catatan pengembalian

### 🎨 UI/UX Modern
- Desain responsif dengan Tailwind CSS
- Gradient dan animasi halus
- Ikon yang intuitif (React Icons)
- Dark mode ready

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **HTTP Client**: Axios
- **Icons**: React Icons
- **State Management**: React Hooks, localStorage

## 📦 Dependencies

```json
{
  "react": "^18",
  "react-dom": "^18",
  "next": "^14",
  "axios": "^1.6.0",
  "js-cookie": "^3.0.5",
  "react-icons": "^4.12.0"
}
```

## 🚀 Instalasi & Menjalankan

### 1. Install Dependencies
```bash
npm install
```

### 2. Jalankan Development Server
```bash
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

### 3. Build untuk Production
```bash
npm run build
npm start
```

## 📝 Struktur Folder

```
web-dinamis/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # Authentication (login, register)
│   │   ├── books/             # CRUD Buku
│   │   ├── peminjaman/        # Borrowing API
│   │   ├── pengembalian/      # Return API
│   │   └── upload/            # Image upload
│   ├── components/            # React Components
│   │   ├── ClientWrapper.tsx
│   │   └── Navbar.tsx
│   ├── dashboard/             # Dashboard pages
│   │   ├── admin/            # Admin dashboard
│   │   └── user/             # User dashboard
│   ├── katalog/              # Book catalog
│   ├── login/                # Login page
│   ├── register/             # Register page
│   ├── lib/                  # Utilities
│   │   ├── auth.ts          # Auth functions
│   │   ├── mockData.ts      # Mock database
│   │   └── types.ts         # TypeScript types
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── public/
│   └── uploads/             # Uploaded images
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 👥 Demo Akun

### Admin
- **Email**: `admin@perpus.com`
- **Password**: `admin123`

### User
- **Email**: `budi@example.com`
- **Password**: `user123`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register akun baru

### Books (CRUD)
- `GET /api/books` - Ambil semua buku
- `GET /api/books/[id]` - Ambil detail buku
- `POST /api/books` - Tambah buku baru
- `PUT /api/books/[id]` - Update buku
- `DELETE /api/books/[id]` - Hapus buku

### Peminjaman
- `GET /api/peminjaman?userId=X` - Ambil peminjaman user
- `POST /api/peminjaman` - Buat peminjaman baru

### Pengembalian
- `GET /api/pengembalian` - Ambil riwayat pengembalian
- `POST /api/pengembalian` - Proses pengembalian buku

### Upload
- `POST /api/upload` - Upload gambar buku

## 🎯 Halaman-Halaman

### Public Pages
- `/` - Beranda
- `/login` - Login page
- `/register` - Register page
- `/katalog` - Katalog buku
- `/katalog/[id]` - Detail buku & peminjaman

### User Pages (Protected)
- `/dashboard/user` - Dashboard user
- `/dashboard/user/pengembalian/[id]` - Form pengembalian buku

### Admin Pages (Protected)
- `/dashboard/admin` - Admin dashboard (CRUD buku)

## 💡 Fitur Unggulan

### Sistem Poin Denda
- Denda Rp 5.000 per hari keterlambatan
- Otomatis dihitung saat pengembalian
- Opsi biaya kerusakan tambahan

### Tracking Stok Otomatis
- Stok berkurang saat peminjaman
- Stok bertambah saat pengembalian
- Real-time availability check

### Responsif Design
- Mobile-first approach
- Bekerja sempurna di semua ukuran layar
- Touch-friendly interface

## 🔒 Keamanan

- Password disimpan (⚠️ production harus di-hash dengan bcrypt)
- Token-based authentication
- Role-based access control
- Input validation pada semua form

## 📝 Catatan Penting

1. **Database**: Saat ini menggunakan mock data di memory. Untuk production, hubungkan ke database nyata (MongoDB, PostgreSQL, MySQL, dll)

2. **Password**: Password saat ini disimpan plaintext. Gunakan `bcryptjs` untuk hash di production

3. **Token**: Gunakan JWT yang proper di production, bukan base64 sederhana

4. **Upload**: Gambar disimpan di `/public/uploads`. Untuk production, gunakan cloud storage (AWS S3, Firebase, etc)

5. **Environment Variables**: Buat file `.env.local` untuk configuration

## 🚀 Next Steps untuk Production

```bash
# 1. Setup database
# 2. Implement proper JWT
# 3. Setup environment variables
# 4. Add password hashing with bcryptjs
# 5. Setup cloud storage untuk upload
# 6. Add comprehensive error handling
# 7. Setup logging dan monitoring
# 8. Add rate limiting
# 9. Setup CORS properly
# 10. Add comprehensive tests
```

## 📞 Support

Untuk pertanyaan atau issues, silakan buat issue di repository ini.

## 📄 Lisensi

MIT License - Bebas untuk digunakan dan dimodifikasi

---

**Dibuat dengan ❤️ untuk sistem manajemen perpustakaan modern**
