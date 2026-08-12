import Link from "next/link";
import Image from "next/image";
import type { SiteSettings } from "@/types";
import { normalizeWhatsapp } from "@/lib/utils";

export default function PublicFooter({ settings }: { settings: SiteSettings }) {
  const whatsapp = normalizeWhatsapp(settings.whatsapp);
  const contacts = [settings.phone, settings.email, settings.serviceHours].filter(Boolean);

  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="brand footer-brand">
                <span className="brand-logo-frame">
                  <Image
                    src={settings.logoUrl || "/images/logo-amborawang-darat.png"}
                    alt={`Logo Resmi Kelurahan ${settings.villageName}`}
                    width={48}
                    height={48}
                    unoptimized
                  />
                </span>
                <div><strong>{settings.villageName}</strong><span>{settings.tagline}</span></div>
              </div>
              <p style={{ color: "rgba(255,255,255,.65)", maxWidth: 420 }}>{settings.address}</p>
            </div>
            <div><div className="footer-title">Menu cepat</div><div className="footer-list"><Link href="/profil">Profil</Link><Link href="/layanan">Layanan</Link><Link href="/berita">Berita</Link><Link href="/galeri">Galeri</Link></div></div>
            <div><div className="footer-title">Pemerintahan</div><div className="footer-list"><Link href="/pemerintahan">Aparatur</Link><Link href="/data-rt">Data RT</Link><Link href="/dokumen">Dokumen publik</Link><Link href="/tim-kkn">Tim KKN</Link></div></div>
            <div>
              <div className="footer-title">Kontak</div>
              <div className="footer-list">
                {contacts.map((item) => <span key={item}>{item}</span>)}
                <Link href="/admin/login">Login admin</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} {settings.footerText || `Pemerintah Kelurahan ${settings.villageName}`}</span><span>Website Dibuat Oleh kelompok 2 KKN Reguler UINSI Samarinda</span></div>
        </div>
      </footer>
      {settings.whatsappEnabled && whatsapp ? <a className="whatsapp-float" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" aria-label={`Hubungi Kelurahan ${settings.villageName} melalui WhatsApp`}>WA</a> : null}
    </>
  );
}
