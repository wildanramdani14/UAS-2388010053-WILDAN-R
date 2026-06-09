"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import ClientWrapper from "@/app/components/ClientWrapper"
import { setAuthToken, setUserRole, setUserId } from "@/app/lib/auth"
import { FiUser, FiMail, FiLock, FiAlertCircle } from "react-icons/fi"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok")
      return
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }

    setLoading(true)

    try {
      const response = await axios.post("/api/auth/register", {
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
      })

      if (response.data.success) {
        setAuthToken(response.data.token)
        setUserRole(response.data.user.role)
        setUserId(response.data.user.id)
        router.push("/dashboard/user")
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Registrasi gagal. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm">
            {/* Header Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl mb-4 text-white">
                <FiUser size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar</h1>
              <p className="text-gray-500 text-sm">Bergabunglah dengan Perpustakaan Digital kami</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 animate-shake">
                <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name Field */}
              <div>
                <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Nama Lengkap
                </label>
                <div className="relative group">
                  <FiUser className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    id="nama"
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Nama lengkap Anda"
                    className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-primary/5 transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Email
                </label>
                <div className="relative group">
                  <FiMail className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-primary/5 transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Password
                </label>
                <div className="relative group">
                  <FiLock className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-3 pl-11 pr-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-primary/5 transition-all placeholder:text-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? "✕" : "✓"}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2.5">
                  Konfirmasi Password
                </label>
                <div className="relative group">
                  <FiLock className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Ulangi password Anda"
                    className="w-full px-4 py-3 pl-11 pr-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-primary/5 transition-all placeholder:text-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? "✕" : "✓"}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    Loading...
                  </span>
                ) : (
                  "Daftar Gratis"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">atau</span>
              </div>
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-600 text-sm">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Masuk di sini
              </Link>
            </p>

            {/* Info Box */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Dengan mendaftar, Anda dapat meminjam buku, mengelola riwayat peminjaman, dan menikmati semua fitur Perpustakaan Digital.
              </p>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Data Anda aman dan tidak akan dibagikan kepada pihak ketiga
          </p>
        </div>
      </div>
    </ClientWrapper>
  )
}
