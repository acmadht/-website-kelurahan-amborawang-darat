import type { Metadata } from "next";
import { demoSettings } from "@/data/demo";
import { staticKknPosts } from "@/data/kknStatic";
import type { PostItem, SiteSettings } from "@/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://website-kelurahan-amborawang-darat.vercel.app"
).replace(/\/$/, "");

const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  "q5ReWo_LtIesXBuf1nT7-ETCqNrgxzzg_XSFq6m7er4";

function clean(value: unknown, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

export function absoluteUrl(value?: string) {
  const path = clean(value, "/");
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getServerSettings(): Promise<SiteSettings> {
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin-db");
    const snapshot = await getAdminDb().collection("siteSettings").doc("main").get();
    if (!snapshot.exists) return demoSettings;

    // Firestore dapat mengembalikan nilai seperti Timestamp yang merupakan
    // instance class. Props dari Server Component ke Client Component harus
    // berupa data serializable/plain, jadi normalkan seluruh isi dokumen dulu.
    const remote = toSerializableValue(snapshot.data()) as Partial<SiteSettings>;
    return { ...demoSettings, ...remote };
  } catch {
    return demoSettings;
  }
}


function toSerializableValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(toSerializableValue);
  if (typeof value === "object") {
    if (
      "toDate" in value &&
      typeof (value as { toDate?: unknown }).toDate === "function"
    ) {
      return (value as { toDate: () => Date }).toDate().toISOString();
    }

    const output: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      output[key] = toSerializableValue(child);
    }
    return output;
  }
  return value;
}

export async function getServerDocument<T>(
  collectionName: string,
  documentId: string,
  fallback: T,
): Promise<T> {
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin-db");
    const snapshot = await getAdminDb().collection(collectionName).doc(documentId).get();
    if (!snapshot.exists) return fallback;
    const remote = toSerializableValue(snapshot.data()) as Partial<T>;
    if (typeof fallback === "object" && fallback !== null && !Array.isArray(fallback)) {
      return { ...(fallback as Record<string, unknown>), ...(remote as Record<string, unknown>) } as T;
    }
    return remote as T;
  } catch {
    return fallback;
  }
}

export async function getServerCollection<T>(collectionName: string): Promise<T[]> {
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin-db");
    const snapshot = await getAdminDb().collection(collectionName).get();
    return snapshot.docs.map((doc) =>
      toSerializableValue({ id: doc.id, ...doc.data() }),
    ) as T[];
  } catch {
    return [];
  }
}

export function villageLabel(settings: SiteSettings) {
  return `Kelurahan ${clean(settings.villageName, "Amborawang Darat")}`;
}

export function governmentLabel(settings: SiteSettings) {
  return `Pemerintah ${villageLabel(settings)}`;
}

function pageTitle(title: string, settings: SiteSettings) {
  const village = villageLabel(settings);
  const normalized = clean(title);
  if (!normalized) return clean(settings.seoTitle, `Website Resmi ${village}`);
  return normalized.toLowerCase().includes(village.toLowerCase())
    ? normalized
    : `${normalized} | ${village}`;
}

interface BuildMetadataInput {
  settings: SiteSettings;
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

export function buildMetadata({
  settings,
  title = "",
  description,
  path = "/",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const finalTitle = pageTitle(title, settings);
  const finalDescription = clean(
    description,
    clean(
      settings.seoDescription,
      `Website resmi ${villageLabel(settings)} untuk informasi pemerintahan, pelayanan publik, berita, dan data wilayah.`,
    ),
  );
  const finalImage = absoluteUrl(
    image || settings.officeImageUrl || settings.logoUrl || "/icon.png",
  );

  const openGraph: NonNullable<Metadata["openGraph"]> = {
    type,
    locale: "id_ID",
    url: canonical,
    siteName: clean(settings.siteName, `Website Resmi ${villageLabel(settings)}`),
    title: finalTitle,
    description: finalDescription,
    images: [
      {
        url: finalImage,
        alt: finalTitle,
      },
    ],
  };

  if (type === "article") {
    Object.assign(openGraph, {
      publishedTime,
      modifiedTime,
      authors,
    });
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: finalTitle },
    description: finalDescription,
    alternates: { canonical },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [finalImage],
    },
  };
}

export function rootMetadata(settings: SiteSettings): Metadata {
  const village = villageLabel(settings);
  const title = clean(settings.seoTitle, `Website Resmi ${village}`);
  const description = clean(
    settings.seoDescription,
    `Website resmi ${village} untuk informasi pemerintahan, pelayanan publik, berita, dan data wilayah.`,
  );
  const image = absoluteUrl(
    settings.officeImageUrl || settings.logoUrl || "/icon.png",
  );

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${village}`,
    },
    description,
    applicationName: clean(settings.siteName, title),
    authors: [{ name: governmentLabel(settings) }],
    creator: governmentLabel(settings),
    publisher: governmentLabel(settings),
    category: "Pemerintahan",
    keywords: [
      clean(settings.villageName, "Amborawang Darat"),
      village,
      clean(settings.subdistrictName, "Samboja Barat"),
      clean(settings.regencyName, "Kutai Kartanegara"),
      clean(settings.provinceName, "Kalimantan Timur"),
      "pelayanan publik kelurahan",
      "pemerintahan kelurahan",
    ],
    icons: {
      icon: settings.faviconUrl || "/icon.png",
      apple: settings.faviconUrl || "/icon.png",
    },
    verification: clean(settings.googleSiteVerification) || GOOGLE_SITE_VERIFICATION
      ? { google: clean(settings.googleSiteVerification) || GOOGLE_SITE_VERIFICATION }
      : undefined,
    alternates: { canonical: SITE_URL },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: SITE_URL,
      siteName: clean(settings.siteName, title),
      title,
      description,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

function socialLinks(settings: SiteSettings) {
  return [settings.instagramUrl, settings.facebookUrl, settings.youtubeUrl]
    .map((item) => clean(item))
    .filter(Boolean);
}

export function websiteJsonLd(settings: SiteSettings) {
  const preferredName = villageLabel(settings);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: preferredName,
    alternateName: clean(settings.siteName, `Website Resmi ${preferredName}`),
    inLanguage: "id-ID",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function organizationJsonLd(settings: SiteSettings) {
  const village = villageLabel(settings);
  const logo = absoluteUrl(settings.logoUrl || settings.faviconUrl || "/icon.png");
  const officeImage = absoluteUrl(settings.officeImageUrl || settings.logoUrl || "/icon.png");
  const rawPhone = clean(settings.whatsapp || settings.phone);
  const schemaPhone = rawPhone
    ? rawPhone.startsWith("+")
      ? rawPhone
      : rawPhone.startsWith("62")
        ? `+${rawPhone}`
        : rawPhone.startsWith("0")
          ? `+62${rawPhone.slice(1)}`
          : rawPhone
    : undefined;
  const postalCode = clean(settings.address).match(/\b(\d{5})\b/)?.[1];

  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: governmentLabel(settings),
    alternateName: village,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: logo,
      contentUrl: logo,
    },
    image: officeImage,
    ...(clean(settings.seoDescription)
      ? { description: clean(settings.seoDescription) }
      : {}),
    address: {
      "@type": "PostalAddress",
      ...(clean(settings.address) ? { streetAddress: clean(settings.address) } : {}),
      addressLocality: clean(settings.villageName, "Amborawang Darat"),
      addressRegion: clean(settings.provinceName, "Kalimantan Timur"),
      ...(postalCode ? { postalCode } : {}),
      addressCountry: "ID",
    },
    ...(schemaPhone ? { telephone: schemaPhone } : {}),
    ...(clean(settings.email) ? { email: clean(settings.email) } : {}),
    ...(schemaPhone || clean(settings.email)
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "pelayanan masyarakat",
            ...(schemaPhone ? { telephone: schemaPhone } : {}),
            ...(clean(settings.email) ? { email: clean(settings.email) } : {}),
            availableLanguage: ["id"],
          },
        }
      : {}),
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${village}, Kecamatan ${clean(settings.subdistrictName, "Samboja Barat")}, Kabupaten ${clean(settings.regencyName, "Kutai Kartanegara")}`,
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const INDONESIAN_MONTHS: Record<string, string> = {
  januari: "01",
  februari: "02",
  maret: "03",
  april: "04",
  mei: "05",
  juni: "06",
  juli: "07",
  agustus: "08",
  september: "09",
  oktober: "10",
  november: "11",
  desember: "12",
};

function timestampToIso(value: unknown): string | undefined {
  if (!value) return undefined;
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export function publishedDateIso(post: PostItem): string | undefined {
  const direct = timestampToIso(post.publishedAt);
  if (direct) return direct;

  const value = clean(post.publishedDate);
  if (!value) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00+08:00`;

  const match = value.toLowerCase().match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i);
  if (match) {
    const month = INDONESIAN_MONTHS[match[2]];
    if (month) {
      return `${match[3]}-${month}-${match[1].padStart(2, "0")}T00:00:00+08:00`;
    }
  }

  return timestampToIso(value);
}

export function modifiedDateIso(post: PostItem): string | undefined {
  return timestampToIso(post.updatedAt) || publishedDateIso(post);
}

export function articleJsonLd(post: PostItem, settings: SiteSettings, basePath = "/berita") {
  const url = absoluteUrl(`${basePath}/${post.slug}`);
  const image = absoluteUrl(post.coverImageUrl || settings.officeImageUrl || "/icon.png");
  const author = clean(post.authorName, governmentLabel(settings));
  const datePublished = publishedDateIso(post);
  const dateModified = modifiedDateIso(post);

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: clean(post.title),
    description: clean(post.summary),
    image: [image],
    datePublished,
    dateModified,
    author: {
      "@type": author === governmentLabel(settings) ? "Organization" : "Person",
      name: author,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    articleSection: clean(post.category, "Berita"),
    inLanguage: "id-ID",
  };
}

export function serializePost(post: PostItem): PostItem {
  return {
    ...post,
    publishedAt: timestampToIso(post.publishedAt),
    createdAt: timestampToIso(post.createdAt),
    updatedAt: timestampToIso(post.updatedAt),
  };
}

export async function getDynamicPublishedPostsServer(): Promise<PostItem[]> {
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin-db");
    const snapshot = await getAdminDb()
      .collection("posts")
      .where("status", "==", "published")
      .get();

    return snapshot.docs
      .map((doc) => serializePost({ id: doc.id, ...doc.data() } as PostItem))
      .filter((post) => String(post.category || "").toUpperCase() !== "KKN");
  } catch {
    return [];
  }
}

export async function getDynamicKknPublishedPostsServer(): Promise<PostItem[]> {
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin-db");
    const snapshot = await getAdminDb()
      .collection("posts")
      .where("status", "==", "published")
      .get();

    const remote = snapshot.docs
      .map((doc) => serializePost({ id: doc.id, ...doc.data() } as PostItem))
      .filter((post) => String(post.category || "").toUpperCase() === "KKN");

    return remote.length ? remote : staticKknPosts.map(serializePost);
  } catch {
    return staticKknPosts.map(serializePost);
  }
}

export async function getPublicPostBySlugServer(slug: string): Promise<PostItem | undefined> {
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin-db");
    const snapshot = await getAdminDb()
      .collection("posts")
      .where("slug", "==", slug)
      .limit(5)
      .get();

    const post = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as PostItem))
      .find(
        (item) =>
          item.status === "published" &&
          String(item.category || "").toUpperCase() !== "KKN",
      );

    return post ? serializePost(post) : undefined;
  } catch {
    return undefined;
  }
}

export async function getKknPostBySlugServer(slug: string): Promise<PostItem | undefined> {
  try {
    const { getAdminDb } = await import("@/lib/firebase/admin-db");
    const snapshot = await getAdminDb()
      .collection("posts")
      .where("slug", "==", slug)
      .limit(5)
      .get();

    const post = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as PostItem))
      .find(
        (item) => item.status === "published" && String(item.category || "").toUpperCase() === "KKN",
      );

    if (post) return serializePost(post);
  } catch {
    // fallback statis di bawah
  }

  const staticPost = staticKknPosts.find(
    (post) => post.status === "published" && post.slug === slug,
  );
  return staticPost ? serializePost(staticPost) : undefined;
}

