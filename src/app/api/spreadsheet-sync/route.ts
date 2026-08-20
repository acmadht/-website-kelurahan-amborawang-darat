import { NextRequest, NextResponse } from "next/server";
import { setDocument } from "@/lib/firebase/firestore-rest-admin";
import { recalculateAdministrativeData } from "@/lib/admin/administrative-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SheetRow = Record<string, unknown>;
type SyncPayload = { sheet: string; rows: SheetRow[] };

const text = (v: unknown) => String(v ?? "").trim();
const numberValue = (v: unknown) => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const parsed = Number(text(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};
const yes = (v: unknown) => ["ya", "yes", "true", "1", "aktif", "dipublikasikan", "published"].includes(text(v).toLowerCase());
const listValue = (v: unknown) => text(v).split(/\r?\n|\s*\|\s*/).map((x) => x.trim()).filter(Boolean);
const normalizeRt = (v: unknown) => {
  const numeric = Number(text(v).replace(/\D/g, ""));
  return Number.isInteger(numeric) && numeric > 0 && numeric < 100 ? String(numeric).padStart(2, "0") : "";
};
const slugify = (v: unknown) => text(v).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);
const dateText = (v: unknown) => {
  const raw = text(v);
  if (!raw) return "";
  const m = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : raw;
};
const docId = (prefix: string, primary: unknown, index: number) => {
  const clean = slugify(primary);
  return clean ? `${prefix}-${clean}` : `${prefix}-${String(index + 1).padStart(4, "0")}`;
};

async function upsertDocs(collectionName: string, sourceSheet: string, docs: Array<{ id: string; data: Record<string, unknown> }>) {
  for (const item of docs) {
    const now = new Date().toISOString();
    await setDocument(collectionName, item.id, {
      ...item.data,
      syncSource: sourceSheet,
      syncedAt: now,
      updatedAt: now,
    }, true);
  }
  return { written: docs.length };
}

async function syncRt(rows: SheetRow[]) {
  const docs = rows.map((row, index) => {
    const number = normalizeRt(row["RT"]);
    if (!number) return null;
    return {
      id: text(row["Firestore ID"]) || `rt-${number}`,
      data: {
        number,
        chairmanName: text(row["Nama Ketua RT"]),
        photoUrl: text(row["Foto Ketua RT"]),
        phone: text(row["No. HP"]),
        area: text(row["Alamat/Pos RT"] || row["Alamat / Area RT"]),
        populationCount: numberValue(row["Jumlah Penduduk"]),
        familyCount: numberValue(row["Jumlah KK"]),
        maleCount: numberValue(row["Laki-laki"]),
        femaleCount: numberValue(row["Perempuan"]),
        houseCount: numberValue(row["Jumlah Rumah"]),
        toddlerCount: numberValue(row["Jumlah Balita"]),
        elderlyCount: numberValue(row["Jumlah Lansia"]),
        facilities: listValue(row["Fasilitas Utama RT"]),
        description: text(row["Keterangan"] || row["Keterangan Wilayah"]),
        order: numberValue(row["Urutan"]) || Number(number),
        isActive: row["Tampil Website"] !== undefined ? yes(row["Tampil Website"]) : text(row["Status"]).toLowerCase() !== "tidak aktif",
      },
    };
  }).filter(Boolean) as Array<{ id: string; data: Record<string, unknown> }>;

  const result = await upsertDocs("rts", "Data RT", docs);
  const totals = docs.reduce((a, d) => {
    a.population += numberValue(d.data.populationCount); a.families += numberValue(d.data.familyCount);
    a.male += numberValue(d.data.maleCount); a.female += numberValue(d.data.femaleCount);
    return a;
  }, { population: 0, families: 0, male: 0, female: 0 });
  await setDocument("villageStats", "main", { ...totals, rtCount: docs.filter((d) => d.data.isActive !== false).length, updatedAt: new Date().toISOString() }, true);
  await recalculateAdministrativeData();
  return result;
}

async function syncOfficials(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["Nama"] || r["Nama Lengkap"])).map((r, i) => ({
    id: text(r["Firestore ID"]) || docId("official", r["Nama"] || r["Nama Lengkap"], i),
    data: {
      name: text(r["Nama"] || r["Nama Lengkap"]), title: text(r["Jabatan"]), category: text(r["Kategori"]) || "Kelurahan",
      unit: text(r["Unit / Bagian Penempatan"]), photoUrl: text(r["Foto/Link"] || r["Foto"]), phone: text(r["Kontak"] || r["Nomor Kontak"]),
      description: text(r["Keterangan"] || r["Deskripsi / Keterangan"]), termStart: dateText(r["Mulai Menjabat"] || r["Awal Masa Jabatan"]),
      termEnd: dateText(r["Akhir Menjabat"] || r["Akhir Masa Jabatan"]), order: numberValue(r["Urutan Website"] || r["Urutan Tampil"]) || i + 1,
      isActive: r["Tampil Website"] !== undefined ? yes(r["Tampil Website"]) : text(r["Status"]).toLowerCase() !== "tidak aktif",
    }
  }));
  return upsertDocs("officials", "Pemerintahan", docs);
}

async function syncPosts(rows: SheetRow[], source = "Berita") {
  const docs = rows.filter((r) => text(r["Judul"])).map((r, i) => {
    const title = text(r["Judul"]); const slug = text(r["Slug"]) || slugify(title) || `berita-${i + 1}`;
    return {
      id: text(r["Firestore ID"]) || docId("post", r["ID Konten"] || slug, i), data: {
        title, slug, summary: text(r["Ringkasan"]), content: text(r["Isi Berita"] || r["Isi"] || r["Ringkasan"]),
        coverImageUrl: text(r["Gambar Utama"] || r["Link Foto"]), category: text(r["Kategori"]) || "Informasi",
        authorName: text(r["Nama Penulis"] || r["Penanggung Jawab"]) || "Kelurahan Amborawang Darat",
        publishedDate: dateText(r["Tanggal Publikasi"] || r["Tanggal"]), publishedTime: text(r["Waktu Publikasi (WITA)"]),
        status: text(r["Status"]).toLowerCase() || (text(r["Status Publikasi"]).toLowerCase() === "dipublikasikan" ? "published" : "draft"),
        isFeatured: yes(r["Berita Unggulan"]), order: numberValue(r["Urutan"]) || i + 1,
      }
    };
  });
  return upsertDocs("posts", source, docs);
}

async function syncAnnouncements(rows: SheetRow[], source = "Pengumuman") {
  const docs = rows.filter((r) => text(r["Judul"])).map((r, i) => ({
    id: text(r["Firestore ID"]) || docId("announcement", r["Judul"], i), data: {
      title: text(r["Judul"]), summary: text(r["Isi Singkat"] || r["Ringkasan"]), imageUrl: text(r["Gambar"] || r["Link Foto"]), attachmentUrl: text(r["URL Lampiran"] || r["Link Berita"]),
      priority: text(r["Prioritas"]) || "normal", validUntil: dateText(r["Berlaku Sampai"]), order: numberValue(r["Urutan"]) || i + 1,
      isActive: r["Status Aktif"] !== undefined ? yes(r["Status Aktif"]) : text(r["Status Publikasi"]).toLowerCase() === "dipublikasikan",
    }
  }));
  return upsertDocs("announcements", source, docs);
}

async function syncLegacyKegiatan(rows: SheetRow[]) {
  const posts = rows.filter((r) => ["berita", "kegiatan"].includes(text(r["Jenis"]).toLowerCase()));
  const anns = rows.filter((r) => text(r["Jenis"]).toLowerCase() === "pengumuman");
  const p = await syncPosts(posts, "Kegiatan"); const a = await syncAnnouncements(anns, "Kegiatan"); return { posts: p, announcements: a };
}

async function syncAgendas(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["Nama Kegiatan"] || r["Nama Agenda"] || r["Judul"])).map((r, i) => ({
    id: text(r["Firestore ID"]) || docId("agenda", r["ID Agenda"] || r["Nama Kegiatan"] || r["Nama Agenda"], i), data: {
      title: text(r["Nama Kegiatan"] || r["Nama Agenda"] || r["Judul"]), date: dateText(r["Tanggal"] || r["Tanggal Mulai"]), time: text(r["Waktu"]),
      location: text(r["Lokasi"]), organizer: text(r["Penyelenggara"] || r["Penanggung Jawab"]), description: text(r["Deskripsi"] || r["Keterangan"]),
      status: text(r["Status"]) || "akan-datang", imageUrl: text(r["Gambar"]), order: numberValue(r["Urutan"]) || i + 1,
      isPublic: r["Tampil Website"] !== undefined ? yes(r["Tampil Website"]) : true,
    }
  }));
  return upsertDocs("agendas", "Agenda", docs);
}

async function syncServices(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["Nama Layanan"])).map((r, i) => ({
    id: text(r["Firestore ID"]) || docId("service", r["Slug"] || r["Nama Layanan"], i), data: {
      name: text(r["Nama Layanan"]), slug: text(r["Slug"]) || slugify(r["Nama Layanan"]), category: text(r["Kategori"]), icon: text(r["Singkatan Ikon"]),
      summary: text(r["Deskripsi Singkat"]), requirements: listValue(r["Persyaratan"]), procedures: listValue(r["Prosedur"]), duration: text(r["Waktu Penyelesaian"]),
      cost: text(r["Biaya"]), contact: text(r["Kontak"]), documentUrl: text(r["URL Dokumen"]), order: numberValue(r["Urutan"]) || i + 1,
      isFeatured: yes(r["Tampil di Beranda"]), isActive: r["Layanan Aktif"] === undefined ? true : yes(r["Layanan Aktif"]),
    }
  }));
  return upsertDocs("services", "Layanan", docs);
}

async function syncDocuments(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["Judul Dokumen"])).map((r, i) => ({
    id: text(r["Firestore ID"]) || docId("document", r["Judul Dokumen"], i), data: {
      title: text(r["Judul Dokumen"]), category: text(r["Kategori"]), year: text(r["Tahun"]), description: text(r["Deskripsi"]), fileUrl: text(r["URL File"]),
      fileType: text(r["Jenis File"]) || "PDF", isActive: r["Status Aktif"] === undefined ? true : yes(r["Status Aktif"]), order: numberValue(r["Urutan"]) || i + 1,
    }
  }));
  return upsertDocs("documents", "Dokumen", docs);
}

async function syncHero(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["Judul"])).map((r, i) => ({
    id: text(r["Firestore ID"]) || docId("hero", r["Judul"], i), data: {
      title: text(r["Judul"]), subtitle: text(r["Deskripsi"]), imageUrl: text(r["Gambar Banner"]), primaryButtonText: text(r["Teks Tombol Utama"]),
      primaryButtonUrl: text(r["Tautan Tombol Utama"]), secondaryButtonText: text(r["Teks Tombol Kedua"]), secondaryButtonUrl: text(r["Tautan Tombol Kedua"]),
      order: numberValue(r["Urutan"]) || i + 1, isActive: r["Status"] === undefined ? true : yes(r["Status"]),
    }
  }));
  return upsertDocs("heroSlides", "Hero", docs);
}

async function syncGalleryAlbums(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["Judul Album"])).map((r, i) => ({
    id: text(r["Firestore ID"]) || docId("gallery", r["Slug"] || r["Judul Album"], i), data: {
      title: text(r["Judul Album"]), slug: text(r["Slug"]) || slugify(r["Judul Album"]), category: text(r["Kategori"]), description: text(r["Deskripsi"]),
      coverImageUrl: text(r["Foto Sampul"]), location: text(r["Lokasi"]), eventDate: dateText(r["Tanggal Kegiatan"]), isFeatured: yes(r["Tampil di Beranda"]),
      status: text(r["Status"]) || "published", order: numberValue(r["Urutan"]) || i + 1,
    }
  }));
  return upsertDocs("galleryAlbums", "Galeri Album", docs);
}

async function syncUmkm(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["Nama Usaha"])).map((r, i) => ({
    id: text(r["Firestore ID"]) || docId("umkm", r["ID UMKM"] || r["Nama Usaha"], i), data: {
      name: text(r["Nama Usaha"]), ownerName: text(r["Nama Pemilik"]), ownerNik: text(r["NIK Pemilik"]).replace(/\D/g, ""), businessType: text(r["Jenis Usaha"]), mainProduct: text(r["Produk Utama"]), address: text(r["Alamat"]),
      rt: normalizeRt(r["RT"]), phone: text(r["Kontak"]), mapsUrl: text(r["Link Maps"]), imageUrl: text(r["Foto/Link"]), isActive: text(r["Status"]).toLowerCase() !== "tidak aktif",
      isPublic: r["Tampil Website"] === undefined ? true : yes(r["Tampil Website"]), order: numberValue(r["Urutan"]) || i + 1, note: text(r["Keterangan"]),
    }
  }));
  const result = await upsertDocs("umkm", "UMKM", docs);
  await recalculateAdministrativeData();
  return result;
}

async function syncFacilities(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["Nama Fasilitas"])).map((r, i) => ({
    id: text(r["Firestore ID"]) || docId("facility", r["ID Fasilitas"] || r["Nama Fasilitas"], i), data: {
      category: text(r["Kategori"]), name: text(r["Nama Fasilitas"]), address: text(r["Alamat"]), rt: normalizeRt(r["RT"]), mapsUrl: text(r["Link Maps/Koordinat"]),
      condition: text(r["Kondisi"]), manager: text(r["Pengelola"]), status: text(r["Status"]), imageUrl: text(r["Foto/Link"]), isPublic: r["Tampil Website"] === undefined ? true : yes(r["Tampil Website"]), order: numberValue(r["Urutan"]) || i + 1, note: text(r["Keterangan"]),
    }
  }));
  const result = await upsertDocs("facilities", "Fasilitas", docs);
  await recalculateAdministrativeData();
  return result;
}

async function syncServiceRequests(rows: SheetRow[]) {
  let written = 0;
  for (const r of rows) {
    const ticketId = text(r["ID Surat"]).toUpperCase(); if (!ticketId) continue;
    const id = text(r["Firestore ID"]) || ticketId;
    const now = new Date().toISOString();
    await setDocument("serviceRequests", id, {
      ticketId, name: text(r["Nama Pemohon"]), nik: text(r["NIK"]).replace(/\D/g, ""), rt: normalizeRt(r["RT"]),
      letterType: text(r["Jenis Surat"]), purpose: text(r["Keperluan"]), letterNumber: text(r["Nomor Surat"]), status: text(r["Status"]) || "Baru", staff: text(r["Petugas"]),
      completedDate: dateText(r["Tanggal Selesai"]), documentUrl: text(r["Link Dokumen"]), verificationUrl: text(r["URL Verifikasi"]), publicNote: text(r["Keterangan"]),
      isPublicVerification: yes(r["Tampil Cek Publik"]), syncSource: "Surat", syncedAt: now, updatedAt: now
    }, true); written++;
  }
  await recalculateAdministrativeData();
  return { written };
}

async function syncComplaints(rows: SheetRow[]) {
  let written = 0;
  for (const r of rows) {
    const ticketId = text(r["ID Pengaduan"]).toUpperCase(); if (!ticketId) continue;
    const id = text(r["Firestore ID"]) || ticketId;
    const now = new Date().toISOString();
    await setDocument("complaints", id, {
      ticketId, name: text(r["Nama Pelapor"]), phone: text(r["Kontak"]), rt: normalizeRt(r["RT"]), category: text(r["Kategori"]), message: text(r["Isi Ringkas"]), location: text(r["Lokasi"]),
      status: text(r["Status"]) || "Baru", followUp: text(r["Tindak Lanjut"]), staff: text(r["Petugas"]), targetDate: dateText(r["Target Selesai"]), completedDate: dateText(r["Tanggal Selesai"]), publicNote: text(r["Keterangan"]),
      showInPublicStats: yes(r["Tampil Statistik Publik"]), syncSource: "Pengaduan", syncedAt: now, updatedAt: now
    }, true); written++;
  }
  await recalculateAdministrativeData();
  return { written };
}


async function syncResidents(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["ID Penduduk"] || r["NIK"] || r["Nama Lengkap"])).map((r, i) => ({
    id: text(r["ID Penduduk"]) || docId("resident", r["NIK"] || r["Nama Lengkap"], i),
    data: {
      residentId: text(r["ID Penduduk"]) || `PD-${String(i + 1).padStart(4, "0")}`,
      nik: text(r["NIK"]).replace(/\D/g, ""),
      familyCardNumber: text(r["No. KK"]).replace(/\D/g, ""),
      fullName: text(r["Nama Lengkap"]),
      gender: text(r["Jenis Kelamin"]),
      birthPlace: text(r["Tempat Lahir"]),
      birthDate: dateText(r["Tanggal Lahir"]),
      religion: text(r["Agama"]),
      maritalStatus: text(r["Status Perkawinan"]),
      education: text(r["Pendidikan"]),
      occupation: text(r["Pekerjaan"]),
      rt: normalizeRt(r["RT"]),
      address: text(r["Alamat"]),
      domicileStatus: text(r["Status Domisili"]) || "Aktif",
      arrivalDate: dateText(r["Tanggal Masuk"]),
      departureDate: dateText(r["Tanggal Keluar"]),
      note: text(r["Keterangan"]),
    },
  }));
  const result = await upsertDocs("residents", "Penduduk", docs);
  await recalculateAdministrativeData();
  return result;
}

async function syncFamilies(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["No. KK"] || r["Kepala Keluarga"])).map((r, i) => ({
    id: docId("family", r["No. KK"] || r["Kepala Keluarga"], i),
    data: {
      familyCardNumber: text(r["No. KK"]).replace(/\D/g, ""),
      headName: text(r["Kepala Keluarga"]),
      rt: normalizeRt(r["RT"]),
      address: text(r["Alamat"]),
      housingStatus: text(r["Status Rumah"]),
      memberCount: numberValue(r["Jumlah Anggota"]),
      inputDate: dateText(r["Tanggal Input"]),
      note: text(r["Keterangan"]),
    },
  }));
  const result = await upsertDocs("families", "Keluarga", docs);
  await recalculateAdministrativeData();
  return result;
}

async function syncPopulationMutations(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["ID Mutasi"] || r["Tanggal"] || r["Nama"])).map((r, i) => ({
    id: text(r["ID Mutasi"]) || docId("mutation", `${text(r["Tanggal"])}-${text(r["NIK"] || r["Nama"])}`, i),
    data: {
      mutationId: text(r["ID Mutasi"]) || `MT-${String(i + 1).padStart(4, "0")}`,
      date: dateText(r["Tanggal"]),
      nik: text(r["NIK"]).replace(/\D/g, ""),
      name: text(r["Nama"]),
      mutationType: text(r["Jenis Mutasi"]),
      originRt: normalizeRt(r["RT Asal"]),
      destinationRt: normalizeRt(r["RT Tujuan"]),
      address: text(r["Alamat Asal/Tujuan"]),
      documentNumber: text(r["No. Dokumen"]),
      officer: text(r["Petugas"]),
      note: text(r["Keterangan"]),
    },
  }));
  const result = await upsertDocs("populationMutations", "Mutasi", docs);
  await recalculateAdministrativeData();
  return result;
}

async function syncSocialAssistance(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["ID Data"] || r["Nama Penerima"] || r["Jenis Bantuan"])).map((r, i) => ({
    id: text(r["ID Data"]) || docId("aid", `${text(r["NIK"] || r["Nama Penerima"])}-${text(r["Jenis Bantuan"])}`, i),
    data: {
      recordId: text(r["ID Data"]) || `BS-${String(i + 1).padStart(4, "0")}`,
      recipientName: text(r["Nama Penerima"]),
      nik: text(r["NIK"]).replace(/\D/g, ""),
      familyCardNumber: text(r["No. KK"]).replace(/\D/g, ""),
      rt: normalizeRt(r["RT"]),
      aidType: text(r["Jenis Bantuan"]),
      period: text(r["Periode"]),
      receiptStatus: text(r["Status Penerimaan"]),
      date: dateText(r["Tanggal"]),
      programSource: text(r["Sumber Program"]),
      note: text(r["Keterangan"]),
    },
  }));
  const result = await upsertDocs("socialAssistance", "Bansos", docs);
  await recalculateAdministrativeData();
  return result;
}

async function syncInventory(rows: SheetRow[]) {
  const docs = rows.filter((r) => text(r["ID Barang"] || r["Nama Barang"])).map((r, i) => ({
    id: text(r["ID Barang"]) || docId("inventory", r["Kode Barang"] || r["Nama Barang"], i),
    data: {
      itemId: text(r["ID Barang"]) || `INV-${String(i + 1).padStart(4, "0")}`,
      itemName: text(r["Nama Barang"]),
      category: text(r["Kategori"]),
      itemCode: text(r["Kode Barang"]),
      quantity: numberValue(r["Jumlah"]),
      unit: text(r["Satuan"]),
      condition: text(r["Kondisi"]),
      location: text(r["Lokasi"]),
      rt: normalizeRt(r["RT"] || r["RT Lokasi"]),
      acquisitionYear: text(r["Tahun Perolehan"]),
      fundingSource: text(r["Sumber Dana"]),
      personInCharge: text(r["Penanggung Jawab"]),
      note: text(r["Keterangan"]),
    },
  }));
  const result = await upsertDocs("inventory", "Inventaris", docs);
  await recalculateAdministrativeData();
  return result;
}

async function syncSingleton(collectionName: string, documentId: string, sheetName: string, row: SheetRow, mapping: Record<string, string | { key: string; type?: "number" | "boolean" | "list" }>) {
  const payload: Record<string, unknown> = {};
  for (const [header, spec] of Object.entries(mapping)) {
    const conf = typeof spec === "string" ? { key: spec } : spec;
    if (!(header in row)) continue;
    let v: unknown = row[header];
    if (conf.type === "number") v = numberValue(v); else if (conf.type === "boolean") v = yes(v); else if (conf.type === "list") v = listValue(v); else v = text(v);
    payload[conf.key] = v;
  }
  const now = new Date().toISOString();
  await setDocument(collectionName, documentId, { ...payload, syncSource: sheetName, syncedAt: now, updatedAt: now }, true);
  return { written: Object.keys(payload).length ? 1 : 0 };
}

const HOME_MAP = { "Label Status Portal": "portalStatus", "Label Kecil Hero": "heroEyebrow", "Label Sambutan / Profil Singkat": "welcomeEyebrow", "Judul Sambutan": "welcomeTitle", "Paragraf Sambutan": "welcomeText", "Paragraf Pendukung": "welcomeSecondText", "Teks Aspirasi / Pengaduan": "complaintText", "Label Bagian Layanan": "servicesEyebrow", "Judul Bagian Layanan": "servicesTitle", "Label Informasi Terkini": "infoEyebrow", "Judul Informasi Terkini": "infoTitle", "Label Panel Bantuan": "ctaKicker", "Judul Panel Bantuan": "ctaTitle", "Deskripsi Panel Bantuan": "ctaText" };
const REGION_MAP = { "Luas Wilayah": "area", "Sumber / Catatan Luas": "areaNote", "Jumlah Penduduk": "population", "Sumber / Catatan Penduduk": "populationNote", "Jarak ke Kecamatan Samboja Barat": "districtDistance", "Jarak ke Kantor Kecamatan Samboja Barat": "districtDistance", "Sumber / Catatan Jarak": "districtDistanceNote", "Batas Utara": "northBoundary", "Batas Timur": "eastBoundary", "Batas Selatan": "southBoundary", "Batas Barat": "westBoundary", "Gambaran Wilayah": "geography", "Detail Geografi / Luas": "geographyDetail", "Konektivitas Wilayah": "connectivity", "Catatan Dasar Batas Wilayah": "boundaryNote", "Judul Karakter 1": "climateTitle", "Isi Karakter 1": "climateText", "Judul Karakter 2": "corridorTitle", "Isi Karakter 2": "corridorText", "Judul Karakter 3": "landTitle", "Isi Karakter 3": "landText", "Peta Administratif": "mapImageUrl" };
const SETTINGS_MAP: Record<string, any> = { "Nama Website": "siteName", "Nama Kelurahan": "villageName", "Nama Kecamatan": "subdistrictName", "Nama Kabupaten / Kota": "regencyName", "Nama Provinsi": "provinceName", "Slogan": "tagline", "Logo": "logoUrl", "Favicon / Ikon Browser": "faviconUrl", "Instagram": "instagramUrl", "Facebook": "facebookUrl", "YouTube": "youtubeUrl", "Teks Footer": "footerText", "Judul SEO": "seoTitle", "Deskripsi SEO": "seoDescription", "Kode Verifikasi Google Search Console": "googleSiteVerification", "Animasi Aktif": { key: "animationEnabled", type: "boolean" }, "Slider Otomatis": { key: "heroAutoplay", type: "boolean" }, "Interval Slider (ms)": { key: "heroInterval", type: "number" } };
const CONTACT_MAP: Record<string, any> = { "Alamat Kantor": "address", "Telepon": "phone", "WhatsApp": "whatsapp", "Email": "email", "Jam Pelayanan": "serviceHours", "URL Embed Google Maps": "mapsEmbedUrl", "Foto Kantor": "officeImageUrl", "Tombol WhatsApp Aktif": { key: "whatsappEnabled", type: "boolean" } };
const PROFILE_MAP: Record<string, any> = { "Label Hero": "heroEyebrow", "Judul Hero": "heroTitle", "Deskripsi Hero": "heroDescription", "Foto Utama": "imageUrl", "Judul Foto": "heroImageTitle", "Caption Foto": "heroImageCaption", "Kredit Foto": "heroImageCredit", "Label Ringkasan": "summaryEyebrow", "Nama Ringkasan": "summaryName", "Deskripsi Ringkasan": "summaryDescription", "Judul Sejarah": "historyTitle", "Sejarah": "history", "Catatan Sejarah": "historyCallout", "Label Timeline": "timelineEyebrow", "Judul Timeline": "timelineTitle", "Deskripsi Timeline": "timelineDescription", "Visi": "vision", "Catatan Visi": "visionNote", "Judul Misi": "missionTitle", "Misi": { key: "missions", type: "list" }, "Label Wilayah": "regionEyebrow", "Judul Wilayah": "regionTitle", "Geografi": "geography", "Peta Profil": "mapImageUrl", "Judul Peta": "mapTitle", "Ringkasan Batas": "boundaries", "Label Potensi": "potentialEyebrow", "Judul Potensi": "potentialTitle", "Narasi Potensi": "potential", "Label Fasilitas": "facilityEyebrow", "Judul Fasilitas": "facilityTitle", "Pengantar Fasilitas": "facilityIntro", "Teks Utama Fasilitas": "facilityLeadText", "Daftar Fasilitas": { key: "facilities", type: "list" }, "Label Prioritas": "priorityEyebrow", "Judul Prioritas": "priorityTitle", "Pengantar Prioritas": "priorityIntro", "Daftar Prioritas": { key: "priorities", type: "list" }, "Label Pembaruan": "updateKicker", "Judul Pembaruan": "updateTitle", "Teks Pembaruan": "updateText" };

async function syncProfileArray(field: string, rows: SheetRow[], mapper: (r: SheetRow) => Record<string, string> | null) {
  const data = rows.map(mapper).filter(Boolean);
  const now = new Date().toISOString();
  await setDocument("pages", "profil", { [field]: data, syncSource: `Profil:${field}`, syncedAt: now, updatedAt: now }, true);
  return { written: data.length };
}

export async function POST(request: NextRequest) {
  try {
    const expected = process.env.SPREADSHEET_SYNC_SECRET?.trim();
    if (!expected) return NextResponse.json({ ok: false, error: "SPREADSHEET_SYNC_SECRET belum diatur di Vercel." }, { status: 503 });
    if (request.headers.get("x-sync-secret") !== expected) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    const payload = await request.json() as SyncPayload;
    if (!payload?.sheet || !Array.isArray(payload.rows)) return NextResponse.json({ ok: false, error: "Payload tidak valid." }, { status: 400 });
    const rows = payload.rows;
    let result: unknown;
    switch (payload.sheet) {
      case "Data RT": result = await syncRt(rows); break;
      case "Pemerintahan": result = await syncOfficials(rows); break;
      case "Berita": result = await syncPosts(rows); break;
      case "Pengumuman": result = await syncAnnouncements(rows); break;
      case "Kegiatan": result = await syncLegacyKegiatan(rows); break;
      case "Agenda": result = await syncAgendas(rows); break;
      case "Layanan": result = await syncServices(rows); break;
      case "Dokumen": result = await syncDocuments(rows); break;
      case "Hero": result = await syncHero(rows); break;
      case "Galeri Album": result = await syncGalleryAlbums(rows); break;
      case "UMKM": result = await syncUmkm(rows); break;
      case "Fasilitas": result = await syncFacilities(rows); break;
      case "Surat": result = await syncServiceRequests(rows); break;
      case "Pengaduan": result = await syncComplaints(rows); break;
      case "Penduduk": result = await syncResidents(rows); break;
      case "Keluarga": result = await syncFamilies(rows); break;
      case "Mutasi": result = await syncPopulationMutations(rows); break;
      case "Bansos": result = await syncSocialAssistance(rows); break;
      case "Inventaris": result = await syncInventory(rows); break;
      case "Beranda": result = await syncSingleton("pages", "home", "Beranda", rows[0] || {}, HOME_MAP); break;
      case "Wilayah": result = await syncSingleton("pages", "wilayah", "Wilayah", rows[0] || {}, REGION_MAP); break;
      case "Pengaturan Website": result = await syncSingleton("siteSettings", "main", "Pengaturan Website", rows[0] || {}, SETTINGS_MAP); break;
      case "Kontak": result = await syncSingleton("siteSettings", "main", "Kontak", rows[0] || {}, CONTACT_MAP); break;
      case "Profil Website": result = await syncSingleton("pages", "profil", "Profil Website", rows[0] || {}, PROFILE_MAP); break;
      case "Profil Statistik": result = await syncProfileArray("stats", rows, (r) => text(r["Nilai"]) || text(r["Label"]) ? { value: text(r["Nilai"]), label: text(r["Label"]), note: text(r["Catatan"]) } : null); break;
      case "Profil Timeline": result = await syncProfileArray("timeline", rows, (r) => text(r["Tahun"]) || text(r["Judul"]) ? { year: text(r["Tahun"]), title: text(r["Judul"]), text: text(r["Isi"]) } : null); break;
      case "Profil Fakta Wilayah": result = await syncProfileArray("regionFacts", rows, (r) => text(r["Nilai"]) || text(r["Label"]) ? { value: text(r["Nilai"]), label: text(r["Label"]) } : null); break;
      case "Profil Batas": result = await syncProfileArray("boundaryItems", rows, (r) => text(r["Arah"]) || text(r["Wilayah Berbatasan"]) ? { direction: text(r["Arah"]), places: text(r["Wilayah Berbatasan"]) } : null); break;
      case "Profil Potensi": result = await syncProfileArray("potentials", rows, (r) => text(r["Judul"]) || text(r["Deskripsi"]) ? { title: text(r["Judul"]), text: text(r["Deskripsi"]) } : null); break;
      default: return NextResponse.json({ ok: false, error: `Sheet ${payload.sheet} belum diizinkan.` }, { status: 400 });
    }
    return NextResponse.json({ ok: true, sheet: payload.sheet, result });
  } catch (error) {
    console.error("Spreadsheet sync error", error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Sinkronisasi gagal." }, { status: 500 });
  }
}
