import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { verifyEditorToken } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const maxDuration = 60;

function configureCloudinary() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary belum lengkap. Periksa CLOUD_NAME, API_KEY, dan API_SECRET.");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

function uploadBuffer(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format: "webp",
        transformation: [
          { width: 1920, height: 1920, crop: "limit", quality: "auto:good" },
        ],
        overwrite: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary tidak mengembalikan hasil upload."));
        resolve(result);
      },
    );
    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  const requestId = randomUUID().slice(0, 8);
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token admin tidak ditemukan.", requestId },
        { status: 401 },
      );
    }

    await verifyEditorToken(authorization.slice(7));
    configureCloudinary();

    const formData = await request.formData();
    const file = formData.get("file");
    const requestedFolder = String(formData.get("folder") || "konten").replace(
      /[^a-zA-Z0-9/_-]/g,
      "",
    );

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File gambar tidak ditemukan.", requestId },
        { status: 400 },
      );
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File harus berupa gambar.", requestId },
        { status: 400 },
      );
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran gambar maksimal 8 MB.", requestId },
        { status: 400 },
      );
    }

    const baseFolder = process.env.CLOUDINARY_FOLDER?.trim() || "website-kelurahan";
    const result = await uploadBuffer(
      Buffer.from(await file.arrayBuffer()),
      `${baseFolder}/${requestedFolder}`,
    );

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      requestId,
    });
  } catch (error) {
    console.error(`[upload:${requestId}]`, error);
    const message = error instanceof Error ? error.message : "Upload gagal.";
    return NextResponse.json(
      { error: `${message} [Kode ${requestId}]`, requestId },
      { status: 500 },
    );
  }
}
