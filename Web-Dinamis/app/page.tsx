"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ClientWrapper from "./components/ClientWrapper"
import { getUserRole } from "./lib/auth"
import { FiBook, FiUsers, FiAward, FiArrowRight, FiZap, FiTarget } from "react-icons/fi"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
    setIsLoggedIn(!!role)
  }, [])

  useEffect(() => {
    if (isLoggedIn && userRole === "admin") {
      router.push("/dashboard/admin")
    } else if (isLoggedIn && userRole === "user") {
      router.push("/dashboard/user")
    }
  }, [isLoggedIn, userRole, router])

  if (isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin">
            <FiBook size={48} className="text-primary" />
          </div>
          <p className="mt-4 text-gray-600">Mengalihkan...</p>
        </div>
      </div>
    )
  }

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Perpustakaan Digital Modern
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Akses ribuan koleksi buku digital, kelola peminjaman dengan mudah, dan nikmati pengalaman membaca yang lebih baik.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  Mulai Sekarang
                  <FiArrowRight />
                </Link>
                <Link
                  href="/katalog"
                  className="px-6 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-semibold"
                >
                  Lihat Katalog
                </Link>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl">
                <FiBook size={48} className="text-white" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center">Fitur Unggulan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <FiBook size={24} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Katalog Lengkap</h3>
                <p className="text-gray-600">
                  Koleksi buku terlengkap dengan berbagai kategori untuk semua kalangan pembaca.
                </p>
              </div>
              <div className="card">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4">
                  <FiZap size={24} className="text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Peminjaman Mudah</h3>
                <p className="text-gray-600">
                  Proses peminjaman yang cepat dan transparan dengan sistem tracking real-time.
                </p>
              </div>
              <div className="card">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/20 rounded-lg mb-4">
                  <FiTarget size={24} className="text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Intuitif</h3>
                <p className="text-gray-600">
                  Kelola semua aktivitas peminjaman Anda dari satu dashboard yang user-friendly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-6">Siap Bergabung?</h2>
            <p className="text-xl mb-8">
              Daftarkan akun gratis Anda sekarang dan mulai menikmati berbagai keuntungan sebagai member perpustakaan kami.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-3 bg-accent text-primary rounded-lg font-bold hover:bg-accent/90 transition-colors"
            >
              Daftar Gratis Sekarang
            </Link>
          </div>
        </section>
      </div>
    </ClientWrapper>
  )
}
