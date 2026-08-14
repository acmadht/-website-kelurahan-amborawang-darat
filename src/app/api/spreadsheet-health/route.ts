import { NextRequest, NextResponse } from "next/server";
import { healthCheckFirestore } from "@/lib/firebase/firestore-rest-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const expected = process.env.SPREADSHEET_SYNC_SECRET?.trim();
    if (!expected) {
      return NextResponse.json(
        { ok: false, stage: "config", error: "SPREADSHEET_SYNC_SECRET belum diatur." },
        { status: 503 },
      );
    }
    if (request.headers.get("x-sync-secret") !== expected) {
      return NextResponse.json({ ok: false, stage: "auth", error: "Unauthorized" }, { status: 401 });
    }

    await healthCheckFirestore();
    return NextResponse.json({
      ok: true,
      stage: "firestore",
      message: "Koneksi service account dan Firestore berhasil.",
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID ?? "",
    });
  } catch (error) {
    console.error("[spreadsheet-health]", error);
    return NextResponse.json(
      {
        ok: false,
        stage: "firestore",
        error: error instanceof Error ? error.message : "Koneksi Firestore gagal.",
      },
      { status: 500 },
    );
  }
}
