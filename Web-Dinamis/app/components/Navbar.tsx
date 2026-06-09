import Link from "next/link"
import { FiLogOut, FiHome, FiBook, FiUser } from "react-icons/fi"

export default function Navbar({ userRole }: { userRole?: string }) {
  return (
    <nav className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
            <FiBook size={24} />
            <span>Perpustakaan Digital</span>
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-accent transition-colors">
              Beranda
            </Link>
            <Link href="/katalog" className="hover:text-accent transition-colors">
              Katalog
            </Link>
            {userRole === "user" && (
              <Link href="/dashboard/user" className="hover:text-accent transition-colors">
                Dashboard
              </Link>
            )}
            {userRole === "admin" && (
              <Link href="/dashboard/admin" className="hover:text-accent transition-colors">
                Admin Panel
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {userRole ? (
              <>
                <Link href="/profile" className="hover:text-accent transition-colors">
                  <FiUser size={20} />
                </Link>
                <Link href="/keluar" className="hover:text-accent transition-colors">
                  <FiLogOut size={20} />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
