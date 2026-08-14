import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

export const runtime = "nodejs";
export const maxDuration = 60;

function configureCloudinary() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary belum lengkap.");
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
}

function uploadBuffer(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
  return new Promise((resolve,reject)=>{
    const stream=cloudinary.uploader.upload_stream({
      folder,
      resource_type:"image",
      format:"webp",
      transformation:[{width:1920,height:1920,crop:"limit",quality:"auto:good"}],
      unique_filename:true,
    },(error,result)=>{
      if(error) return reject(error);
      if(!result) return reject(new Error("Cloudinary tidak mengembalikan hasil."));
      resolve(result);
    });
    stream.end(buffer);
  });
}

export async function POST(request:Request){
 const requestId=randomUUID().slice(0,8);
 try{
   // Token diperiksa oleh middleware/admin client. Route upload fokus pada file.
   configureCloudinary();
   const form=await request.formData();
   const file=form.get("file");
   const folder=String(form.get("folder")||"konten").replace(/[^a-zA-Z0-9/_-]/g,"")||"konten";
   if(!(file instanceof File)) return NextResponse.json({error:"File tidak ditemukan",requestId},{status:400});
   if(!file.type.startsWith("image/")) return NextResponse.json({error:"File harus gambar",requestId},{status:400});
   if(file.size>8*1024*1024) return NextResponse.json({error:"Ukuran maksimal 8 MB",requestId},{status:400});
   const base=process.env.CLOUDINARY_FOLDER?.trim()||"website-kelurahan";
   const result=await uploadBuffer(Buffer.from(await file.arrayBuffer()),`${base}/${folder}`);
   return NextResponse.json({url:result.secure_url,publicId:result.public_id,width:result.width,height:result.height,bytes:result.bytes,requestId});
 }catch(e){
   console.error(e);
   return NextResponse.json({error:e instanceof Error?e.message:"Upload gagal",requestId},{status:500});
 }
}
