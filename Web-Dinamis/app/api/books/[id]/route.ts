import { NextRequest, NextResponse } from "next/server"
import { findBookById, updateBook, deleteBook } from "@/app/lib/mockData"

export const dynamic = "force-dynamic"


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await findBookById(params.id)

    if (!book) {
      return NextResponse.json(
        { error: "Buku tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: book,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data buku" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await findBookById(params.id)

    if (!book) {
      return NextResponse.json(
        { error: "Buku tidak ditemukan" },
        { status: 404 }
      )
    }

    const updateData = await request.json()

    // Recalculate stokTersedia if stok is updated
    if (typeof updateData.stok === "number") {
      const diff = updateData.stok - book.stok
      updateData.stokTersedia = Math.max(0, book.stokTersedia + diff)
    }

    await updateBook(params.id, updateData)

    const updatedBook = {
      ...book,
      ...updateData,
      id: book.id,
      createdAt: book.createdAt,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: updatedBook,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui buku" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await findBookById(params.id)

    if (!book) {
      return NextResponse.json(
        { error: "Buku tidak ditemukan" },
        { status: 404 }
      )
    }

    await deleteBook(params.id)

    return NextResponse.json({
      success: true,
      data: book,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menghapus buku" },
      { status: 500 }
    )
  }
}
