export type UserRole = "superadmin" | "editor" | "operator_rt";

export interface SiteSettings {
  siteName: string;
  villageName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl?: string;
  officeImageUrl?: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  serviceHours: string;
  mapsEmbedUrl: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
  animationEnabled: boolean;
  heroAutoplay: boolean;
  heroInterval: number;
  whatsappEnabled: boolean;
}

export interface HeroSlide {
  id?: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  order: number;
  isActive: boolean;
}

export interface Official {
  id?: string;
  name: string;
  title: string;
  category: string;
  photoUrl: string;
  phone?: string;
  description?: string;
  parentId?: string;
  order: number;
  termStart?: string;
  termEnd?: string;
  isActive: boolean;
}

export interface RegionLeader {
  id?: string;
  number: string;
  chairmanName: string;
  photoUrl?: string;
  phone?: string;
  description?: string;
  populationCount?: number;
  familyCount?: number;
  rwId?: string;
  order: number;
  isActive: boolean;
}

export interface ServiceItem {
  id?: string;
  name: string;
  slug: string;
  category: string;
  icon: string;
  summary: string;
  requirements: string[];
  procedures: string[];
  duration: string;
  cost: string;
  contact?: string;
  documentUrl?: string;
  order: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface PostItem {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageUrl: string;
  category: string;
  authorName?: string;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  publishedAt?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Announcement {
  id?: string;
  title: string;
  summary: string;
  attachmentUrl?: string;
  priority: "normal" | "penting";
  validUntil?: string;
  isActive: boolean;
  order: number;
}

export interface AgendaItem {
  id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  status: "akan-datang" | "berlangsung" | "selesai" | "dibatalkan";
  imageUrl?: string;
  order: number;
}

export interface GalleryAlbum {
  id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  coverImageUrl: string;
  location?: string;
  eventDate?: string;
  photoCount: number;
  isFeatured: boolean;
  status: "draft" | "published";
  order: number;
}

export interface GalleryPhoto {
  id?: string;
  albumId: string;
  imageUrl: string;
  publicId: string;
  caption?: string;
  order: number;
  width?: number;
  height?: number;
  fileSize?: number;
}

export interface KknTeam {
  universityName: string;
  groupName: string;
  year: string;
  location: string;
  supervisorName: string;
  description: string;
  logoUrl?: string;
  groupPhotoUrl?: string;
}

export interface KknMember {
  id?: string;
  name: string;
  role: string;
  photoUrl?: string;
  order: number;
  isActive: boolean;
}

export interface PublicDocument {
  id?: string;
  title: string;
  category: string;
  year: string;
  description: string;
  fileUrl: string;
  fileType: string;
  isActive: boolean;
  order: number;
}
