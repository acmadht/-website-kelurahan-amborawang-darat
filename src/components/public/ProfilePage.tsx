"use client";
import { demoSettings } from "@/data/demo";
import { useDocumentData } from "@/hooks/useFirestoreData";
import PublicShell from "./PublicShell";
import PageHero from "./PageHero";

interface ProfileContent { history: string; vision: string; missions: string[]; geography: string; boundaries: string; potential: string; facilities: string[]; imageUrl: string; }
const fallback: ProfileContent = {
 history: "Kelurahan Contoh berkembang sebagai wilayah permukiman, pelayanan, kegiatan ekonomi masyarakat, dan pusat interaksi sosial di tingkat lokal. Isi sejarah ini dapat diganti melalui dashboard admin tanpa mengubah kode.",
 vision: "Terwujudnya pelayanan kelurahan yang profesional, transparan, responsif, dan dekat dengan masyarakat.",
 missions: ["Meningkatkan kualitas pelayanan publik", "Mendorong keterbukaan informasi", "Memperkuat partisipasi RT, RW, dan masyarakat", "Mengembangkan potensi sosial dan ekonomi wilayah"],
 geography: "Informasi luas wilayah, kondisi geografis, penggunaan lahan, dan karakter lingkungan dapat ditulis pada bagian ini.",
 boundaries: "Batas utara, selatan, timur, dan barat dapat dicantumkan secara rinci melalui dashboard admin.",
 potential: "Potensi UMKM, pertanian, jasa, budaya, pemuda, dan kegiatan masyarakat dapat diperbarui secara berkala.",
 facilities: ["Kantor kelurahan", "Tempat ibadah", "Sekolah", "Fasilitas kesehatan", "Ruang terbuka dan fasilitas olahraga"],
 imageUrl: "/images/office.svg",
};
export default function ProfilePage() {
 const { data } = useDocumentData<ProfileContent>("pages", "profil", fallback);
 const { data: settings } = useDocumentData("siteSettings", "main", demoSettings);
 return <PublicShell><PageHero eyebrow="Profil" title={`Profil ${settings.villageName}`} description="Sejarah, visi, misi, kondisi wilayah, fasilitas, dan potensi kelurahan." /><section className="section"><div className="container grid grid-2"><img className="card" style={{ width:"100%", minHeight:420, objectFit:"cover" }} src={data.imageUrl} alt="Kantor kelurahan" /><div className="content-card rich-text"><h2>Sejarah Kelurahan</h2><p>{data.history}</p><h2>Visi</h2><p>{data.vision}</p><h2>Misi</h2><ol className="list-clean">{data.missions.map((item) => <li key={item}>{item}</li>)}</ol></div></div><div className="container grid grid-3" style={{ marginTop:30 }}><div className="content-card"><h2>Kondisi Geografis</h2><p>{data.geography}</p></div><div className="content-card"><h2>Batas Wilayah</h2><p>{data.boundaries}</p></div><div className="content-card"><h2>Potensi Kelurahan</h2><p>{data.potential}</p></div></div><div className="container content-card" style={{ marginTop:30 }}><h2>Fasilitas Umum</h2><ul className="list-clean">{data.facilities.map((item) => <li key={item}>{item}</li>)}</ul></div></section></PublicShell>;
}
