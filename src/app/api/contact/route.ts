import { NextResponse } from "next/server";
import { addDocument } from "@/lib/firebase/firestore-rest-admin";

export const runtime = "nodejs";

function cleanText(value: unknown, maxLength: number) {
  return String(value ?? "").trim().slice(0, maxLength);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    if (cleanText(body.website, 200)) return NextResponse.json({ ok: true });

    const name = cleanText(body.name, 100);
    const contact = cleanText(body.contact, 100);
    const subject = cleanText(body.subject, 160);
    const message = cleanText(body.message, 3000);
    if (!name || !contact || !subject || !message) {
      return NextResponse.json({ error: "Nama, kontak, subjek, dan pesan wajib diisi." }, { status: 400 });
    }

    await addDocument("messages", {
      name,
      contact,
      subject,
      message,
      status: "baru",
      source: "website",
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Pesan belum dapat dikirim." }, { status: 500 });
  }
}
