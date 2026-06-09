CREATE DATABASE IF NOT EXISTS perpustakaan;
USE perpustakaan;

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    noAnggota VARCHAR(50),
    nomorTelepon VARCHAR(50),
    alamat TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Books table
CREATE TABLE IF NOT EXISTS books (
    id VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    pengarang VARCHAR(255) NOT NULL,
    penerbit VARCHAR(255),
    tahunTerbit INT,
    isbn VARCHAR(50) NOT NULL,
    kategori VARCHAR(100),
    stok INT NOT NULL DEFAULT 1,
    stokTersedia INT NOT NULL DEFAULT 1,
    deskripsi TEXT,
    gambar VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Peminjaman table
CREATE TABLE IF NOT EXISTS peminjaman (
    id VARCHAR(50) PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    bookId VARCHAR(50) NOT NULL,
    tanggalPinjam DATETIME NOT NULL,
    tanggalKembaliTarget DATETIME NOT NULL,
    tanggalKembaliAktual DATETIME,
    status VARCHAR(50) NOT NULL DEFAULT 'aktif',
    denda INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE
);

-- Create Pengembalian table
CREATE TABLE IF NOT EXISTS pengembalian (
    id VARCHAR(50) PRIMARY KEY,
    peminjamanId VARCHAR(50) NOT NULL,
    tanggalKembali DATETIME NOT NULL,
    statusBuku VARCHAR(50) NOT NULL DEFAULT 'baik',
    biayaKerusakan INT DEFAULT 0,
    catatan TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (peminjamanId) REFERENCES peminjaman(id) ON DELETE CASCADE
);

-- Seed Initial Users (admin & user)
INSERT INTO users (id, nama, email, password, role, noAnggota, nomorTelepon, alamat, createdAt)
VALUES 
('admin1', 'Admin Perpustakaan', 'admin@perpus.com', 'admin123', 'admin', NULL, NULL, NULL, NOW()),
('user1', 'Budi Santoso', 'budi@example.com', 'user123', 'user', 'A001', '081234567890', 'Jl. Merdeka No. 123', NOW())
ON DUPLICATE KEY UPDATE id=id;

-- Seed Initial Books
INSERT INTO books (id, judul, pengarang, penerbit, tahunTerbit, isbn, kategori, stok, stokTersedia, deskripsi, gambar, createdAt, updatedAt)
VALUES
('book1', 'Pemrograman JavaScript', 'Kyle Simpson', 'O\'Reilly', 2023, '978-0134685991', 'Teknologi', 5, 3, 'Panduan lengkap untuk mempelajari JavaScript modern dengan best practices.', '/images/js-book.jpg', NOW(), NOW()),
('book2', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, '978-0132350884', 'Teknologi', 3, 2, 'Sebuah panduan untuk menulis kode yang indah dan mudah dipahami.', '/images/clean-code.jpg', NOW(), NOW()),
('book3', 'Filosofi Kehidupan', 'Socrates', 'Gramedia', 2020, '978-6020501234', 'Filsafat', 4, 4, 'Refleksi filosofis tentang makna kehidupan dan kebahagiaan.', '/images/philosophy.jpg', NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;
