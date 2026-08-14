import { createSign, randomUUID } from "node:crypto";

type FirestoreValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { timestampValue: string }
  | { stringValue: string }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __kelurahanGoogleAccessToken:
    | { token: string; expiresAt: number }
    | undefined;
}

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} belum diatur di Vercel.`);
  return value;
}

function privateKey(): string {
  return requiredEnv("FIREBASE_ADMIN_PRIVATE_KEY")
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");
}

function base64Url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken(): Promise<string> {
  const cached = globalThis.__kelurahanGoogleAccessToken;
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const clientEmail = requiredEnv("FIREBASE_ADMIN_CLIENT_EMAIL");
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );

  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(privateKey());
  const assertion = `${unsigned}.${base64Url(signature)}`;

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const json = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !json.access_token) {
    throw new Error(
      `Gagal mendapatkan Google access token: ${json.error_description || json.error || response.statusText}`,
    );
  }

  globalThis.__kelurahanGoogleAccessToken = {
    token: json.access_token,
    expiresAt: Date.now() + Math.max(300, json.expires_in ?? 3600) * 1000,
  };
  return json.access_token;
}

function projectId(): string {
  return requiredEnv("FIREBASE_ADMIN_PROJECT_ID");
}

function firestoreBase(): string {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId())}/databases/(default)/documents`;
}

function encodeValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    if (Number.isInteger(value)) return { integerValue: String(value) };
    return { doubleValue: value };
  }
  if (typeof value === "string") return { stringValue: value };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(encodeValue) } };
  }
  if (typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value as Record<string, unknown>).map(([k, v]) => [
            k,
            encodeValue(v),
          ]),
        ),
      },
    };
  }
  return { stringValue: String(value) };
}

function decodeValue(value?: FirestoreValue): unknown {
  if (!value) return undefined;
  if ("nullValue" in value) return null;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("timestampValue" in value) return value.timestampValue;
  if ("stringValue" in value) return value.stringValue;
  if ("arrayValue" in value) {
    return (value.arrayValue.values ?? []).map(decodeValue);
  }
  if ("mapValue" in value) {
    return Object.fromEntries(
      Object.entries(value.mapValue.fields ?? {}).map(([k, v]) => [k, decodeValue(v)]),
    );
  }
  return undefined;
}

function encodeFields(data: Record<string, unknown>): Record<string, FirestoreValue> {
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, encodeValue(v)]));
}

function decodeDocument(doc: FirestoreDocument): Record<string, unknown> & { id: string } {
  const id = decodeURIComponent(doc.name.split("/").pop() ?? "");
  return {
    id,
    ...Object.fromEntries(
      Object.entries(doc.fields ?? {}).map(([k, v]) => [k, decodeValue(v)]),
    ),
  };
}

async function authorizedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  const headers = new Headers(init.headers);
  headers.set("authorization", `Bearer ${token}`);
  return fetch(url, { ...init, headers, cache: "no-store" });
}

async function errorText(response: Response): Promise<string> {
  try {
    const json = (await response.json()) as { error?: { message?: string } };
    return json.error?.message || `${response.status} ${response.statusText}`;
  } catch {
    return `${response.status} ${response.statusText}`;
  }
}

export async function getDocument(
  collectionName: string,
  documentId: string,
): Promise<(Record<string, unknown> & { id: string }) | null> {
  const url = `${firestoreBase()}/${encodeURIComponent(collectionName)}/${encodeURIComponent(documentId)}`;
  const response = await authorizedFetch(url);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore GET gagal: ${await errorText(response)}`);
  return decodeDocument((await response.json()) as FirestoreDocument);
}

export async function listDocuments(
  collectionName: string,
  max = 5000,
): Promise<Array<Record<string, unknown> & { id: string }>> {
  const rows: Array<Record<string, unknown> & { id: string }> = [];
  let pageToken = "";

  while (rows.length < max) {
    const params = new URLSearchParams({ pageSize: String(Math.min(300, max - rows.length)) });
    if (pageToken) params.set("pageToken", pageToken);
    const url = `${firestoreBase()}/${encodeURIComponent(collectionName)}?${params.toString()}`;
    const response = await authorizedFetch(url);
    if (!response.ok) throw new Error(`Firestore LIST gagal: ${await errorText(response)}`);

    const json = (await response.json()) as {
      documents?: FirestoreDocument[];
      nextPageToken?: string;
    };
    for (const doc of json.documents ?? []) rows.push(decodeDocument(doc));
    pageToken = json.nextPageToken ?? "";
    if (!pageToken || !(json.documents?.length)) break;
  }

  return rows;
}

export async function setDocument(
  collectionName: string,
  documentId: string,
  data: Record<string, unknown>,
  merge = true,
): Promise<void> {
  const params = new URLSearchParams();
  if (merge) {
    for (const field of Object.keys(data)) params.append("updateMask.fieldPaths", field);
  }
  const query = params.toString();
  const url = `${firestoreBase()}/${encodeURIComponent(collectionName)}/${encodeURIComponent(documentId)}${query ? `?${query}` : ""}`;
  const response = await authorizedFetch(url, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fields: encodeFields(data) }),
  });
  if (!response.ok) throw new Error(`Firestore PATCH gagal: ${await errorText(response)}`);
}

export async function addDocument(
  collectionName: string,
  data: Record<string, unknown>,
  documentId = randomUUID(),
): Promise<string> {
  await setDocument(collectionName, documentId, data, false);
  return documentId;
}

export async function healthCheckFirestore(): Promise<void> {
  await listDocuments("rts", 1);
}
