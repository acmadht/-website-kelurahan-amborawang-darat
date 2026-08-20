import AdminCollectionManager from "@/components/admin/AdminCollectionManager";
import { AMBORAWANG_RT_OPTIONS } from "@/lib/rtSlots";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="complaints"
      publicHref="/cek-pengaduan"
      title="Pengaduan Masyarakat"
      connectionNote="RT pengaduan ikut dihitung sebagai agregat internal pada Data RT. Detail pelapor dan isi pengaduan tetap hanya tersedia di admin."
      relatedLinks={[{ label: "Data RT", href: "/admin/rt" }]}
      description="Kelola pengaduan yang masuk dari website dan Google Spreadsheet. RT memakai daftar RT yang sama dan jumlah pengaduan per RT dihitung pada ringkasan admin tanpa membuka identitas pelapor."
      defaults={{ticketId:"",name:"",phone:"",rt:"",category:"",message:"",location:"",status:"Baru",followUp:"",staff:"",targetDate:"",completedDate:"",publicNote:"",showInPublicStats:false}}
      displayFields={["ticketId","name","category","status"]}
      fields={[
        {key:"ticketId",label:"ID Pengaduan",type:"text",required:true},
        {key:"name",label:"Nama Pelapor",type:"text"},
        {key:"phone",label:"Kontak",type:"text"},
        {key:"rt",label:"RT",type:"select",options:AMBORAWANG_RT_OPTIONS},
        {key:"category",label:"Kategori",type:"text"},
        {key:"message",label:"Isi Pengaduan",type:"textarea",full:true},
        {key:"location",label:"Lokasi",type:"text",full:true},
        {key:"status",label:"Status",type:"select",options:["Baru","Diproses","Selesai","Ditolak"]},
        {key:"followUp",label:"Tindak Lanjut",type:"textarea",full:true},
        {key:"staff",label:"Petugas",type:"text"},
        {key:"targetDate",label:"Target Selesai",type:"date"},
        {key:"completedDate",label:"Tanggal Selesai",type:"date"},
        {key:"publicNote",label:"Keterangan Publik",type:"textarea",full:true},
        {key:"showInPublicStats",label:"Masuk Statistik Publik",type:"checkbox"},
      ]}
    />
  );
}
