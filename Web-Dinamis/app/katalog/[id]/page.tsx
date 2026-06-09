"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import ClientWrapper from "@/app/components/ClientWrapper"
import { Book } from "@/app/lib/types"
import { getUserId, getUserRole } from "@/app/lib/auth"
import { FiArrowLeft, FiBook, FiAlertCircle } from "react-icons/fi"

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [durasi, setDurasi] = useState(7)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/api/books/${bookId}`)
        setBook(response.data.data)
      } catch (error) {
        console.error("Failed to fetch book", error)
        setError("Buku tidak ditemukan")
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [bookId])

  const handleBorrow = async () => {
    const userId = getUserId()
    const userRole = getUserRole()

    if (!userId) {
      router.push("/login")
      return
    }

    if (userRole !== "user") {
      setError("Hanya pengguna yang dapat meminjam buku")
      return
    }

    setBorrowing(true)
    setError("")

    try {
      const response = await axios.post("/api/peminjaman", {
        userId,
        bookId,
        durasi,
      })

      if (response.data.success) {
        setSuccess("Buku berhasil dipinjam! Silakan periksa dashboard Anda.")
        setTimeout(() => {
          router.push("/dashboard/user")
        }, 2000)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal meminjam buku")
    } finally {
      setBorrowing(false)
    }
  }

  if (loading) {
    return (
      <ClientWrapper>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-600 text-lg">Memuat data...</p>
        </div>
      </ClientWrapper>
    )
  }

  if (!book) {
    return (
      <ClientWrapper>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="card text-center">
            <p className="text-lg text-gray-600 mb-6">Buku tidak ditemukan</p>
            <Link href="/katalog" className="btn-primary">
              Kembali ke Katalog
            </Link>
          </div>
        </div>
      </ClientWrapper>
    )
  }

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/katalog" className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-semibold">
            <FiArrowLeft />
            Kembali ke Katalog
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Book Cover */}
            <div className="flex items-center justify-center">
              <div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                <FiBook size={80} className="text-primary/40" />
              </div>
            </div>

            {/* Book Details */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.judul}</h1>

              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-sm text-gray-600">Pengarang</p>
                  <p className="text-xl font-semibold text-gray-900">{book.pengarang}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Penerbit</p>
                  <p className="text-lg text-gray-900">{book.penerbit || "-"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tahun Terbit</p>
                    <p className="text-lg text-gray-900">{book.tahunTerbit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ISBN</p>
                    <p className="text-lg text-gray-900">{book.isbn}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kategori</p>
                  <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold">
                    {book.kategori}
                  </span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Ketersediaan</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-bold text-primary">{book.stokTersedia}</p>
                    <p className="text-sm text-gray-600">dari {book.stok} buku tersedia</p>
                  </div>
                  {book.stokTersedia === 0 && (
                    <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-bold text-sm">
                      HABIS
                    </span>
                  )}
                </div>
              </div>

              {/* Borrow Form */}
              {book.stokTersedia > 0 && (
                <div className="card">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Pinjam Buku</h3>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                      <FiAlertCircle className="text-red-600 flex-shrink-0" size={20} />
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 font-semibold">{success}</p>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Durasi Peminjaman (Hari)
                    </label>
                    <select
                      value={durasi}
                      onChange={(e) => setDurasi(parseInt(e.target.value))}
                      className="input-field"
                      disabled={borrowing}
                    >
                      <option value={3}>3 hari</option>
                      <option value={7}>7 hari</option>
                      <option value={14}>14 hari</option>
                      <option value={30}>30 hari</option>
                    </select>
                  </div>

                  <p className="text-sm text-gray-600 mb-6">
                    📅 Target pengembalian: {new Date(Date.now() + durasi * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID")}
                  </p>

                  <button
                    onClick={handleBorrow}
                    disabled={borrowing}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {borrowing ? "Memproses..." : "Pinjam Sekarang"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {book.deskripsi && (
            <div className="mt-12 card">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Deskripsi</h3>
              <p className="text-gray-600 leading-relaxed">{book.deskripsi}</p>
            </div>
          )}
        </div>
      </div>
    </ClientWrapper>
  )
}
