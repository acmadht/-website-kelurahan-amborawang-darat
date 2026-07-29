"use client";

import Link from "next/link";
import { useState } from "react";
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
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <img src={settings.logoUrl || "/images/logo-placeholder.svg"} alt={`Logo ${settings.villageName}`} />
          <div><strong>{settings.villageName}</strong><span>Website resmi kelurahan</span></div>
        </Link>
        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Navigasi utama">
          {menu.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        </nav>
        <button className="mobile-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>Menu</button>
      </div>
    </header>
  );
}
