import { NextRequest, NextResponse } from "next/server"
import { findUserByEmail, createUser } from "@/app/lib/mockData"
import { User } from "@/app/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { nama, email, password, noAnggota } = await request.json()

    if (!nama || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password harus diisi" },
        { status: 400 }
      )
    }

    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      )
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      nama,
      email,
      password, // In production, hash this with bcrypt
      role: "user",
      noAnggota: noAnggota || `A${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
    }

    await createUser(newUser)

    const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        nama: newUser.nama,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    )
  }
}
