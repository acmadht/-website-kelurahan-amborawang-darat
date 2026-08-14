import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

function clean(value: unknown, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

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
    const nik = clean(body.nik, 24).replace(/\D/g, "");
    const kk = clean(body.kk, 24).replace(/\D/g, "");
    const rt = clean(body.rt, 4).replace(/\D/g, "").padStart(2, "0");
    const phone = clean(body.phone, 40);
    const letterType = clean(body.letterType, 160);
    const purpose = clean(body.purpose, 700);

    if (!name || nik.length !== 16 || !phone || !letterType || !purpose) {
      return NextResponse.json(
        { error: "Nama, NIK 16 digit, kontak, jenis surat, dan keperluan wajib diisi." },
        { status: 400 },
      );
    }

    const id = ticket("SR");
    await getAdminDb().collection("serviceRequests").doc(id).set({
      ticketId: id,
      name,
      nik,
      kk,
      rt,
      phone,
      letterType,
      purpose,
      status: "Baru",
      source: "website",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, ticketId: id });
  } catch (error) {
    console.error("[layanan-surat]", error);
    return NextResponse.json({ error: "Permohonan belum dapat dikirim." }, { status: 500 });
  }
}
