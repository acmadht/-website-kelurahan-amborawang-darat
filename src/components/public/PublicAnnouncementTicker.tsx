"use client";

import type { CSSProperties } from "react";
import type { Announcement } from "@/types";
import styles from "./PublicAnnouncementTicker.module.css";

const MAX_TICKER_ITEMS = 5;

function timestampToMillis(value: unknown): number {
  if (!value) return 0;

  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  if (value instanceof Date) return value.getTime();

  if (typeof value === "object") {
    const candidate = value as {
      toMillis?: () => number;
      toDate?: () => Date;
      seconds?: number;
      _seconds?: number;
    };

    if (typeof candidate.toMillis === "function") {
      return candidate.toMillis();
    }

    if (typeof candidate.toDate === "function") {
      return candidate.toDate().getTime();
    }

    const seconds = candidate.seconds ?? candidate._seconds;
    if (typeof seconds === "number") return seconds * 1000;
  }

  return 0;
}

function todayInMakassar(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";

  return `${year}-${month}-${day}`;
}

function isStillValid(item: Announcement, today: string): boolean {
  if (item.isActive === false) return false;
  if (!item.validUntil) return true;
  return item.validUntil >= today;
}

function MegaphoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m3 11 18-5v12L3 14v-3Z" />
      <path d="M11.6 16.1 13 21H8l-1.3-6" />
      <path d="M3 11v3" />
    </svg>
  );
}

function AnnouncementItem({
  item,
  duplicate = false,
}: {
  item: Announcement;
  duplicate?: boolean;
}) {
  const content = (
    <>
      {item.priority === "penting" ? (
        <span className={styles.important}>Penting</span>
      ) : null}
      <strong>{item.title}</strong>
      {item.summary ? <span className={styles.summary}>{item.summary}</span> : null}
      {item.attachmentUrl && !duplicate ? (
        <span className={styles.readMore} aria-hidden="true">
          Lihat ↗
        </span>
      ) : null}
    </>
  );

  return (
    <span className={styles.item}>
      <span className={styles.separator} aria-hidden="true">
        <span />
      </span>
      {item.attachmentUrl && !duplicate ? (
        <a
          href={item.attachmentUrl}
          target={item.attachmentUrl.startsWith("http") ? "_blank" : undefined}
          rel={item.attachmentUrl.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      ) : (
        <span className={styles.itemContent}>{content}</span>
      )}
    </span>
  );
}

export default function PublicAnnouncementTicker({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const today = todayInMakassar();

  const latest = [...announcements]
    .filter((item) => isStillValid(item, today))
    .sort((a, b) => {
      const dateA = timestampToMillis(a.createdAt) || timestampToMillis(a.updatedAt);
      const dateB = timestampToMillis(b.createdAt) || timestampToMillis(b.updatedAt);

      if (dateA !== dateB) return dateB - dateA;
      return Number(a.order ?? 0) - Number(b.order ?? 0);
    })
    .slice(0, MAX_TICKER_ITEMS);

  if (!latest.length) return null;

  const totalCharacters = latest.reduce(
    (total, item) => total + item.title.length + (item.summary?.length ?? 0),
    0,
  );
  const duration = Math.min(66, Math.max(30, Math.round(totalCharacters / 6.5)));
  const tickerStyle = {
    "--ticker-duration": `${duration}s`,
  } as CSSProperties;

  return (
    <aside className={styles.ticker} aria-label="Pengumuman terbaru">
      <div className={styles.inner}>
        <div className={styles.label}>
          <span className={styles.iconWrap} aria-hidden="true">
            <MegaphoneIcon />
          </span>
          <span className={styles.labelText}>Pengumuman</span>
          <small>Terbaru</small>
        </div>

        <div className={styles.viewport}>
          <div className={styles.track} style={tickerStyle}>
            <div className={styles.group}>
              {latest.map((item, index) => (
                <AnnouncementItem
                  key={`announcement-first-${item.id ?? index}`}
                  item={item}
                />
              ))}
            </div>
            <div className={styles.group} aria-hidden="true">
              {latest.map((item, index) => (
                <AnnouncementItem
                  key={`announcement-copy-${item.id ?? index}`}
                  item={item}
                  duplicate
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
