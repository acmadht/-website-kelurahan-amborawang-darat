export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(value?: unknown) {
  if (!value) return "Belum ditentukan";

  let date: Date | null = null;
  if (value instanceof Date) date = value;
  else if (typeof value === "string") date = new Date(value);
  else if (typeof value === "object" && value !== null && "toDate" in value) {
    const maybeTimestamp = value as { toDate: () => Date };
    date = maybeTimestamp.toDate();
  }

  if (!date || Number.isNaN(date.getTime())) return "Belum ditentukan";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function normalizeWhatsapp(value: string) {
  const numbers = value.replace(/\D/g, "");
  if (numbers.startsWith("0")) return `62${numbers.slice(1)}`;
  return numbers;
}

export function sortByOrder<T extends { order?: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
