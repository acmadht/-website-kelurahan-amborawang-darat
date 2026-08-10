import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";

function cleanText(value: unknown, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    // Honeypot sederhana untuk bot. Field ini tidak perlu terlihat oleh pengguna.
    if (cleanText(body.website, 200)) {
      return NextResponse.json({ ok: true });
    }

    const name = cleanText(body.name, 100);
    const contact = cleanText(body.contact, 100);
    const subject = cleanText(body.subject, 160);
    const message = cleanText(body.message, 3000);

    if (!name || !contact || !subject || !message) {
      return NextResponse.json(
        { error: "Nama, kontak, subjek, dan pesan wajib diisi." },
        { status: 400 },
      );
    }

    await getAdminDb().collection("messages").add({
      name,
      contact,
      subject,
      message,
      status: "baru",
      source: "website",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "Pesan belum dapat dikirim. Silakan gunakan WhatsApp kelurahan." },
      { status: 500 },
    );
  }
}
