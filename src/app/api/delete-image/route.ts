import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyEditorToken } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) return NextResponse.json({ error: "Token admin tidak ditemukan." }, { status: 401 });
    await verifyEditorToken(authorization.slice(7));
    const { publicId } = (await request.json()) as { publicId?: string };
    if (!publicId) return NextResponse.json({ error: "Public ID wajib diisi." }, { status: 400 });

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary belum dikonfigurasi.");
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    return NextResponse.json({ result: result.result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal menghapus gambar." }, { status: 500 });
  }
}
