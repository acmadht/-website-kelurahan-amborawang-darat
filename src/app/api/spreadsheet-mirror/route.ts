import { NextRequest, NextResponse } from "next/server";
import { getDocument, listDocuments } from "@/lib/firebase/firestore-rest-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const text = (v: unknown) => String(v ?? "").trim();
function dateOut(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const maybe = value as { toDate?: () => Date };
    try { return maybe.toDate?.().toISOString().slice(0, 10) ?? ""; } catch { return ""; }
  }
  return "";
}
const yesNo = (v: unknown) => v === false ? "Tidak" : "Ya";
const listOut = (v: unknown) => Array.isArray(v) ? v.map((x) => text(x)).filter(Boolean).join("\n") : text(v);
async function readCollection(name: string) {
  return listDocuments(name, 5000);
}
async function readDoc(collectionName: string, id: string) {
  return getDocument(collectionName, id);
}

function singletonRow(data: any, mapping: Record<string, string | { key: string; type?: "boolean" | "list" }>) {
  const row: Record<string, unknown> = {};
  for (const [header, spec] of Object.entries(mapping)) {
    const conf = typeof spec === "string" ? { key: spec } : spec;
    const value = data?.[conf.key];
    row[header] = conf.type === "boolean" ? yesNo(value) : conf.type === "list" ? listOut(value) : text(value);
  }
  return row;
}

const HOME_MAP = { "Label Status Portal": "portalStatus", "Label Kecil Hero": "heroEyebrow", "Label Sambutan / Profil Singkat": "welcomeEyebrow", "Judul Sambutan": "welcomeTitle", "Paragraf Sambutan": "welcomeText", "Paragraf Pendukung": "welcomeSecondText", "Teks Aspirasi / Pengaduan": "complaintText", "Label Bagian Layanan": "servicesEyebrow", "Judul Bagian Layanan": "servicesTitle", "Label Informasi Terkini": "infoEyebrow", "Judul Informasi Terkini": "infoTitle", "Label Panel Bantuan": "ctaKicker", "Judul Panel Bantuan": "ctaTitle", "Deskripsi Panel Bantuan": "ctaText" };
const REGION_MAP = { "Luas Wilayah": "area", "Sumber / Catatan Luas": "areaNote", "Jumlah Penduduk": "population", "Sumber / Catatan Penduduk": "populationNote", "Jarak ke Kecamatan Samboja Barat": "districtDistance", "Jarak ke Kantor Kecamatan Samboja Barat": "districtDistance", "Sumber / Catatan Jarak": "districtDistanceNote", "Batas Utara": "northBoundary", "Batas Timur": "eastBoundary", "Batas Selatan": "southBoundary", "Batas Barat": "westBoundary", "Gambaran Wilayah": "geography", "Detail Geografi / Luas": "geographyDetail", "Konektivitas Wilayah": "connectivity", "Catatan Dasar Batas Wilayah": "boundaryNote", "Judul Karakter 1": "climateTitle", "Isi Karakter 1": "climateText", "Judul Karakter 2": "corridorTitle", "Isi Karakter 2": "corridorText", "Judul Karakter 3": "landTitle", "Isi Karakter 3": "landText", "Peta Administratif": "mapImageUrl" };
const SETTINGS_MAP: Record<string, any> = { "Nama Website": "siteName", "Nama Kelurahan": "villageName", "Nama Kecamatan": "subdistrictName", "Nama Kabupaten / Kota": "regencyName", "Nama Provinsi": "provinceName", "Slogan": "tagline", "Logo": "logoUrl", "Favicon / Ikon Browser": "faviconUrl", "Instagram": "instagramUrl", "Facebook": "facebookUrl", "YouTube": "youtubeUrl", "Teks Footer": "footerText", "Judul SEO": "seoTitle", "Deskripsi SEO": "seoDescription", "Kode Verifikasi Google Search Console": "googleSiteVerification", "Animasi Aktif": { key: "animationEnabled", type: "boolean" }, "Slider Otomatis": { key: "heroAutoplay", type: "boolean" }, "Interval Slider (ms)": "heroInterval" };
const CONTACT_MAP: Record<string, any> = { "Alamat Kantor": "address", "Telepon": "phone", "WhatsApp": "whatsapp", "Email": "email", "Jam Pelayanan": "serviceHours", "URL Embed Google Maps": "mapsEmbedUrl", "Foto Kantor": "officeImageUrl", "Tombol WhatsApp Aktif": { key: "whatsappEnabled", type: "boolean" } };
const PROFILE_MAP: Record<string, any> = { "Label Hero": "heroEyebrow", "Judul Hero": "heroTitle", "Deskripsi Hero": "heroDescription", "Foto Utama": "imageUrl", "Judul Foto": "heroImageTitle", "Caption Foto": "heroImageCaption", "Kredit Foto": "heroImageCredit", "Label Ringkasan": "summaryEyebrow", "Nama Ringkasan": "summaryName", "Deskripsi Ringkasan": "summaryDescription", "Judul Sejarah": "historyTitle", "Sejarah": "history", "Catatan Sejarah": "historyCallout", "Label Timeline": "timelineEyebrow", "Judul Timeline": "timelineTitle", "Deskripsi Timeline": "timelineDescription", "Visi": "vision", "Catatan Visi": "visionNote", "Judul Misi": "missionTitle", "Misi": { key: "missions", type: "list" }, "Label Wilayah": "regionEyebrow", "Judul Wilayah": "regionTitle", "Geografi": "geography", "Peta Profil": "mapImageUrl", "Judul Peta": "mapTitle", "Ringkasan Batas": "boundaries", "Label Potensi": "potentialEyebrow", "Judul Potensi": "potentialTitle", "Narasi Potensi": "potential", "Label Fasilitas": "facilityEyebrow", "Judul Fasilitas": "facilityTitle", "Pengantar Fasilitas": "facilityIntro", "Teks Utama Fasilitas": "facilityLeadText", "Daftar Fasilitas": { key: "facilities", type: "list" }, "Label Prioritas": "priorityEyebrow", "Judul Prioritas": "priorityTitle", "Pengantar Prioritas": "priorityIntro", "Daftar Prioritas": { key: "priorities", type: "list" }, "Label Pembaruan": "updateKicker", "Judul Pembaruan": "updateTitle", "Teks Pembaruan": "updateText" };

export async function GET(request: NextRequest) {
  try {
    const expected = process.env.SPREADSHEET_SYNC_SECRET?.trim();
    if (!expected) return NextResponse.json({ ok: false, error: "SPREADSHEET_SYNC_SECRET belum diatur di Vercel." }, { status: 503 });
    if (request.headers.get("x-sync-secret") !== expected) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    const sheet = request.nextUrl.searchParams.get("sheet") || "";
    let rows: Record<string, unknown>[] = [];

    if (sheet === "Data RT") {
      rows = (await readCollection("rts")).map((d: any) => ({ "Firestore ID": d.id, "RT": text(d.number), "Nama Ketua RT": text(d.chairmanName), "Foto Ketua RT": text(d.photoUrl), "No. HP": text(d.phone), "Alamat/Pos RT": text(d.area), "Status": d.isActive === false ? "Tidak Aktif" : "Aktif", "Jumlah KK": Number(d.familyCount || 0), "Jumlah Penduduk": Number(d.populationCount || 0), "Laki-laki": Number(d.maleCount || 0), "Perempuan": Number(d.femaleCount || 0), "Jumlah Rumah": Number(d.houseCount || 0), "Jumlah Balita": Number(d.toddlerCount || 0), "Jumlah Lansia": Number(d.elderlyCount || 0), "Fasilitas Utama RT": listOut(d.facilities), "Keterangan": text(d.description), "Urutan": Number(d.order || 0), "Tampil Website": yesNo(d.isActive) }));
    } else if (sheet === "Pemerintahan") {
      rows = (await readCollection("officials")).map((d: any) => ({ "Firestore ID": d.id, "Nama": text(d.name), "Jabatan": text(d.title), "Kategori": text(d.category), "Unit / Bagian Penempatan": text(d.unit), "Status": d.isActive === false ? "Tidak Aktif" : "Aktif", "Mulai Menjabat": dateOut(d.termStart), "Akhir Menjabat": dateOut(d.termEnd), "Kontak": text(d.phone), "Foto/Link": text(d.photoUrl), "Urutan Website": Number(d.order || 0), "Tampil Website": yesNo(d.isActive), "Keterangan": text(d.description) }));
    } else if (sheet === "Berita") {
      rows = (await readCollection("posts")).map((d: any) => ({ "Firestore ID": d.id, "Judul": text(d.title), "Slug": text(d.slug), "Ringkasan": text(d.summary), "Isi Berita": text(d.content), "Gambar Utama": text(d.coverImageUrl), "Kategori": text(d.category), "Nama Penulis": text(d.authorName), "Tanggal Publikasi": dateOut(d.publishedDate), "Waktu Publikasi (WITA)": text(d.publishedTime), "Status": text(d.status), "Berita Unggulan": yesNo(d.isFeatured), "Urutan": Number(d.order || 0) }));
    } else if (sheet === "Pengumuman") {
      rows = (await readCollection("announcements")).map((d: any) => ({ "Firestore ID": d.id, "Judul": text(d.title), "Isi Singkat": text(d.summary), "Gambar": text(d.imageUrl), "URL Lampiran": text(d.attachmentUrl), "Prioritas": text(d.priority), "Berlaku Sampai": dateOut(d.validUntil), "Urutan": Number(d.order || 0), "Status Aktif": yesNo(d.isActive) }));
    } else if (sheet === "Kegiatan") {
      const posts = await readCollection("posts"); const anns = await readCollection("announcements");
      rows = [...posts.map((d: any) => ({ "Firestore ID": d.id, "ID Konten": d.id, "Tanggal": dateOut(d.publishedDate), "Jenis": d.category === "Masyarakat" ? "Kegiatan" : "Berita", "Judul": text(d.title), "Ringkasan": text(d.summary), "Lokasi": text(d.location), "Penanggung Jawab": text(d.authorName), "Status Publikasi": d.status === "published" ? "Dipublikasikan" : "Draft", "Link Foto": text(d.coverImageUrl), "Link Berita": "", "Tanggal Publikasi": dateOut(d.publishedDate), "Keterangan": "" })), ...anns.map((d: any) => ({ "Firestore ID": d.id, "ID Konten": d.id, "Tanggal": "", "Jenis": "Pengumuman", "Judul": text(d.title), "Ringkasan": text(d.summary), "Lokasi": "", "Penanggung Jawab": "", "Status Publikasi": d.isActive === false ? "Draft" : "Dipublikasikan", "Link Foto": text(d.imageUrl), "Link Berita": text(d.attachmentUrl), "Tanggal Publikasi": "", "Keterangan": "" }))];
    } else if (sheet === "Agenda") {
      rows = (await readCollection("agendas")).map((d: any) => ({ "Firestore ID": d.id, "Nama Kegiatan": text(d.title), "Tanggal": dateOut(d.date), "Waktu": text(d.time), "Lokasi": text(d.location), "Penyelenggara": text(d.organizer), "Deskripsi": text(d.description), "Status": text(d.status), "Gambar": text(d.imageUrl), "Urutan": Number(d.order || 0), "Tampil Website": yesNo(d.isPublic !== false) }));
    } else if (sheet === "Layanan") {
      rows = (await readCollection("services")).map((d: any) => ({ "Firestore ID": d.id, "Nama Layanan": text(d.name), "Slug": text(d.slug), "Kategori": text(d.category), "Singkatan Ikon": text(d.icon), "Deskripsi Singkat": text(d.summary), "Persyaratan": listOut(d.requirements), "Prosedur": listOut(d.procedures), "Waktu Penyelesaian": text(d.duration), "Biaya": text(d.cost), "Kontak": text(d.contact), "URL Dokumen": text(d.documentUrl), "Urutan": Number(d.order || 0), "Tampil di Beranda": yesNo(d.isFeatured), "Layanan Aktif": yesNo(d.isActive) }));
    } else if (sheet === "Dokumen") {
      rows = (await readCollection("documents")).map((d: any) => ({ "Firestore ID": d.id, "Judul Dokumen": text(d.title), "Kategori": text(d.category), "Tahun": text(d.year), "Deskripsi": text(d.description), "URL File": text(d.fileUrl), "Jenis File": text(d.fileType), "Status Aktif": yesNo(d.isActive), "Urutan": Number(d.order || 0) }));
    } else if (sheet === "Hero") {
      rows = (await readCollection("heroSlides")).map((d: any) => ({ "Firestore ID": d.id, "Judul": text(d.title), "Deskripsi": text(d.subtitle), "Gambar Banner": text(d.imageUrl), "Teks Tombol Utama": text(d.primaryButtonText), "Tautan Tombol Utama": text(d.primaryButtonUrl), "Teks Tombol Kedua": text(d.secondaryButtonText), "Tautan Tombol Kedua": text(d.secondaryButtonUrl), "Urutan": Number(d.order || 0), "Status": yesNo(d.isActive) }));
    } else if (sheet === "Galeri Album") {
      rows = (await readCollection("galleryAlbums")).map((d: any) => ({ "Firestore ID": d.id, "Judul Album": text(d.title), "Slug": text(d.slug), "Kategori": text(d.category), "Deskripsi": text(d.description), "Foto Sampul": text(d.coverImageUrl), "Lokasi": text(d.location), "Tanggal Kegiatan": dateOut(d.eventDate), "Tampil di Beranda": yesNo(d.isFeatured), "Status": text(d.status), "Urutan": Number(d.order || 0) }));
    } else if (sheet === "UMKM") {
      rows = (await readCollection("umkm")).map((d: any) => ({ "Firestore ID": d.id, "ID UMKM": d.id, "Nama Usaha": text(d.name), "Nama Pemilik": text(d.ownerName), "NIK Pemilik": text(d.ownerNik), "Jenis Usaha": text(d.businessType), "Produk Utama": text(d.mainProduct), "Alamat": text(d.address), "RT": text(d.rt), "Kontak": text(d.phone), "Link Maps": text(d.mapsUrl), "Foto/Link": text(d.imageUrl), "Status": d.isActive === false ? "Tidak Aktif" : "Aktif", "Tampil Website": yesNo(d.isPublic), "Urutan": Number(d.order || 0), "Keterangan": text(d.note) }));
    } else if (sheet === "Fasilitas") {
      rows = (await readCollection("facilities")).map((d: any) => ({ "Firestore ID": d.id, "ID Fasilitas": d.id, "Kategori": text(d.category), "Nama Fasilitas": text(d.name), "Alamat": text(d.address), "RT": text(d.rt), "Link Maps/Koordinat": text(d.mapsUrl), "Kondisi": text(d.condition), "Pengelola": text(d.manager), "Status": text(d.status), "Foto/Link": text(d.imageUrl), "Tampil Website": yesNo(d.isPublic), "Urutan": Number(d.order || 0), "Keterangan": text(d.note) }));
    } else if (sheet === "Surat") {
      rows = (await readCollection("serviceRequests")).map((d: any) => ({ "Firestore ID": d.id, "ID Surat": text(d.ticketId) || d.id, "Tanggal Permohonan": dateOut(d.createdAt), "Nama Pemohon": text(d.name), "NIK": text(d.nik), "RT": text(d.rt), "Jenis Surat": text(d.letterType), "Keperluan": text(d.purpose), "Nomor Surat": text(d.letterNumber), "Status": text(d.status || "Baru"), "Petugas": text(d.staff), "Tanggal Selesai": dateOut(d.completedDate), "Link Dokumen": text(d.documentUrl), "URL Verifikasi": text(d.verificationUrl), "Keterangan": text(d.publicNote), "Tampil Cek Publik": yesNo(d.isPublicVerification) }));
    } else if (sheet === "Pengaduan") {
      rows = (await readCollection("complaints")).map((d: any) => ({ "Firestore ID": d.id, "ID Pengaduan": text(d.ticketId) || d.id, "Tanggal": dateOut(d.createdAt), "Nama Pelapor": text(d.name), "Kontak": text(d.phone), "RT": text(d.rt), "Kategori": text(d.category), "Isi Ringkas": text(d.message), "Lokasi": text(d.location), "Status": text(d.status || "Baru"), "Tindak Lanjut": text(d.followUp), "Petugas": text(d.staff), "Target Selesai": dateOut(d.targetDate), "Tanggal Selesai": dateOut(d.completedDate), "Keterangan": text(d.publicNote), "Tampil Statistik Publik": yesNo(d.showInPublicStats === true) }));
    } else if (sheet === "Penduduk") {
      rows = (await readCollection("residents")).map((d: any, index: number) => ({
        "No": index + 1, "ID Penduduk": text(d.residentId) || d.id, "NIK": text(d.nik), "No. KK": text(d.familyCardNumber), "Nama Lengkap": text(d.fullName),
        "Jenis Kelamin": text(d.gender), "Tempat Lahir": text(d.birthPlace), "Tanggal Lahir": dateOut(d.birthDate), "Agama": text(d.religion),
        "Status Perkawinan": text(d.maritalStatus), "Pendidikan": text(d.education), "Pekerjaan": text(d.occupation), "RT": text(d.rt), "Alamat": text(d.address),
        "Status Domisili": text(d.domicileStatus), "Tanggal Masuk": dateOut(d.arrivalDate), "Tanggal Keluar": dateOut(d.departureDate), "Keterangan": text(d.note),
      }));
    } else if (sheet === "Keluarga") {
      rows = (await readCollection("families")).map((d: any, index: number) => ({
        "No": index + 1, "No. KK": text(d.familyCardNumber), "Kepala Keluarga": text(d.headName), "RT": text(d.rt), "Alamat": text(d.address),
        "Status Rumah": text(d.housingStatus), "Jumlah Anggota": Number(d.memberCount || 0), "Tanggal Input": dateOut(d.inputDate), "Keterangan": text(d.note),
      }));
    } else if (sheet === "Mutasi") {
      rows = (await readCollection("populationMutations")).map((d: any, index: number) => ({
        "No": index + 1, "ID Mutasi": text(d.mutationId) || d.id, "Tanggal": dateOut(d.date), "NIK": text(d.nik), "Nama": text(d.name),
        "Jenis Mutasi": text(d.mutationType), "RT Asal": text(d.originRt), "RT Tujuan": text(d.destinationRt), "Alamat Asal/Tujuan": text(d.address),
        "No. Dokumen": text(d.documentNumber), "Petugas": text(d.officer), "Keterangan": text(d.note),
      }));
    } else if (sheet === "Bansos") {
      rows = (await readCollection("socialAssistance")).map((d: any, index: number) => ({
        "No": index + 1, "ID Data": text(d.recordId) || d.id, "Nama Penerima": text(d.recipientName), "NIK": text(d.nik), "No. KK": text(d.familyCardNumber),
        "RT": text(d.rt), "Jenis Bantuan": text(d.aidType), "Periode": text(d.period), "Status Penerimaan": text(d.receiptStatus), "Tanggal": dateOut(d.date),
        "Sumber Program": text(d.programSource), "Keterangan": text(d.note),
      }));
    } else if (sheet === "Inventaris") {
      rows = (await readCollection("inventory")).map((d: any, index: number) => ({
        "No": index + 1, "ID Barang": text(d.itemId) || d.id, "Nama Barang": text(d.itemName), "Kategori": text(d.category), "Kode Barang": text(d.itemCode),
        "Jumlah": Number(d.quantity || 0), "Satuan": text(d.unit), "Kondisi": text(d.condition), "Lokasi": text(d.location), "RT": text(d.rt), "Tahun Perolehan": text(d.acquisitionYear),
        "Sumber Dana": text(d.fundingSource), "Penanggung Jawab": text(d.personInCharge), "Keterangan": text(d.note),
      }));
    } else if (["Beranda", "Wilayah", "Pengaturan Website", "Kontak", "Profil Website"].includes(sheet)) {
      const cfg = sheet === "Beranda" ? ["pages", "home", HOME_MAP] : sheet === "Wilayah" ? ["pages", "wilayah", REGION_MAP] : sheet === "Pengaturan Website" ? ["siteSettings", "main", SETTINGS_MAP] : sheet === "Kontak" ? ["siteSettings", "main", CONTACT_MAP] : ["pages", "profil", PROFILE_MAP];
      const data = await readDoc(cfg[0] as string, cfg[1] as string);
      rows = data ? [singletonRow(data, cfg[2] as any)] : [];
    } else if (["Profil Statistik", "Profil Timeline", "Profil Fakta Wilayah", "Profil Batas", "Profil Potensi"].includes(sheet)) {
      const data: any = await readDoc("pages", "profil") || {};
      if (sheet === "Profil Statistik") rows = (Array.isArray(data.stats) ? data.stats : []).map((x: any) => ({ "Nilai": text(x.value), "Label": text(x.label), "Catatan": text(x.note) }));
      if (sheet === "Profil Timeline") rows = (Array.isArray(data.timeline) ? data.timeline : []).map((x: any) => ({ "Tahun": text(x.year), "Judul": text(x.title), "Isi": text(x.text) }));
      if (sheet === "Profil Fakta Wilayah") rows = (Array.isArray(data.regionFacts) ? data.regionFacts : []).map((x: any) => ({ "Nilai": text(x.value), "Label": text(x.label) }));
      if (sheet === "Profil Batas") rows = (Array.isArray(data.boundaryItems) ? data.boundaryItems : []).map((x: any) => ({ "Arah": text(x.direction), "Wilayah Berbatasan": text(x.places) }));
      if (sheet === "Profil Potensi") rows = (Array.isArray(data.potentials) ? data.potentials : []).map((x: any) => ({ "Judul": text(x.title), "Deskripsi": text(x.text) }));
    } else {
      return NextResponse.json({ ok: false, error: `Sheet ${sheet} belum didukung.` }, { status: 400 });
    }
    return NextResponse.json({ ok: true, sheet, rows });
  } catch (error) {
    console.error("Spreadsheet mirror error", error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Gagal membaca Firestore." }, { status: 500 });
  }
}
