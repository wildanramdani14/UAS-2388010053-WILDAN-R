"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import ClientWrapper from "@/app/components/ClientWrapper"
import { Peminjaman, Book } from "@/app/lib/types"
import { getUserId, getUserRole, removeAuthToken } from "@/app/lib/auth"
import { FiArrowLeft, FiBook, FiCalendar, FiLogOut } from "react-icons/fi"

export default function UserDashboard() {
  const router = useRouter()
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([])
  const [books, setBooks] = useState<{ [key: string]: Book }>({})
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = getUserId()
    const role = getUserRole()

    if (!id || role !== "user") {
      router.push("/login")
      return
    }

    setUserId(id)
  }, [router])

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        const [peminjamanRes, booksRes] = await Promise.all([
          axios.get(`/api/peminjaman?userId=${userId}`),
          axios.get("/api/books"),
        ])

        setPeminjaman(peminjamanRes.data.data)

        const bookMap = booksRes.data.data.reduce((acc: any, book: Book) => {
          acc[book.id] = book
          return acc
        }, {})
        setBooks(bookMap)
      } catch (error) {
        console.error("Failed to fetch data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const handleLogout = () => {
    removeAuthToken()
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aktif":
        return "bg-blue-100 text-blue-800"
      case "terlambat":
        return "bg-red-100 text-red-800"
      case "dikembalikan":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const activePeminjaman = peminjaman.filter(p => p.status === "aktif" || p.status === "terlambat")
  const returnedPeminjaman = peminjaman.filter(p => p.status === "dikembalikan")

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="section-title">Dashboard User</h1>
              <p className="text-gray-600">Kelola peminjaman buku Anda</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              <FiLogOut size={20} />
              Logout
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-64">
              <p className="text-gray-600 text-lg">Memuat data...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Active Borrowing Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiBook className="text-primary" />
                  Peminjaman Aktif ({activePeminjaman.length})
                </h2>
                
                {activePeminjaman.length === 0 ? (
                  <div className="card text-center py-12">
                    <p className="text-gray-600 mb-4">Anda belum meminjam buku</p>
                    <Link href="/katalog" className="btn-primary inline-block">
                      Mulai Pinjam Buku
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activePeminjaman.map(p => {
                      const book = books[p.bookId]
                      const targetDate = new Date(p.tanggalKembaliTarget)
                      const today = new Date()
                      const isLate = today > targetDate

                      return (
                        <div key={p.id} className="card">
                          <div className="mb-4">
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2">
                              {book?.judul || "Buku Tidak Ditemukan"}
                            </h3>
                            <p className="text-sm text-gray-600">{book?.pengarang}</p>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Tanggal Pinjam:</span>
                              <span className="font-semibold">
                                {new Date(p.tanggalPinjam).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Target Kembali:</span>
                              <span className={`font-semibold ${isLate ? "text-red-600" : ""}`}>
                                {targetDate.toLocaleDateString("id-ID")}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(p.status)}`}>
                              {p.status.toUpperCase()}
                            </span>
                            {isLate && (
                              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-bold">
                                TERLAMBAT
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/dashboard/user/pengembalian/${p.id}`}
                            className="mt-4 block text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                          >
                            Kembalikan Buku
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Returned Books Section */}
              {returnedPeminjaman.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FiBook className="text-green-600" />
                    Riwayat Pengembalian ({returnedPeminjaman.length})
                  </h2>
                  <div className="card overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Judul Buku</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Tanggal Pinjam</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Tanggal Kembali</th>
                          <th className="text-left py-3 px-4 font-bold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {returnedPeminjaman.map(p => {
                          const book = books[p.bookId]
                          return (
                            <tr key={p.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">{book?.judul || "Tidak Ditemukan"}</td>
                              <td className="py-3 px-4 text-sm">
                                {new Date(p.tanggalPinjam).toLocaleDateString("id-ID")}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {p.tanggalKembaliAktual
                                  ? new Date(p.tanggalKembaliAktual).toLocaleDateString("id-ID")
                                  : "-"}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(p.status)}`}>
                                  {p.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Browse More Button */}
              <div className="text-center">
                <Link href="/katalog" className="btn-primary">
                  Jelajahi Lebih Banyak Buku
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientWrapper>
  )
}
