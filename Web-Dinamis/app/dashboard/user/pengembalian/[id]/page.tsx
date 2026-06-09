"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import ClientWrapper from "@/app/components/ClientWrapper"
import { Peminjaman, Book } from "@/app/lib/types"
import { getUserId, getUserRole } from "@/app/lib/auth"
import { FiArrowLeft, FiAlertCircle, FiCheckCircle, FiBook } from "react-icons/fi"

export default function PengembalianPage() {
  const params = useParams()
  const router = useRouter()
  const peminjamanId = params.id as string

  const [peminjaman, setPeminjaman] = useState<Peminjaman | null>(null)
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [returning, setReturning] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    statusBuku: "baik",
    biayaKerusakan: 0,
    catatan: "",
  })

  useEffect(() => {
    const userId = getUserId()
    const userRole = getUserRole()

    if (!userId || userRole !== "user") {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        const [peminjamanRes, booksRes] = await Promise.all([
          axios.get(`/api/peminjaman?userId=${userId}`),
          axios.get("/api/books"),
        ])

        const peminjamanData = peminjamanRes.data.data.find((p: Peminjaman) => p.id === peminjamanId)

        if (!peminjamanData) {
          setError("Peminjaman tidak ditemukan")
          setLoading(false)
          return
        }

        setPeminjaman(peminjamanData)

        const bookData = booksRes.data.data.find((b: Book) => b.id === peminjamanData.bookId)
        setBook(bookData)
      } catch (error) {
        console.error("Failed to fetch data", error)
        setError("Gagal mengambil data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [peminjamanId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "biayaKerusakan" ? parseInt(value) || 0 : value,
    }))
  }

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setReturning(true)

    try {
      const response = await axios.post("/api/pengembalian", {
        peminjamanId,
        ...formData,
      })

      if (response.data.success) {
        setSuccess(`Buku berhasil dikembalikan!${
          response.data.data.denda > 0
            ? ` Denda keterlambatan: Rp ${response.data.data.denda.toLocaleString("id-ID")}`
            : ""
        }`)

        setTimeout(() => {
          router.push("/dashboard/user")
        }, 2000)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal mengembalikan buku")
    } finally {
      setReturning(false)
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

  if (!peminjaman || !book) {
    return (
      <ClientWrapper>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="card text-center">
            <p className="text-lg text-red-600 mb-6">Data tidak ditemukan</p>
            <Link href="/dashboard/user" className="btn-primary">
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </ClientWrapper>
    )
  }

  const targetDate = new Date(peminjaman.tanggalKembaliTarget)
  const today = new Date()
  const timeDiff = today.getTime() - targetDate.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
  const isLate = daysDiff > 0
  const denda = isLate ? daysDiff * 5000 : 0

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard/user" className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-semibold">
            <FiArrowLeft />
            Kembali ke Dashboard
          </Link>

          <div className="card">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Pengembalian Buku</h1>

            {/* Book Info */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FiBook size={20} className="text-blue-600" />
                {book.judul}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Pengarang</p>
                  <p className="font-semibold text-gray-900">{book.pengarang}</p>
                </div>
                <div>
                  <p className="text-gray-600">ISBN</p>
                  <p className="font-semibold text-gray-900">{book.isbn}</p>
                </div>
                <div>
                  <p className="text-gray-600">Tanggal Pinjam</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(peminjaman.tanggalPinjam).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Target Kembali</p>
                  <p className={`font-semibold ${isLate ? "text-red-600" : "text-gray-900"}`}>
                    {targetDate.toLocaleDateString("id-ID")}
                    {isLate && <span className="text-red-600"> (Terlambat {daysDiff} hari)</span>}
                  </p>
                </div>
              </div>
            </div>

            {/* Late Fee Warning */}
            {isLate && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <FiAlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-bold text-red-900 mb-2">Buku Terlambat!</p>
                  <p className="text-red-800">
                    Buku Anda terlambat {daysDiff} hari. Denda keterlambatan: <strong>Rp {denda.toLocaleString("id-ID")}/hari</strong>
                  </p>
                  <p className="text-red-800 mt-2">
                    <strong>Total Denda: Rp {(denda * daysDiff).toLocaleString("id-ID")}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                <FiCheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-bold text-green-900">{success}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <FiAlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Return Form */}
            {!success && (
              <form onSubmit={handleReturn} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status Kondisi Buku <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="statusBuku"
                    value={formData.statusBuku}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="baik">Baik</option>
                    <option value="rusak_ringan">Rusak Ringan</option>
                    <option value="rusak_berat">Rusak Berat</option>
                  </select>
                  <p className="text-xs text-gray-600 mt-1">
                    Pilih kondisi buku saat mengembalikan
                  </p>
                </div>

                {formData.statusBuku !== "baik" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Biaya Kerusakan (Rp)
                    </label>
                    <input
                      type="number"
                      name="biayaKerusakan"
                      value={formData.biayaKerusakan}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="input-field"
                      min="0"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleInputChange}
                    placeholder="Catatan kondisi buku atau hal penting lainnya..."
                    rows={4}
                    className="input-field"
                  />
                </div>

                {/* Cost Summary */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Ringkasan Biaya:</p>
                  <div className="space-y-1 text-sm">
                    {isLate && (
                      <div className="flex justify-between">
                        <span>Denda Keterlambatan ({daysDiff} hari × Rp 5.000):</span>
                        <span className="font-bold">Rp {(denda * daysDiff).toLocaleString("id-ID")}</span>
                      </div>
                    )}
                    {formData.biayaKerusakan > 0 && (
                      <div className="flex justify-between">
                        <span>Biaya Kerusakan:</span>
                        <span className="font-bold">Rp {formData.biayaKerusakan.toLocaleString("id-ID")}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t-2 border-yellow-300 pt-2 mt-2">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-yellow-700">
                        Rp {((isLate ? denda * daysDiff : 0) + formData.biayaKerusakan).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={returning}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {returning ? "Memproses..." : "Kembalikan Buku"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </ClientWrapper>
  )
}
