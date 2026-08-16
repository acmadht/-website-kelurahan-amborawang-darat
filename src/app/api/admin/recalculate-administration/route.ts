import { NextResponse } from "next/server";
import { verifyEditorToken } from "@/lib/firebase/admin";
import { recalculateAdministrativeData } from "@/lib/admin/administrative-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearer(request: Request) {
  const authorization = request.headers.get("authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
}

export async function POST(request: Request) {
  try {
    const token = bearer(request);
    if (!token) return NextResponse.json({ error: "Sesi admin tidak ditemukan." }, { status: 401 });
    await verifyEditorToken(token);
    const result = await recalculateAdministrativeData();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("[recalculate-administration]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sinkronisasi data terkait gagal." },
      { status: 500 },
    );
  }
}
