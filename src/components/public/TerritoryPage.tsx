"use client";
import { demoRts,demoRws } from "@/data/demo";
import { useCollectionData } from "@/hooks/useFirestoreData";
import type { RegionLeader } from "@/types";
import PageHero from "./PageHero"; import PublicShell from "./PublicShell";
export default function TerritoryPage(){
 const {data:rws}=useCollectionData<RegionLeader>("rws",demoRws); const {data:rts}=useCollectionData<RegionLeader>("rts",demoRts);
 return <PublicShell><PageHero eyebrow="Wilayah" title="Data RW dan RT" description="Struktur wilayah, ketua RW, ketua RT, jumlah penduduk, dan jumlah kepala keluarga." /><section className="section"><div className="container">{rws.filter(x=>x.isActive).map(rw=><div className="content-card" style={{marginBottom:24}} key={rw.id??rw.number}><div className="flex justify-between items-center wrap gap-16"><div><span className="badge">RW {rw.number}</span><h2 style={{marginBottom:4}}>Ketua {rw.chairmanName}</h2><p className="muted">{rw.description||"Profil dan informasi wilayah RW dapat diubah melalui admin."}</p></div><div className="flex gap-16"><div><strong>{rw.populationCount||0}</strong><div className="muted">Penduduk</div></div><div><strong>{rw.familyCount||0}</strong><div className="muted">Kepala keluarga</div></div></div></div><div className="grid grid-3" style={{marginTop:22}}>{rts.filter(rt=>rt.isActive&&rt.rwId===rw.id).map(rt=><div className="card card-pad" key={rt.id??rt.number}><span className="badge">RT {rt.number}</span><h3>{rt.chairmanName}</h3><p className="muted">{rt.populationCount||0} penduduk • {rt.familyCount||0} KK</p>{rt.phone?<p>Kontak: {rt.phone}</p>:null}</div>)}</div></div>)}</div></section></PublicShell>;
}
