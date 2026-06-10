"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import ClientWrapper from "@/app/components/ClientWrapper"
import { Book } from "@/app/lib/types"
import { getUserRole, removeAuthToken } from "@/app/lib/auth"
import { FiTrash2, FiEdit, FiPlus, FiLogOut, FiBook, FiCheck, FiTag } from "react-icons/fi"

export default function AdminDashboard() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    judul: "",
    pengarang: "",
    penerbit: "",
    tahunTerbit: new Date().getFullYear(),
    isbn: "",
    kategori: "Teknologi",
    stok: 1,
    deskripsi: "",
    gambar: "",
  })

  useEffect(() => {
    const role = getUserRole()

    if (role !== "admin") {
      router.push("/login")
      return
    }

    fetchBooks()
  }, [router])

  const fetchBooks = async () => {
    try {
      const response = await axios.get("/api/books")
      setBooks(response.data.data)
    } catch (error) {
      console.error("Failed to fetch books", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "tahunTerbit" || name === "stok" ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        await axios.put(`/api/books/${editingId}`, formData)
      } else {
        await axios.post("/api/books", formData)
      }

      fetchBooks()
      resetForm()
      setShowForm(false)
    } catch (error) {
      console.error("Failed to save book", error)
      alert("Gagal menyimpan buku")
    }
  }

  const handleEdit = (book: Book) => {
    setFormData({
      judul: book.judul,
      pengarang: book.pengarang,
      penerbit: book.penerbit,
      tahunTerbit: book.tahunTerbit,
      isbn: book.isbn,
      kategori: book.kategori,
      stok: book.stok,
      deskripsi: book.deskripsi,
      gambar: book.gambar,
    })
    setEditingId(book.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      try {
        await axios.delete(`/api/books/${id}`)
        fetchBooks()
      } catch (error) {
        console.error("Failed to delete book", error)
        alert("Gagal menghapus buku")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      judul: "",
      pengarang: "",
      penerbit: "",
      tahunTerbit: new Date().getFullYear(),
      isbn: "",
      kategori: "Teknologi",
      stok: 1,
      deskripsi: "",
      gambar: "",
    })
    setEditingId(null)
  }

  const handleLogout = () => {
    removeAuthToken()
    router.push("/")
  }

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="section-title">Halo Administrator </h1>
              <p className="text-gray-600">Kelola koleksi buku perpustakaan</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              <FiLogOut size={20} />
              Exit
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FiBook className="text-4xl text-primary" />
              </div>
              <p className="text-gray-600 mb-2 font-semibold">Total Buku</p>
              <p className="text-3xl font-bold text-primary">{books.length}</p>
            </div>
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FiCheck className="text-4xl text-green-600" />
              </div>
              <p className="text-gray-600 mb-2 font-semibold">Buku Tersedia</p>
              <p className="text-3xl font-bold text-green-600">
                {books.reduce((sum, b) => sum + b.stokTersedia, 0)}
              </p>
            </div>
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <FiTag className="text-4xl text-secondary" />
              </div>
              <p className="text-gray-600 mb-2 font-semibold">Kategori</p>
              <p className="text-3xl font-bold text-secondary">
                {new Set(books.map(b => b.kategori)).size}
              </p>
            </div>
          </div>

          {/* Add Book Button */}
          <div className="mb-8">
            <button
              onClick={() => {
                resetForm()
                setShowForm(!showForm)
              }}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus size={20} />
              {showForm ? "Batalkan" : "Tambah Buku Baru"}
            </button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="card mb-12">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? "Edit Buku" : "Tambah Buku Baru"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Judul <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="judul"
                      value={formData.judul}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pengarang <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pengarang"
                      value={formData.pengarang}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Penerbit
                    </label>
                    <input
                      type="text"
                      name="penerbit"
                      value={formData.penerbit}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ISBN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tahun Terbit
                    </label>
                    <input
                      type="number"
                      name="tahunTerbit"
                      value={formData.tahunTerbit}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option>Teknologi</option>
                      <option>Filsafat</option>
                      <option>Fiksi</option>
                      <option>Seni</option>
                      <option>Sejarah</option>
                      <option>Humaniora</option>
                      <option>Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stok
                    </label>
                    <input
                      type="number"
                      name="stok"
                      value={formData.stok}
                      onChange={handleInputChange}
                      className="input-field"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      URL Gambar
                    </label>
                    <input
                      type="text"
                      name="gambar"
                      value={formData.gambar}
                      onChange={handleInputChange}
                      placeholder="/uploads/..."
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    rows={4}
                    className="input-field"
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="btn-primary">
                    {editingId ? "Perbarui" : "Tambah"} Buku
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      resetForm()
                    }}
                    className="btn-secondary"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Books Table */}
          {loading ? (
            <div className="flex justify-center items-center min-h-64">
              <p className="text-gray-600 text-lg">Memuat data...</p>
            </div>
          ) : (
            <div className="card overflow-x-auto">
              <h2 className="text-2xl font-bold mb-6">Daftar Buku</h2>
              {books.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Belum ada buku. Tambahkan buku terlebih dahulu.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Judul</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Pengarang</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Kategori</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Stok</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Tersedia</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-gray-900">{book.judul}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{book.pengarang}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                            {book.kategori}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold">{book.stok}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${book.stokTersedia > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}>
                            {book.stokTersedia}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          <button
                            onClick={() => handleEdit(book)}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-semibold transition-colors"
                          >
                            <FiEdit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-semibold transition-colors"
                          >
                            <FiTrash2 size={16} />
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </ClientWrapper>
  )
}
