"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getUserRole } from "@/app/lib/auth"
import Navbar from "./Navbar"

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <>
      <Navbar userRole={userRole || undefined} />
      <main>{children}</main>
    </>
  )
}
