/**
 * Membaca respons API dengan aman.
 * Vercel kadang mengembalikan halaman HTML untuk error platform (404/500/504).
 * Jika langsung memanggil response.json(), browser akan menampilkan
 * "Unexpected token '<'" karena HTML bukan JSON.
 */
export async function readApiJson<T>(response: Response): Promise<T> {
  const raw = await response.text();
  const trimmed = raw.trim();
  const contentType = response.headers.get("content-type") ?? "";
  const looksLikeJson =
    contentType.includes("application/json") ||
    trimmed.startsWith("{") ||
    trimmed.startsWith("[");

  if (!looksLikeJson) {
    throw new Error(
      `Layanan server sedang bermasalah (HTTP ${response.status}). Silakan coba lagi beberapa saat atau periksa log deployment Vercel.`,
    );
  }

  try {
    return JSON.parse(trimmed || "{}") as T;
  } catch {
    throw new Error(
      `Balasan server tidak dapat dibaca (HTTP ${response.status}). Silakan coba lagi.`,
    );
  }
}
