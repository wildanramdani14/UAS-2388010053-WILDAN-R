import { User, Book, Peminjaman, Pengembalian } from "./types"
import pool from "./db"

// Local fallback arrays for local development without DB
let localUsers: User[] = [
  {
    id: "admin1",
    nama: "Admin Perpustakaan",
    email: "admin@perpus.com",
    password: "admin123",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user1",
    nama: "Budi Santoso",
    email: "budi@example.com",
    password: "user123",
    role: "user",
    noAnggota: "A001",
    nomorTelepon: "081234567890",
    alamat: "Jl. Merdeka No. 123",
    createdAt: new Date().toISOString(),
  },
]

let localBooks: Book[] = [
  {
    id: "book1",
    judul: "Pemrograman JavaScript",
    pengarang: "Kyle Simpson",
    penerbit: "O'Reilly",
    tahunTerbit: 2023,
    isbn: "978-0134685991",
    kategori: "Teknologi",
    stok: 5,
    stokTersedia: 3,
    deskripsi: "Panduan lengkap untuk mempelajari JavaScript modern dengan best practices.",
    gambar: "/images/js-book.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "book2",
    judul: "Clean Code",
    pengarang: "Robert C. Martin",
    penerbit: "Prentice Hall",
    tahunTerbit: 2008,
    isbn: "978-0132350884",
    kategori: "Teknologi",
    stok: 3,
    stokTersedia: 2,
    deskripsi: "Sebuah panduan untuk menulis kode yang indah dan mudah dipahami.",
    gambar: "/images/clean-code.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "book3",
    judul: "Filosofi Kehidupan",
    pengarang: "Socrates",
    penerbit: "Gramedia",
    tahunTerbit: 2020,
    isbn: "978-6020501234",
    kategori: "Filsafat",
    stok: 4,
    stokTersedia: 4,
    deskripsi: "Refleksi filosofis tentang makna kehidupan dan kebahagiaan.",
    gambar: "/images/philosophy.jpg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

let localPeminjaman: Peminjaman[] = []
let localPengembalian: Pengembalian[] = []

// Database operations helper functions with local storage fallbacks

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email])
    const list = rows as User[]
    return list.length > 0 ? list[0] : null
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    return localUsers.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
  }
}

export async function findUserById(id: string): Promise<User | null> {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id])
    const list = rows as User[]
    return list.length > 0 ? list[0] : null
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    return localUsers.find(user => user.id === id) || null
  }
}

export async function createUser(user: User): Promise<void> {
  try {
    await pool.query(
      "INSERT INTO users (id, nama, email, password, role, noAnggota, nomorTelepon, alamat, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.id,
        user.nama,
        user.email,
        user.password,
        user.role,
        user.noAnggota || null,
        user.nomorTelepon || null,
        user.alamat || null,
        user.createdAt,
      ]
    )
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    localUsers.push(user)
  }
}

export async function getBooks(): Promise<Book[]> {
  try {
    const [rows] = await pool.query("SELECT * FROM books ORDER BY createdAt DESC")
    return rows as Book[]
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    return localBooks
  }
}

export async function findBookById(id: string): Promise<Book | null> {
  try {
    const [rows] = await pool.query("SELECT * FROM books WHERE id = ?", [id])
    const list = rows as Book[]
    return list.length > 0 ? list[0] : null
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    return localBooks.find(book => book.id === id) || null
  }
}

export async function createBook(book: Book): Promise<void> {
  try {
    await pool.query(
      "INSERT INTO books (id, judul, pengarang, penerbit, tahunTerbit, isbn, kategori, stok, stokTersedia, deskripsi, gambar, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        book.id,
        book.judul,
        book.pengarang,
        book.penerbit,
        book.tahunTerbit,
        book.isbn,
        book.kategori,
        book.stok,
        book.stokTersedia,
        book.deskripsi,
        book.gambar,
        book.createdAt,
        book.updatedAt,
      ]
    )
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    localBooks.push(book)
  }
}

export async function updateBook(id: string, book: Partial<Book>): Promise<void> {
  try {
    const fields: string[] = []
    const values: any[] = []
    
    for (const [key, value] of Object.entries(book)) {
      if (key !== "id" && key !== "createdAt") {
        fields.push(`${key} = ?`)
        values.push(value)
      }
    }
    
    if (fields.length === 0) return
    
    values.push(id)
    await pool.query(`UPDATE books SET ${fields.join(", ")} WHERE id = ?`, values)
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    const index = localBooks.findIndex(b => b.id === id)
    if (index > -1) {
      localBooks[index] = { ...localBooks[index], ...book } as Book
    }
  }
}

export async function deleteBook(id: string): Promise<void> {
  try {
    await pool.query("DELETE FROM books WHERE id = ?", [id])
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    const index = localBooks.findIndex(b => b.id === id)
    if (index > -1) {
      localBooks.splice(index, 1)
    }
  }
}

export async function getPeminjaman(userId?: string): Promise<Peminjaman[]> {
  try {
    if (userId) {
      const [rows] = await pool.query("SELECT * FROM peminjaman WHERE userId = ? ORDER BY createdAt DESC", [userId])
      return rows as Peminjaman[]
    }
    const [rows] = await pool.query("SELECT * FROM peminjaman ORDER BY createdAt DESC")
    return rows as Peminjaman[]
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    if (userId) {
      return localPeminjaman.filter(p => p.userId === userId)
    }
    return localPeminjaman
  }
}

export async function findPeminjamanById(id: string): Promise<Peminjaman | null> {
  try {
    const [rows] = await pool.query("SELECT * FROM peminjaman WHERE id = ?", [id])
    const list = rows as Peminjaman[]
    return list.length > 0 ? list[0] : null
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    return localPeminjaman.find(p => p.id === id) || null
  }
}

export async function createPeminjaman(p: Peminjaman): Promise<void> {
  try {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      
      // Insert peminjaman record
      await connection.query(
        "INSERT INTO peminjaman (id, userId, bookId, tanggalPinjam, tanggalKembaliTarget, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [p.id, p.userId, p.bookId, p.tanggalPinjam, p.tanggalKembaliTarget, p.status, p.createdAt]
      )
      
      // Decrement stock
      await connection.query("UPDATE books SET stokTersedia = stokTersedia - 1 WHERE id = ?", [p.bookId])
      
      await connection.commit()
    } catch (err) {
      await connection.rollback()
      throw err
    } finally {
      connection.release()
    }
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    localPeminjaman.push(p)
    const bookIndex = localBooks.findIndex(b => b.id === p.bookId)
    if (bookIndex > -1) {
      localBooks[bookIndex].stokTersedia -= 1
    }
  }
}

export async function getPengembalian(): Promise<Pengembalian[]> {
  try {
    const [rows] = await pool.query("SELECT * FROM pengembalian ORDER BY createdAt DESC")
    return rows as Pengembalian[]
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    return localPengembalian
  }
}

export async function createPengembalian(
  p: Pengembalian,
  peminjamanId: string,
  tanggalKembaliAktual: string,
  denda: number,
  bookId: string
): Promise<void> {
  try {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      
      // Insert pengembalian record
      await connection.query(
        "INSERT INTO pengembalian (id, peminjamanId, tanggalKembali, statusBuku, biayaKerusakan, catatan, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [p.id, p.peminjamanId, p.tanggalKembali, p.statusBuku, p.biayaKerusakan, p.catatan, p.createdAt]
      )
      
      // Update peminjaman status
      await connection.query(
        "UPDATE peminjaman SET status = 'dikembalikan', tanggalKembaliAktual = ?, denda = ? WHERE id = ?",
        [tanggalKembaliAktual, denda, peminjamanId]
      )
      
      // Increment stock
      await connection.query("UPDATE books SET stokTersedia = stokTersedia + 1 WHERE id = ?", [bookId])
      
      await connection.commit()
    } catch (err) {
      await connection.rollback()
      throw err
    } finally {
      connection.release()
    }
  } catch (error) {
    console.warn("DB connection failed, falling back to local memory storage.")
    localPengembalian.push(p)
    const pemIndex = localPeminjaman.findIndex(pem => pem.id === peminjamanId)
    if (pemIndex > -1) {
      localPeminjaman[pemIndex].status = "dikembalikan"
      localPeminjaman[pemIndex].tanggalKembaliAktual = tanggalKembaliAktual
      localPeminjaman[pemIndex].denda = denda
    }
    const bookIndex = localBooks.findIndex(b => b.id === bookId)
    if (bookIndex > -1) {
      localBooks[bookIndex].stokTersedia += 1
    }
  }
}
