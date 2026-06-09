"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import ClientWrapper from "@/app/components/ClientWrapper"
import { Book } from "@/app/lib/types"
import { FiBook, FiFilter, FiSearch } from "react-icons/fi"

export default function KatalogPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/api/books")
        setBooks(response.data.data)
        
        const categorySet = new Set<string>(response.data.data.map((b: Book) => b.kategori))
        const cats: string[] = ["Semua", ...Array.from(categorySet)]
        setCategories(cats)
        
        setFilteredBooks(response.data.data)
      } catch (error) {
        console.error("Failed to fetch books", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  useEffect(() => {
    let filtered = books

    if (selectedCategory !== "Semua") {
      filtered = filtered.filter(b => b.kategori === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.pengarang.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredBooks(filtered)
  }, [searchTerm, selectedCategory, books])

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="section-title">Katalog Buku</h1>
            <p className="text-gray-600 text-lg">Jelajahi koleksi buku terlengkap kami</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-12">
            {/* Search Bar Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col gap-4">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Cari Buku</label>
                  <div className="relative group">
                    <FiSearch className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="Masukkan judul atau nama pengarang..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-primary/5 transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Kategori</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Info */}
            {!loading && (
              <div className="text-sm text-gray-600 px-2">
                <span className="font-semibold text-gray-700">{filteredBooks.length}</span> buku ditemukan
              </div>
            )}
          </div>

          {/* Books Grid */}
          {loading ? (
            <div className="flex justify-center items-center min-h-64">
              <p className="text-gray-600">Memuat data...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Tidak ada buku yang sesuai dengan kriteria pencarian</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map(book => (
                <Link
                  key={book.id}
                  href={`/katalog/${book.id}`}
                  className="group card overflow-hidden hover:-translate-y-1 duration-300"
                >
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 relative">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                      <FiBook size={40} className="text-primary/40" />
                    </div>
                    {book.stokTersedia === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">Habis</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {book.judul}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{book.pengarang}</p>
                  <p className="text-xs text-gray-500 mb-3">{book.kategori}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-primary">Stok: {book.stokTersedia}</span>
                    <span className="text-2xl">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientWrapper>
  )
}
