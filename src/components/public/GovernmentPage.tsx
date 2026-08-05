"use client";

import { resolveAmborawangOfficials } from "@/data/amborawang";
import { demoOfficials } from "@/data/demo";
import { useCollectionData } from "@/hooks/useFirestoreData";
import type { Official } from "@/types";
import PageHero from "./PageHero";
import PublicShell from "./PublicShell";

export default function GovernmentPage() {
  const { data } = useCollectionData<Official>("officials", demoOfficials);
  const active = resolveAmborawangOfficials(data);

  return (
    <PublicShell>
      <PageHero eyebrow="Pemerintahan" title="Aparatur dan struktur organisasi" description="Informasi lurah dan perangkat Kelurahan Amborawang Darat yang menjalankan pemerintahan serta pelayanan masyarakat." />
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {active.map((item) => (
              <article className="card card-hover official-card" key={item.id ?? item.name}>
                <img src={item.photoUrl || "/images/official-lurah.svg"} alt={`Foto ${item.name}`} />
                <div className="official-info">
                  <span className="badge">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{item.title}</p>
                  {item.description ? <div className="muted" style={{ marginTop: 10 }}>{item.description}</div> : null}
                </div>
              </article>
            ))}
          </div>
          <p className="official-photo-note">Foto yang tampil saat ini merupakan placeholder. Ganti melalui dashboard admin setelah foto resmi aparatur tersedia.</p>
        </div>
      </section>
    </PublicShell>
  );
}
