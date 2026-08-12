export type UserRole = "superadmin" | "editor" | "operator_rt";

export interface SiteSettings {
  siteName: string;
  villageName: string;
  subdistrictName?: string;
  regencyName?: string;
  provinceName?: string;
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
  googleSiteVerification?: string;
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
  unit?: string;
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
  area?: string;
  populationCount?: number;
  familyCount?: number;
  maleCount?: number;
  femaleCount?: number;
  houseCount?: number;
  toddlerCount?: number;
  elderlyCount?: number;
  facilities?: string[];
  rwId?: string;
  order: number;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
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
  publishedDate?: string;
  publishedTime?: string;
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
  createdAt?: unknown;
  updatedAt?: unknown;
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
  supervisorPhotoUrl?: string;
  supervisorDescription?: string;
  description: string;
  logoUrl?: string;
  groupPhotoUrl?: string;
  structureImageUrl?: string;
  updatedAt?: unknown;
}

export interface KknMember {
  id?: string;
  name: string;
  role: string;
  division: string;
  studyProgram?: string;
  nim?: string;
  quote?: string;
  description?: string;
  photoUrl?: string;
  order: number;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface KknProgram {
  id?: string;
  code: string;
  title: string;
  category: string;
  description: string;
  objective?: string;
  target?: string;
  schedule?: string;
  personInCharge?: string;
  status: string;
  imageUrl?: string;
  linkUrl?: string;
  linkLabel?: string;
  order: number;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface KknBookChapter {
  id?: string;
  title: string;
  authors: string[];
  abstract: string;
  coverImageUrl?: string;
  isbn?: string;
  doi?: string;
  year?: string;
  publisher?: string;
  fileUrl?: string;
  status: "draft" | "published";
  order: number;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface KknOutput {
  id?: string;
  code: string;
  type: string;
  title: string;
  description: string;
  imageUrl?: string;
  href?: string;
  linkLabel?: string;
  order: number;
  isActive: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
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
