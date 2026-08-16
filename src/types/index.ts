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


export interface VillageStats {
  population: number;
  families: number;
  male: number;
  female: number;
  rtCount: number;
  syncedAt?: unknown;
}

export interface UmkmItem {
  id?: string;
  name: string;
  ownerName?: string;
  ownerNik?: string;
  businessType?: string;
  mainProduct?: string;
  address?: string;
  rt?: string;
  phone?: string;
  mapsUrl?: string;
  imageUrl?: string;
  isActive: boolean;
  isPublic: boolean;
  order: number;
  note?: string;
}

export interface FacilityItem {
  id?: string;
  category?: string;
  name: string;
  address?: string;
  rt?: string;
  mapsUrl?: string;
  condition?: string;
  manager?: string;
  status?: string;
  imageUrl?: string;
  isPublic: boolean;
  order: number;
  note?: string;
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
  imageUrl?: string;
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
  isPublic?: boolean;
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
  programType: "Program Utama" | "Program Pendukung";
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


export interface ResidentRecord {
  id?: string;
  residentId: string;
  nik: string;
  familyCardNumber: string;
  fullName: string;
  gender: string;
  birthPlace?: string;
  birthDate?: string;
  religion?: string;
  maritalStatus?: string;
  education?: string;
  occupation?: string;
  rt?: string;
  address?: string;
  domicileStatus?: string;
  arrivalDate?: string;
  departureDate?: string;
  note?: string;
}

export interface FamilyRecord {
  id?: string;
  familyCardNumber: string;
  headName: string;
  rt?: string;
  address?: string;
  housingStatus?: string;
  memberCount: number;
  inputDate?: string;
  note?: string;
}

export interface PopulationMutationRecord {
  id?: string;
  mutationId: string;
  date: string;
  nik?: string;
  name?: string;
  mutationType: string;
  originRt?: string;
  destinationRt?: string;
  address?: string;
  documentNumber?: string;
  officer?: string;
  note?: string;
}

export interface SocialAssistanceRecord {
  id?: string;
  recordId: string;
  recipientName: string;
  nik?: string;
  familyCardNumber?: string;
  rt?: string;
  aidType: string;
  period?: string;
  receiptStatus?: string;
  date?: string;
  programSource?: string;
  note?: string;
}

export interface InventoryRecord {
  id?: string;
  itemId: string;
  itemName: string;
  category?: string;
  itemCode?: string;
  quantity: number;
  unit?: string;
  condition?: string;
  location?: string;
  acquisitionYear?: string;
  fundingSource?: string;
  personInCharge?: string;
  note?: string;
}
