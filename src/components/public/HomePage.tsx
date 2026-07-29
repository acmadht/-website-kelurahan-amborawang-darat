"use client";

import Link from "next/link";
import {
  demoAgendas, demoAlbums, demoAnnouncements, demoHeroSlides, demoKknTeam,
  demoOfficials, demoPosts, demoRts, demoRws, demoServices, demoSettings,
} from "@/data/demo";
import { useCollectionData, useDocumentData } from "@/hooks/useFirestoreData";
import { formatDate, normalizeWhatsapp } from "@/lib/utils";
import type { AgendaItem, Announcement, GalleryAlbum, HeroSlide, KknTeam, Official, PostItem, RegionLeader, ServiceItem, SiteSettings } from "@/types";
import AnimatedCounter from "./AnimatedCounter";
import HeroSlider from "./HeroSlider";
import PublicFooter from "./PublicFooter";
import PublicHeader from "./PublicHeader";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function HomePage() {
  const { data: settings, usingDemo } = useDocumentData<SiteSettings>("siteSettings", "main", demoSettings);
  const { data: slides } = useCollectionData<HeroSlide>("heroSlides", demoHeroSlides);
  const { data: services } = useCollectionData<ServiceItem>("services", demoServices);
  const { data: officials } = useCollectionData<Official>("officials", demoOfficials);
  const { data: rws } = useCollectionData<RegionLeader>("rws", demoRws);
  const { data: rts } = useCollectionData<RegionLeader>("rts", demoRts);
  const { data: posts } = useCollectionData<PostItem>("posts", demoPosts, [{ field: "status", op: "==", value: "published" }]);
  const { data: announcements } = useCollectionData<Announcement>("announcements", demoAnnouncements);
  const { data: agendas } = useCollectionData<AgendaItem>("agendas", demoAgendas);
  const { data: albums } = useCollectionData<GalleryAlbum>("galleryAlbums", demoAlbums, [{ field: "status", op: "==", value: "published" }]);
  const { data: kkn } = useDocumentData<KknTeam>("kknTeam", "main", demoKknTeam);

  const activeServices = services.filter((item) => item.isActive && item.isFeatured).slice(0, 8);
  const activeOfficials = officials.filter((item) => item.isActive).slice(0, 4);
  const publishedPosts = posts.filter((item) => item.status === "published").slice(0, 6);
  const activeAnnouncements = announcements.filter((item) => item.isActive).slice(0, 4);
  const featuredAlbums = albums.filter((item) => item.status === "published").slice(0, 6);
  const population = rws.reduce((total, item) => total + (Number(item.populationCount) || 0), 0);
  const families = rws.reduce((total, item) => total + (Number(item.familyCount) || 0), 0);
  const leader = activeOfficials.find((item) => item.title.toLowerCase() === "lurah") ?? activeOfficials[0] ?? demoOfficials[0];
  const whatsapp = normalizeWhatsapp(settings.whatsapp);

  return (
    <>
      <PublicHeader settings={settings} />
      <main>
        <HeroSlider slides={slides} settings={settings} />
        <div className="container quick-info">
          <div className="quick-grid">
            {[
              ["Jam", "Jam Pelayanan", settings.serviceHours],
              ["WA", "WhatsApp", settings.whatsapp],
              ["Lok", "Alamat Kantor", settings.address],
              ["Info", "Pengaduan", "Sampaikan aspirasi melalui layanan kontak"],
            ].map(([icon, title, text], index) => (
              <Reveal key={title} delay={index * 80} enabled={settings.animationEnabled}>
                <div className="quick-item"><div className="icon-box">{icon}</div><div><strong>{title}</strong><span>{text}</span></div></div>
              </Reveal>
            ))}
          </div>
        </div>

        {usingDemo ? <div className="container" style={{ marginTop: 24 }}><div className="demo-box">Website sedang memakai data contoh. Hubungkan Firebase dan isi data melalui dashboard admin untuk memakai data asli.</div></div> : null}

        <section className="section section-white">
          <div className="container welcome-grid">
            <Reveal enabled={settings.animationEnabled}>
              <div className="photo-frame"><img src={leader.photoUrl || "/images/person-1.svg"} alt={leader.name} /><div className="photo-label"><strong>{leader.name}</strong><span>{leader.title}</span></div></div>
            </Reveal>
            <Reveal delay={120} enabled={settings.animationEnabled}>
              <span className="eyebrow">Sambutan Lurah</span>
              <h2 className="section-title">Pelayanan yang dekat dan informasi yang terbuka</h2>
              <p className="section-copy">Selamat datang di website resmi {settings.villageName}. Website ini menjadi sarana informasi, pelayanan, dokumentasi kegiatan, serta penghubung antara pemerintah kelurahan dan masyarakat.</p>
              <p className="muted">Kami berkomitmen menyediakan informasi yang jelas dan memperbarui konten secara berkala melalui dashboard admin.</p>
              <div className="hero-actions"><Link href="/profil" className="btn btn-primary">Baca Profil Kelurahan →</Link><Link href="/pemerintahan" className="btn btn-outline">Lihat Aparatur</Link></div>
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Layanan Publik" title="Temukan layanan yang dibutuhkan" description="Periksa persyaratan, prosedur, waktu penyelesaian, biaya, dan kontak layanan sebelum datang ke kantor kelurahan." />
            <div className="grid grid-4">
              {activeServices.map((item, index) => <Reveal key={item.id ?? item.slug} delay={index * 70} enabled={settings.animationEnabled}><article className="card card-pad card-hover service-card"><div className="icon-box">{item.icon || "L"}</div><h3>{item.name}</h3><p>{item.summary}</p><Link className="text-link" href="/layanan">Lihat persyaratan →</Link></article></Reveal>)}
            </div>
            <div style={{ marginTop: 28 }}><Link className="btn btn-outline" href="/layanan">Lihat Semua Layanan</Link></div>
          </div>
        </section>

        <section className="section section-navy">
          <div className="container">
            <SectionHeading eyebrow="Data Singkat" title="Kelurahan dalam angka" description="Statistik dapat diubah kapan saja melalui dashboard admin." light />
            <div className="stat-grid">
              {[
                [population || 5280, "Penduduk"], [families || 1430, "Kepala Keluarga"],
                [rws.filter((x) => x.isActive).length, "RW"], [rts.filter((x) => x.isActive).length, "RT"],
              ].map(([value, label], index) => <Reveal key={String(label)} delay={index * 80} enabled={settings.animationEnabled}><div className="stat-item"><div className="stat-value"><AnimatedCounter value={Number(value)} enabled={settings.animationEnabled} /></div><div className="stat-label">{label}</div></div></Reveal>)}
            </div>
          </div>
        </section>

        <section className="section section-white">
          <div className="container">
            <SectionHeading eyebrow="Pemerintahan" title="Aparatur kelurahan" description="Kenali lurah dan perangkat yang menjalankan pemerintahan serta pelayanan masyarakat." />
            <div className="grid grid-4">
              {activeOfficials.map((item, index) => <Reveal key={item.id ?? item.name} delay={index * 80} enabled={settings.animationEnabled}><article className="card card-hover official-card"><img src={item.photoUrl || "/images/person-1.svg"} alt={item.name} /><div className="official-info"><h3>{item.name}</h3><p>{item.title}</p></div></article></Reveal>)}
            </div>
            <div style={{ marginTop: 28 }}><Link className="btn btn-primary" href="/pemerintahan">Lihat Struktur Lengkap →</Link></div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Informasi Terbaru" title="Berita kelurahan" description="Kegiatan, pelayanan, pembangunan, dan informasi masyarakat terkini." />
            <div className="grid grid-3">
              {publishedPosts.map((item, index) => <Reveal key={item.id ?? item.slug} delay={index * 70} enabled={settings.animationEnabled}><article className="card card-hover news-card"><img src={item.coverImageUrl || "/images/news-1.svg"} alt={item.title} /><div className="news-body"><span className="badge">{item.category}</span><h3>{item.title}</h3><p>{item.summary}</p><Link className="text-link" href={`/berita/${item.slug}`}>Baca berita →</Link></div></article></Reveal>)}
            </div>
          </div>
        </section>

        <section className="section section-white">
          <div className="container grid grid-2">
            <div><SectionHeading eyebrow="Pengumuman" title="Informasi penting" description="Pengumuman aktif dan pemberitahuan pelayanan." /><div className="announcement-list">{activeAnnouncements.map((item) => <div className="announcement" key={item.id ?? item.title}><span className={`badge ${item.priority === "penting" ? "badge-important" : ""}`}>{item.priority}</span><div><h3>{item.title}</h3><p>{item.summary}</p></div></div>)}</div></div>
            <div><SectionHeading eyebrow="Agenda" title="Kegiatan terdekat" description="Jadwal rapat, pelayanan, dan kegiatan masyarakat." /><div className="timeline">{agendas.slice(0, 4).map((item) => <div className="timeline-item" key={item.id ?? item.title}><div className="timeline-dot">{new Date(item.date).getDate() || "•"}</div><div className="timeline-content"><span className="badge">{formatDate(item.date)}</span><h3>{item.title}</h3><p>{item.time} • {item.location}</p><p>{item.description}</p></div></div>)}</div></div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Dokumentasi" title="Galeri kegiatan" description="Foto kegiatan kelurahan, RT, RW, masyarakat, dan kelompok KKN." />
            <div className="gallery-grid">{featuredAlbums.map((album) => <Link href="/galeri" className="gallery-card" key={album.id ?? album.slug}><img src={album.coverImageUrl || "/images/gallery-1.svg"} alt={album.title} /><div className="gallery-overlay"><span className="badge">{album.category}</span><h3>{album.title}</h3><p>{album.photoCount} foto</p></div></Link>)}</div>
          </div>
        </section>

        <section className="section section-white">
          <div className="container">
            <div className="kkn-panel"><div className="kkn-grid"><div><span className="eyebrow" style={{ color: "#7dc4ff" }}>Tim Pengembang</span><h2 className="section-title light">Website dikembangkan bersama kelompok KKN</h2><p className="section-copy light">{kkn.description}</p><p><strong>{kkn.groupName}</strong><br />{kkn.universityName} • {kkn.year}</p><div className="hero-actions"><Link className="btn btn-secondary" href="/tim-kkn">Lihat Tim KKN</Link><Link className="btn btn-primary" href="/galeri">Galeri KKN →</Link></div></div><img src={kkn.groupPhotoUrl || "/images/kkn-team.svg"} alt={`Tim ${kkn.groupName}`} /></div></div>
          </div>
        </section>

        <section className="section">
          <div className="container contact-grid">
            <div><SectionHeading eyebrow="Kontak" title="Hubungi kelurahan" description="Gunakan kontak resmi untuk informasi layanan dan pengaduan masyarakat." /><div className="contact-list">{[["Alamat",settings.address],["Telepon",settings.phone],["WhatsApp",settings.whatsapp],["Email",settings.email],["Jam",settings.serviceHours]].map(([label,value]) => <div className="contact-item" key={label}><div className="icon-box">{label.slice(0,2)}</div><div><strong>{label}</strong><div className="muted">{value}</div></div></div>)}</div>{whatsapp ? <div style={{ marginTop: 20 }}><a className="btn btn-primary" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">Hubungi WhatsApp →</a></div> : null}</div>
            <div className="map-box">{settings.mapsEmbedUrl ? <iframe src={settings.mapsEmbedUrl} loading="lazy" title="Peta kantor kelurahan" /> : <div><strong>Peta belum dipasang</strong><p>Masukkan URL embed Google Maps melalui menu Pengaturan Website pada dashboard admin.</p></div>}</div>
          </div>
        </section>
      </main>
      <PublicFooter settings={settings} />
    </>
  );
}
