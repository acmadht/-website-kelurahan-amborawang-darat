import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { v2 as cloudinary } from "cloudinary";

const required = [
  "FIREBASE_ADMIN_PROJECT_ID",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  "FIREBASE_ADMIN_PRIVATE_KEY",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

let missing = false;
for (const key of required) {
  const ok = Boolean(process.env[key]?.trim());
  console.log(`${ok ? "OK" : "KOSONG"}  ${key}`);
  if (!ok) missing = true;
}
if (missing) process.exit(1);

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID.trim();
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL.trim();
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  .replace(/^"|"$/g, "")
  .replace(/\\n/g, "\n");
const app = getApps()[0] ?? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });

try {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim();
  if (email) {
    const user = await getAuth(app).getUserByEmail(email);
    console.log(`OK  Firebase Auth: ${user.email} (${user.uid})`);
    console.log(`Claims saat ini: ${JSON.stringify(user.customClaims ?? {})}`);
  } else {
    await getAuth(app).listUsers(1);
    console.log("OK  Firebase Admin Authentication terhubung.");
  }
} catch (error) {
  console.error("GAGAL Firebase Admin:", error instanceof Error ? error.message : error);
}

try {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
    secure: true,
  });
  const result = await cloudinary.api.ping();
  console.log(`OK  Cloudinary: ${JSON.stringify(result)}`);
} catch (error) {
  console.error("GAGAL Cloudinary:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
