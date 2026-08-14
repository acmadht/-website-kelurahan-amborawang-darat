import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function text(value: unknown) { return String(value ?? "").trim(); }
function dateOut(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const maybe = value as { toDate?: () => Date };
    try { return maybe.toDate?.().toISOString().slice(0, 10) ?? ""; } catch { return ""; }
  }
  return "";
}
function yesNo(value: unknown) { return value === false ? "Tidak" : "Ya"; }
async function readCollection(name: string) {
  const snap = await getAdminDb().collection(name).limit(5000).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function GET(request: NextRequest) {
  const expected = process.env.SPREADSHEET_SYNC_SECRET?.trim();
  if (!expected || request.headers.get("x-sync-secret") !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const sheet = request.nextUrl.searchParams.get("sheet") || "";
  let rows: Record<string, unknown>[] = [];

  if (sheet === "Data RT") {
    const docs = await readCollection("rts");
    rows = docs.map((d: any) => ({
      "Firestore ID": d.id, "RT": text(d.number), "Nama Ketua RT": text(d.chairmanName), "No. HP": text(d.phone),
      "Alamat/Pos RT": text(d.area), "Status": d.isActive === false ? "Tidak Aktif" : "Aktif", "Jumlah KK": Number(d.familyCount || 0),
      "Jumlah Penduduk": Number(d.populationCount || 0), "Laki-laki": Number(d.maleCount || 0), "Perempuan": Number(d.femaleCount || 0), "Keterangan": text(d.description),
    }));
  } else if (sheet === "Pemerintahan") {
    const docs = await readCollection("officials");
    rows = docs.map((d: any) => ({
      "Firestore ID": d.id, "Nama": text(d.name), "Jabatan": text(d.title), "Status": d.isActive === false ? "Tidak Aktif" : "Aktif",
      "Mulai Menjabat": dateOut(d.termStart), "Akhir Menjabat": dateOut(d.termEnd), "Kontak": text(d.phone), "Foto/Link": text(d.photoUrl),
      "Urutan Website": Number(d.order || 0), "Tampil Website": yesNo(d.isActive), "Keterangan": text(d.description),
    }));
  } else if (sheet === "Kegiatan") {
    const posts = await readCollection("posts");
    const anns = await readCollection("announcements");
    rows = [
      ...posts.map((d: any) => ({
        "Firestore ID": d.id, "ID Konten": d.id, "Tanggal": dateOut(d.publishedDate), "Jenis": d.category === "Masyarakat" ? "Kegiatan" : "Berita",
        "Judul": text(d.title), "Ringkasan": text(d.summary), "Lokasi": text(d.location), "Penanggung Jawab": text(d.authorName),
        "Status Publikasi": d.status === "published" ? "Dipublikasikan" : "Draft", "Link Foto": text(d.coverImageUrl), "Link Berita": "",
        "Tanggal Publikasi": dateOut(d.publishedDate), "Keterangan": "",
      })),
      ...anns.map((d: any) => ({
        "Firestore ID": d.id, "ID Konten": d.id, "Tanggal": "", "Jenis": "Pengumuman", "Judul": text(d.title), "Ringkasan": text(d.summary),
        "Lokasi": "", "Penanggung Jawab": "", "Status Publikasi": d.isActive === false ? "Draft" : "Dipublikasikan", "Link Foto": "",
        "Link Berita": text(d.attachmentUrl), "Tanggal Publikasi": "", "Keterangan": "",
      })),
    ];
  } else if (sheet === "Agenda") {
    const docs = await readCollection("agendas");
    rows = docs.map((d: any) => ({
      "Firestore ID": d.id, "ID Agenda": d.id, "Tanggal Mulai": dateOut(d.date), "Tanggal Selesai": "", "Nama Agenda": text(d.title),
      "Lokasi": text(d.location), "Penanggung Jawab": text(d.organizer), "Jenis": "Kegiatan Masyarakat", "Status": text(d.status),
      "Tampil Website": yesNo(d.isPublic), "Keterangan": text(d.description),
    }));
  } else if (sheet === "UMKM") {
    const docs = await readCollection("umkm");
    rows = docs.map((d: any) => ({
      "Firestore ID": d.id, "ID UMKM": d.id, "Nama Usaha": text(d.name), "Nama Pemilik": text(d.ownerName), "NIK Pemilik": "",
      "Jenis Usaha": text(d.businessType), "Produk Utama": text(d.mainProduct), "Alamat": text(d.address), "RT": text(d.rt), "Kontak": text(d.phone),
      "Link Maps": text(d.mapsUrl), "Foto/Link": text(d.imageUrl), "Status": d.isActive === false ? "Tidak Aktif" : "Aktif", "Tampil Website": yesNo(d.isPublic), "Keterangan": "",
    }));
  } else if (sheet === "Fasilitas") {
    const docs = await readCollection("facilities");
    rows = docs.map((d: any) => ({
      "Firestore ID": d.id, "ID Fasilitas": d.id, "Kategori": text(d.category), "Nama Fasilitas": text(d.name), "Alamat": text(d.address), "RT": text(d.rt),
      "Link Maps/Koordinat": text(d.mapsUrl), "Kondisi": text(d.condition), "Pengelola": text(d.manager), "Status": text(d.status), "Foto/Link": text(d.imageUrl),
      "Tampil Website": yesNo(d.isPublic), "Keterangan": "",
    }));
  } else if (sheet === "Surat") {
    const docs = await readCollection("serviceRequests");
    rows = docs.map((d: any) => ({
      "Firestore ID": d.id, "ID Surat": text(d.ticketId) || d.id, "Tanggal Permohonan": dateOut(d.createdAt), "Nama Pemohon": text(d.name), "NIK": text(d.nik), "RT": text(d.rt),
      "Jenis Surat": text(d.letterType), "Keperluan": text(d.purpose), "Nomor Surat": text(d.letterNumber), "Status": text(d.status || "Baru"), "Petugas": text(d.staff),
      "Tanggal Selesai": dateOut(d.completedDate), "Link Dokumen": text(d.documentUrl), "URL Verifikasi": text(d.verificationUrl), "Keterangan": text(d.publicNote),
      "Tampil Cek Publik": yesNo(d.isPublicVerification),
    }));
  } else if (sheet === "Pengaduan") {
    const docs = await readCollection("complaints");
    rows = docs.map((d: any) => ({
      "Firestore ID": d.id, "ID Pengaduan": text(d.ticketId) || d.id, "Tanggal": dateOut(d.createdAt), "Nama Pelapor": text(d.name), "Kontak": text(d.phone), "RT": text(d.rt),
      "Kategori": text(d.category), "Isi Ringkas": text(d.message), "Lokasi": text(d.location), "Status": text(d.status || "Baru"), "Tindak Lanjut": text(d.followUp),
      "Petugas": text(d.staff), "Target Selesai": dateOut(d.targetDate), "Tanggal Selesai": dateOut(d.completedDate), "Keterangan": text(d.publicNote),
      "Tampil Statistik Publik": "Tidak",
    }));
  } else {
    return NextResponse.json({ ok: false, error: `Sheet ${sheet} belum didukung.` }, { status: 400 });
  }
  return NextResponse.json({ ok: true, sheet, rows });
}
