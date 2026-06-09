import { NextRequest, NextResponse } from "next/server"
import { getBooks, createBook } from "@/app/lib/mockData"

export async function GET() {
  try {
    const data = await getBooks()
    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data buku" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { judul, pengarang, penerbit, tahunTerbit, isbn, kategori, stok, deskripsi, gambar } = await request.json()

    if (!judul || !pengarang || !isbn) {
      return NextResponse.json(
        { error: "Judul, pengarang, dan ISBN harus diisi" },
        { status: 400 }
      )
    }

    const newBook = {
      id: `book_${Date.now()}`,
      judul,
      pengarang,
      penerbit: penerbit || "",
      tahunTerbit: tahunTerbit || new Date().getFullYear(),
      isbn,
      kategori: kategori || "Umum",
      stok: stok || 1,
      stokTersedia: stok || 1,
      deskripsi: deskripsi || "",
      gambar: gambar || "/images/default-book.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await createBook(newBook)

    return NextResponse.json({
      success: true,
      data: newBook,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal membuat buku baru" },
      { status: 500 }
    )
  }
}
