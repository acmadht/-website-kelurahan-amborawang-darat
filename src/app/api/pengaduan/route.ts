import { NextResponse } from "next/server";
import { setDocument } from "@/lib/firebase/firestore-rest-admin";
import { recalculateAdministrativeData } from "@/lib/admin/administrative-sync";

export const runtime = "nodejs";
function clean(value: unknown, max = 1000) { return String(value ?? "").trim().slice(0, max); }
function ticket(prefix: string) {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${stamp}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (clean(body.website, 120)) return NextResponse.json({ ok: true });
    const name = clean(body.name, 120);
    const phone = clean(body.phone, 40);
    const rtDigits = clean(body.rt, 4).replace(/\D/g, "");
    const rtNumber = Number(rtDigits);
    const rt = rtDigits && Number.isInteger(rtNumber) && rtNumber >= 1 && rtNumber <= 13 ? String(rtNumber).padStart(2, "0") : "";
    const category = clean(body.category, 120);
    const location = clean(body.location, 240);
    const message = clean(body.message, 3000);
    if (!name || !phone || !category || !message) {
      return NextResponse.json({ error: "Nama, kontak, kategori, dan isi pengaduan wajib diisi." }, { status: 400 });
    }
    const id = ticket("PG");
    const now = new Date().toISOString();
    await setDocument("complaints", id, {
      ticketId: id, name, phone, rt, category, location, message,
      status: "Baru", source: "website", createdAt: now, updatedAt: now,
    }, false);
    await recalculateAdministrativeData();
    return NextResponse.json({ ok: true, ticketId: id });
  } catch (error) {
    console.error("[pengaduan]", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Pengaduan belum dapat dikirim." }, { status: 500 });
  }
}
