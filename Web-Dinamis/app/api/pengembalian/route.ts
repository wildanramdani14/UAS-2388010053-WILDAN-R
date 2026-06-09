import { NextRequest, NextResponse } from "next/server"
import { getPengembalian, findPeminjamanById, createPengembalian } from "@/app/lib/mockData"
import { Pengembalian } from "@/app/lib/types"

export async function GET() {
  try {
    const data = await getPengembalian()
    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data pengembalian" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { peminjamanId, statusBuku, biayaKerusakan = 0, catatan = "" } = await request.json()

    if (!peminjamanId) {
      return NextResponse.json(
        { error: "Peminjaman ID harus diisi" },
        { status: 400 }
      )
    }

    const peminjamanData = await findPeminjamanById(peminjamanId)

    if (!peminjamanData) {
      return NextResponse.json(
        { error: "Peminjaman tidak ditemukan" },
        { status: 404 }
      )
    }

    if (peminjamanData.status === "dikembalikan") {
      return NextResponse.json(
        { error: "Buku sudah dikembalikan sebelumnya" },
        { status: 400 }
      )
    }

    // Calculate fine if late
    const today = new Date()
    const targetDate = new Date(peminjamanData.tanggalKembaliTarget)
    const timeDiff = today.getTime() - targetDate.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    const denda = daysDiff > 0 ? daysDiff * 5000 : 0 // 5000 per hari

    const totalBiaya = (denda || 0) + (biayaKerusakan || 0)

    const newPengembalian: Pengembalian = {
      id: `kembali_${Date.now()}`,
      peminjamanId,
      tanggalKembali: today.toISOString(),
      statusBuku: statusBuku || "baik",
      biayaKerusakan: biayaKerusakan || 0,
      catatan: catatan || "",
      createdAt: new Date().toISOString(),
    }

    await createPengembalian(
      newPengembalian,
      peminjamanId,
      today.toISOString(),
      denda,
      peminjamanData.bookId
    )

    return NextResponse.json({
      success: true,
      data: {
        pengembalian: newPengembalian,
        denda: denda,
        biayaKerusakan: biayaKerusakan || 0,
        totalBiaya: totalBiaya,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal membuat pengembalian" },
      { status: 500 }
    )
  }
}
