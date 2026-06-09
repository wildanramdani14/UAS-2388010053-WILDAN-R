// Type definitions for the Library Management System

export interface User {
  id: string
  nama: string
  email: string
  password: string
  role: "user" | "admin"
  noAnggota?: string
  nomorTelepon?: string
  alamat?: string
  createdAt: string
}

export interface Book {
  id: string
  judul: string
  pengarang: string
  penerbit: string
  tahunTerbit: number
  isbn: string
  kategori: string
  stok: number
  stokTersedia: number
  deskripsi: string
  gambar: string
  createdAt: string
  updatedAt: string
}

export interface Peminjaman {
  id: string
  userId: string
  bookId: string
  tanggalPinjam: string
  tanggalKembaliTarget: string
  tanggalKembaliAktual?: string
  status: "aktif" | "terlambat" | "dikembalikan"
  denda?: number
  createdAt: string
}

export interface Pengembalian {
  id: string
  peminjamanId: string
  tanggalKembali: string
  statusBuku: "baik" | "rusak_ringan" | "rusak_berat"
  biayaKerusakan?: number
  catatan?: string
  createdAt: string
}
