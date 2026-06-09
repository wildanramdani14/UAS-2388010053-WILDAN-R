import { NextRequest, NextResponse } from "next/server"
import { getPeminjaman, findBookById, createPeminjaman } from "@/app/lib/mockData"
import { Peminjaman } from "@/app/lib/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    const data = await getPeminjaman(userId || undefined)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data peminjaman" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, bookId, durasi = 7 } = await request.json()

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "User ID dan Book ID harus diisi" },
        { status: 400 }
      )
    }

    const book = await findBookById(bookId)

    if (!book || book.stokTersedia <= 0) {
      return NextResponse.json(
        { error: "Buku tidak tersedia" },
        { status: 400 }
      )
    }

    const tanggalPinjam = new Date()
    const tanggalKembaliTarget = new Date()
    tanggalKembaliTarget.setDate(tanggalKembaliTarget.getDate() + durasi)

    const newPeminjaman: Peminjaman = {
      id: `pinjam_${Date.now()}`,
      userId,
      bookId,
      tanggalPinjam: tanggalPinjam.toISOString(),
      tanggalKembaliTarget: tanggalKembaliTarget.toISOString(),
      status: "aktif",
      createdAt: new Date().toISOString(),
    }

    await createPeminjaman(newPeminjaman)

    return NextResponse.json({
      success: true,
      data: newPeminjaman,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal membuat peminjaman" },
      { status: 500 }
    )
  }
}
