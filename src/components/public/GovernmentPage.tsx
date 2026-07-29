"use client";
import { demoOfficials } from "@/data/demo";
import { useCollectionData } from "@/hooks/useFirestoreData";
import type { Official } from "@/types";
import PageHero from "./PageHero";
import PublicShell from "./PublicShell";
export default function GovernmentPage(){
 const {data}=useCollectionData<Official>("officials",demoOfficials); const active=data.filter(x=>x.isActive);
 return <PublicShell><PageHero eyebrow="Pemerintahan" title="Aparatur dan struktur organisasi" description="Informasi lurah, perangkat kelurahan, lembaga kemasyarakatan, ketua RW, dan ketua RT." /><section className="section"><div className="container"><div className="grid grid-3">{active.map((item)=><article className="card card-hover official-card" key={item.id??item.name}><img src={item.photoUrl||"/images/person-1.svg"} alt={item.name}/><div className="official-info"><span className="badge">{item.category}</span><h3>{item.name}</h3><p>{item.title}</p>{item.description?<div className="muted" style={{marginTop:10}}>{item.description}</div>:null}</div></article>)}</div></div></section><section className="section section-white"><div className="container"><div className="content-card"><h2>Struktur organisasi dinamis</h2><p>Urutan struktur mengikuti nilai urutan pada dashboard admin. Admin dapat mengganti nama, jabatan, foto, kategori, masa jabatan, dan status aktif tanpa mengubah kode.</p></div></div></section></PublicShell>;
}
