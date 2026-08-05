"use client";

import Link from "next/link";
import { useState } from "react";
import { AMBORAWANG_LOGO } from "@/data/amborawang";
import type { SiteSettings } from "@/types";

const menu = [
  ["Beranda", "/"], ["Profil", "/profil"], ["Pemerintahan", "/pemerintahan"],
  ["Wilayah", "/wilayah"], ["Layanan", "/layanan"], ["Berita", "/berita"],
  ["Galeri", "/galeri"], ["Dokumen", "/dokumen"], ["Kontak", "/kontak"],
];

export default function PublicHeader({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="brand"
          onClick={() => setOpen(false)}
          aria-label={`Beranda ${settings.villageName}`}
        >
          <span className="brand-logo-frame">
            <img
              src={AMBORAWANG_LOGO}
              alt={`Logo ${settings.villageName}`}
              width={62}
              height={62}
              decoding="async"
              fetchPriority="high"
            />
          </span>
          <div className="brand-copy">
            <strong>{settings.villageName}</strong>
            <span>Website resmi kelurahan</span>
          </div>
        </Link>
        <nav id="public-navigation" className={`nav-links ${open ? "open" : ""}`} aria-label="Navigasi utama">
          {menu.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        </nav>
        <button
          className="mobile-toggle"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="public-navigation"
        >
          Menu
        </button>
      </div>
    </header>
  );
}
