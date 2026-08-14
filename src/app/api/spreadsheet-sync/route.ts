import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SheetRow = Record<string, unknown>;

type SyncPayload = {
  sheet: string;
  rows: SheetRow[];
};

function text(value: unknown) {
  return String(value ?? "").trim();
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function yes(value: unknown) {
  return ["ya", "yes", "true", "1", "aktif", "dipublikasikan"].includes(
    text(value).toLowerCase(),
  );
}

function normalizeRt(value: unknown) {
  const numeric = Number(text(value).replace(/\D/g, ""));
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > 99) return "";
  return String(numeric).padStart(2, "0");
}

function slugify(value: unknown) {
  return text(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function dateText(value: unknown) {
  const raw = text(value);
  if (!raw) return "";
  const match = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (match) {
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return raw;
}

function docId(prefix: string, primary: unknown, fallbackIndex: number) {
  const clean = slugify(primary);
  return clean ? `${prefix}-${clean}` : `${prefix}-${String(fallbackIndex + 1).padStart(4, "0")}`;
}

async function replaceManagedDocs(
  collectionName: string,
  sourceSheet: string,
  docs: Array<{ id: string; data: Record<string, unknown> }>,
) {
  const db = getAdminDb();
  const batchSize = 350;

  // Two-way mode intentionally uses upsert only. We do not delete Firestore
  // documents merely because a row is absent from the sheet. This prevents
  // an edit made in Admin from being erased before the next mirror pull.
  const writes = docs.map((item) => () =>
    db.collection(collectionName).doc(item.id).set(
      {
        ...item.data,
        syncSource: sourceSheet,
        syncedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    ),
  );

  for (let i = 0; i < writes.length; i += batchSize) {
    await Promise.all(writes.slice(i, i + batchSize).map((run) => run()));
  }

  return { written: docs.length, deleted: 0 };
}

async function syncRt(rows: SheetRow[]) {
  const docs = rows
    .map((row, index) => {
      const number = normalizeRt(row["RT"]);
      if (!number) return null;
      return {
        id: text(row["Firestore ID"]) || `rt-${number}`,
        data: {
          number,
          chairmanName: text(row["Nama Ketua RT"]),
          phone: text(row["No. HP"]),
          area: text(row["Alamat/Pos RT"]),
          description: text(row["Keterangan"]),
          familyCount: numberValue(row["Jumlah KK"]),
          populationCount: numberValue(row["Jumlah Penduduk"]),
          maleCount: numberValue(row["Laki-laki"]),
          femaleCount: numberValue(row["Perempuan"]),
          order: Number(number),
          isActive: text(row["Status"]).toLowerCase() !== "tidak aktif",
        },
      };
    })
    .filter(Boolean) as Array<{ id: string; data: Record<string, unknown> }>;

  const result = await replaceManagedDocs("rts", "Data RT", docs);
  const totals = docs.reduce(
    (acc, item) => {
      acc.population += numberValue(item.data.populationCount);
      acc.families += numberValue(item.data.familyCount);
      acc.male += numberValue(item.data.maleCount);
      acc.female += numberValue(item.data.femaleCount);
      return acc;
    },
    { population: 0, families: 0, male: 0, female: 0 },
  );

  await getAdminDb().collection("villageStats").doc("main").set(
    {
      ...totals,
      rtCount: docs.filter((item) => item.data.isActive !== false).length,
      syncSource: "Data RT",
      syncedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return result;
}

async function syncOfficials(rows: SheetRow[]) {
  const docs = rows
    .filter((row) => text(row["Nama"]))
    .map((row, index) => ({
      id: text(row["Firestore ID"]) || docId("official", row["Nama"], index),
      data: {
        name: text(row["Nama"]),
        title: text(row["Jabatan"]),
        category: "Kelurahan",
        photoUrl: text(row["Foto/Link"]),
        phone: text(row["Kontak"]),
        description: text(row["Keterangan"]),
        termStart: dateText(row["Mulai Menjabat"]),
        termEnd: dateText(row["Akhir Menjabat"]),
        order: numberValue(row["Urutan Website"]) || index + 1,
        isActive: yes(row["Tampil Website"]) && text(row["Status"]).toLowerCase() !== "tidak aktif",
      },
    }));
  return replaceManagedDocs("officials", "Pemerintahan", docs);
}

async function syncContent(rows: SheetRow[]) {
  const postDocs: Array<{ id: string; data: Record<string, unknown> }> = [];
  const announcementDocs: Array<{ id: string; data: Record<string, unknown> }> = [];

  rows.forEach((row, index) => {
    const title = text(row["Judul"]);
    if (!title) return;
    const kind = text(row["Jenis"]).toLowerCase();
    const published = text(row["Status Publikasi"]).toLowerCase() === "dipublikasikan";

    if (kind === "pengumuman") {
      announcementDocs.push({
        id: text(row["Firestore ID"]) || docId("announcement", row["ID Konten"] || title, index),
        data: {
          title,
          summary: text(row["Ringkasan"]),
          attachmentUrl: text(row["Link Berita"]),
          priority: "normal",
          isActive: published,
          order: index + 1,
        },
      });
      return;
    }

    if (kind === "berita" || kind === "kegiatan") {
      const slug = slugify(title) || `berita-${index + 1}`;
      postDocs.push({
        id: text(row["Firestore ID"]) || docId("post", row["ID Konten"] || slug, index),
        data: {
          title,
          slug,
          summary: text(row["Ringkasan"]),
          content: text(row["Ringkasan"]),
          coverImageUrl: text(row["Link Foto"]),
          category: kind === "kegiatan" ? "Masyarakat" : "Informasi",
          authorName: text(row["Penanggung Jawab"]) || "Kelurahan Amborawang Darat",
          publishedDate: dateText(row["Tanggal Publikasi"] || row["Tanggal"]),
          status: published ? "published" : "draft",
          isFeatured: false,
          order: index + 1,
        },
      });
    }
  });

  const posts = await replaceManagedDocs("posts", "Kegiatan", postDocs);
  const announcements = await replaceManagedDocs(
    "announcements",
    "Kegiatan",
    announcementDocs,
  );
  return { posts, announcements };
}

async function syncAgendas(rows: SheetRow[]) {
  const docs = rows
    .filter((row) => text(row["Nama Agenda"]))
    .map((row, index) => {
      const rawStatus = text(row["Status"]).toLowerCase();
      const status =
        rawStatus === "selesai"
          ? "selesai"
          : rawStatus === "dibatalkan"
            ? "dibatalkan"
            : "akan-datang";
      return {
        id: text(row["Firestore ID"]) || docId("agenda", row["ID Agenda"] || row["Nama Agenda"], index),
        data: {
          title: text(row["Nama Agenda"]),
          date: dateText(row["Tanggal Mulai"]),
          time: "",
          location: text(row["Lokasi"]),
          organizer: text(row["Penanggung Jawab"]),
          description: text(row["Keterangan"]),
          status,
          order: index + 1,
          isPublic: yes(row["Tampil Website"]),
        },
      };
    });
  return replaceManagedDocs("agendas", "Agenda", docs);
}

async function syncGenericPublic(
  sheetName: "UMKM" | "Fasilitas",
  collectionName: "umkm" | "facilities",
  rows: SheetRow[],
) {
  const docs = rows
    .filter((row) => {
      const key = sheetName === "UMKM" ? "Nama Usaha" : "Nama Fasilitas";
      return Boolean(text(row[key]));
    })
    .map((row, index) => {
      if (sheetName === "UMKM") {
        return {
          id: text(row["Firestore ID"]) || docId("umkm", row["ID UMKM"] || row["Nama Usaha"], index),
          data: {
            name: text(row["Nama Usaha"]),
            businessType: text(row["Jenis Usaha"]),
            mainProduct: text(row["Produk Utama"]),
            address: text(row["Alamat"]),
            rt: normalizeRt(row["RT"]),
            phone: text(row["Kontak"]),
            mapsUrl: text(row["Link Maps"]),
            imageUrl: text(row["Foto/Link"]),
            isActive: text(row["Status"]).toLowerCase() === "aktif",
            isPublic: yes(row["Tampil Website"]),
            order: index + 1,
          },
        };
      }
      return {
        id: text(row["Firestore ID"]) || docId("facility", row["ID Fasilitas"] || row["Nama Fasilitas"], index),
        data: {
          category: text(row["Kategori"]),
          name: text(row["Nama Fasilitas"]),
          address: text(row["Alamat"]),
          rt: normalizeRt(row["RT"]),
          mapsUrl: text(row["Link Maps/Koordinat"]),
          condition: text(row["Kondisi"]),
          manager: text(row["Pengelola"]),
          status: text(row["Status"]),
          imageUrl: text(row["Foto/Link"]),
          isPublic: yes(row["Tampil Website"]),
          order: index + 1,
        },
      };
    });
  return replaceManagedDocs(collectionName, sheetName, docs);
}


async function syncServiceRequests(rows: SheetRow[]) {
  const db = getAdminDb();
  let written = 0;
  for (const row of rows) {
    const ticketId = text(row["ID Surat"]).toUpperCase();
    if (!ticketId || !/^SR-[A-Z0-9-]+$/.test(ticketId)) continue;
    const id = text(row["Firestore ID"]) || ticketId;
    await db.collection("serviceRequests").doc(id).set({
      ticketId: ticketId,
      name: text(row["Nama Pemohon"]),
      nik: text(row["NIK"]).replace(/\D/g, ""),
      rt: normalizeRt(row["RT"]),
      letterType: text(row["Jenis Surat"]),
      purpose: text(row["Keperluan"]),
      letterNumber: text(row["Nomor Surat"]),
      status: text(row["Status"]) || "Baru",
      staff: text(row["Petugas"]),
      completedDate: dateText(row["Tanggal Selesai"]),
      publicNote: text(row["Keterangan"]),
      documentUrl: text(row["Link Dokumen"]),
      verificationUrl: text(row["URL Verifikasi"]),
      isPublicVerification: yes(row["Tampil Cek Publik"]),
      syncSource: "Surat",
      syncedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    written += 1;
  }
  return { written };
}

async function syncComplaints(rows: SheetRow[]) {
  const db = getAdminDb();
  let written = 0;
  for (const row of rows) {
    const ticketId = text(row["ID Pengaduan"]).toUpperCase();
    if (!ticketId || !/^PG-[A-Z0-9-]+$/.test(ticketId)) continue;
    const id = text(row["Firestore ID"]) || ticketId;
    await db.collection("complaints").doc(id).set({
      ticketId: ticketId,
      name: text(row["Nama Pelapor"]),
      phone: text(row["Kontak"]),
      rt: normalizeRt(row["RT"]),
      category: text(row["Kategori"]),
      message: text(row["Isi Ringkas"]),
      location: text(row["Lokasi"]),
      status: text(row["Status"]) || "Baru",
      followUp: text(row["Tindak Lanjut"]),
      staff: text(row["Petugas"]),
      completedDate: dateText(row["Tanggal Selesai"]),
      publicNote: text(row["Keterangan"]),
      syncSource: "Pengaduan",
      syncedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    written += 1;
  }
  return { written };
}

export async function POST(request: NextRequest) {
  try {
    const expectedSecret = process.env.SPREADSHEET_SYNC_SECRET?.trim();
    if (!expectedSecret) {
      return NextResponse.json(
        { ok: false, error: "SPREADSHEET_SYNC_SECRET belum diatur." },
        { status: 503 },
      );
    }

    if (request.headers.get("x-sync-secret") !== expectedSecret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await request.json()) as SyncPayload;
    if (!payload?.sheet || !Array.isArray(payload.rows)) {
      return NextResponse.json({ ok: false, error: "Payload tidak valid." }, { status: 400 });
    }

    let result: unknown;
    switch (payload.sheet) {
      case "Data RT":
        result = await syncRt(payload.rows);
        break;
      case "Pemerintahan":
        result = await syncOfficials(payload.rows);
        break;
      case "Kegiatan":
        result = await syncContent(payload.rows);
        break;
      case "Agenda":
        result = await syncAgendas(payload.rows);
        break;
      case "UMKM":
        result = await syncGenericPublic("UMKM", "umkm", payload.rows);
        break;
      case "Fasilitas":
        result = await syncGenericPublic("Fasilitas", "facilities", payload.rows);
        break;
      case "Surat":
        result = await syncServiceRequests(payload.rows);
        break;
      case "Pengaduan":
        result = await syncComplaints(payload.rows);
        break;
      default:
        return NextResponse.json(
          { ok: false, error: `Sheet ${payload.sheet} belum diizinkan untuk sinkronisasi.` },
          { status: 400 },
        );
    }

    return NextResponse.json({ ok: true, sheet: payload.sheet, result });
  } catch (error) {
    console.error("Spreadsheet sync error", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Sinkronisasi gagal.",
      },
      { status: 500 },
    );
  }
}
