"use client";

import { useCollectionData, useDocumentData } from "@/hooks/useFirestoreData";
import { demoRts } from "@/data/demo";
import type { RegionLeader } from "@/types";
import PageHero from "./PageHero";
import PublicShell from "./PublicShell";

interface TerritoryContent {
  area: string;
  population: string;
  rtCount: string;
  districtDistance: string;
  northBoundary: string;
  eastBoundary: string;
  southBoundary: string;
  westBoundary: string;
  geography: string;
  connectivity: string;
  mapImageUrl: string;
}

const fallback: TerritoryContent = {
  area: "19,47 km²",
  population: "2.921 jiwa",
  rtCount: "13 RT",
  districtDistance: "5,3 km",
  northBoundary: "Kelurahan Margomulyo",
  eastBoundary: "Kelurahan Argosari dan Kelurahan Amborawang Laut",
  southBoundary: "Kelurahan Salok Api Laut dan Kelurahan Salok Api Darat",
  westBoundary: "Desa Tani Bhakti",
  geography: "Kelurahan Amborawang Darat merupakan bagian dari Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur.",
  connectivity: "Wilayah terhubung dengan koridor Jalan Balikpapan–Handil II dan jaringan jalan lingkungan.",
  mapImageUrl: "/images/peta-amborawang-darat.png",
};

export default function TerritoryPage() {
  const { data } = useDocumentData<TerritoryContent>("pages", "wilayah", fallback);
  const { data: rts } = useCollectionData<RegionLeader>("rts", demoRts);
  const activeRts = rts.filter((rt) => rt.isActive).slice(0, 13);

  return (
    <PublicShell>
      <PageHero
        eyebrow="Wilayah"
        title="Wilayah Amborawang Darat"
        description="Data geografis, batas administratif, statistik wilayah, dan 13 RT Kelurahan Amborawang Darat."
      />

      <section className="section">
        <div className="container">
          <div className="stat-grid">
            {[
              [data.area, "Luas wilayah"],
              [data.population, "Jumlah penduduk"],
              [data.rtCount, "Wilayah RT"],
              [data.districtDistance, "Ke ibu kota kecamatan"],
            ].map(([value, label]) => (
              <div className="stat-item" key={label}>
                <div className="stat-value" style={{ fontSize: "clamp(1.45rem,3vw,2.2rem)" }}>{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container grid grid-2">
          <div className="content-card">
            <span className="eyebrow">Gambaran Wilayah</span>
            <h2>Posisi dan karakter wilayah</h2>
            <p>{data.geography}</p>
            <p className="muted">{data.connectivity}</p>
          </div>

          <div className="content-card">
            <span className="eyebrow">Batas Administratif</span>
            <div className="timeline" style={{ marginTop: 18 }}>
              {[
                ["Utara", data.northBoundary],
                ["Timur", data.eastBoundary],
                ["Selatan", data.southBoundary],
                ["Barat", data.westBoundary],
              ].map(([direction, place]) => (
                <div className="timeline-item" key={direction}>
                  <div className="timeline-dot">{direction.slice(0, 1)}</div>
                  <div className="timeline-content"><span className="badge">{direction}</span><h3>{place}</h3></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-navy">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow" style={{ color: "#7dc4ff" }}>Struktur Wilayah</span>
            <h2 className="section-title light">13 RT Amborawang Darat</h2>
            <p className="section-copy light">Nama ketua, foto, kontak, dan data RT dapat diperbarui melalui dashboard admin.</p>
          </div>
          <div className="grid grid-4">
            {activeRts.map((rt) => (
              <article className="card card-pad" key={rt.id ?? rt.number}>
                <span className="badge">RT {rt.number}</span>
                <h3>{rt.chairmanName || `RT ${rt.number}`}</h3>
                <p className="muted">{rt.description || "Kelurahan Amborawang Darat"}</p>
                {rt.populationCount ? <p>{rt.populationCount} penduduk</p> : null}
                {rt.phone ? <p>Kontak: {rt.phone}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-card">
          <span className="eyebrow">Peta Wilayah</span>
          <h2>Peta administratif Amborawang Darat</h2>
          <img
            src={data.mapImageUrl || "/images/peta-amborawang-darat.png"}
            alt="Peta wilayah Kelurahan Amborawang Darat"
            style={{ width: "100%", maxHeight: 650, objectFit: "contain", marginTop: 20, borderRadius: 16 }}
          />
        </div>
      </section>
    </PublicShell>
  );
}
