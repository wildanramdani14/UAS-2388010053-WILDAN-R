"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import ClientWrapper from "@/app/components/ClientWrapper"
import { setAuthToken, setUserRole, setUserId } from "@/app/lib/auth"
import { FiMail, FiLock, FiAlertCircle, FiUser } from "react-icons/fi"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      })

      if (response.data.success) {
        setAuthToken(response.data.token)
        setUserRole(response.data.user.role)
        setUserId(response.data.user.id)

        if (response.data.user.role === "admin") {
          router.push("/dashboard/admin")
        } else {
          router.push("/dashboard/user")
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login gagal. Silakan coba lagi.")
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Masuk</h1>
              <p className="text-gray-500 text-sm">Selamat datang kembali di Perpustakaan Digital</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 animate-shake">
                <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
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
                  "Masuk Sekarang"
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

            {/* Register Link */}
            <p className="text-center text-gray-600 text-sm">
              Belum punya akun?{" "}
              <Link href="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Daftar gratis
              </Link>
            </p>

            {/* Demo Credentials Section */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Demo Akun Tersedia</p>
              <div className="space-y-2.5">
                <div className="p-3 bg-gradient-to-r from-yellow-50 to-yellow-100/50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow">
                  <p className="text-xs font-semibold text-yellow-900">Admin</p>
                  <p className="text-xs text-yellow-800 font-mono mt-1">admin@perpus.com</p>
                  <p className="text-xs text-yellow-800 font-mono">admin123</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                  <p className="text-xs font-semibold text-blue-900">User</p>
                  <p className="text-xs text-blue-800 font-mono mt-1">budi@example.com</p>
                  <p className="text-xs text-blue-800 font-mono">user123</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Data demo akan direset setiap kali server di-restart
          </p>
        </div>
      </div>
    </ClientWrapper>
  )
}
