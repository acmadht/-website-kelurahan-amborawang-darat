import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="complaints"
      publicHref="/cek-pengaduan"
      title="Pengaduan Masyarakat"
      description="Kelola pengaduan yang masuk dari website dan Google Spreadsheet. Identitas pelapor tetap berada pada area admin."
      defaults={{ticketId:"",name:"",phone:"",rt:"",category:"",message:"",location:"",status:"Baru",followUp:"",staff:"",targetDate:"",completedDate:"",publicNote:""}}
      displayFields={["ticketId","name","category","status"]}
      fields={[
        {key:"ticketId",label:"ID Pengaduan",type:"text",required:true},
        {key:"name",label:"Nama Pelapor",type:"text"},
        {key:"phone",label:"Kontak",type:"text"},
        {key:"rt",label:"RT",type:"text"},
        {key:"category",label:"Kategori",type:"text"},
        {key:"message",label:"Isi Pengaduan",type:"textarea",full:true},
        {key:"location",label:"Lokasi",type:"text",full:true},
        {key:"status",label:"Status",type:"select",options:["Baru","Diproses","Selesai","Ditolak"]},
        {key:"followUp",label:"Tindak Lanjut",type:"textarea",full:true},
        {key:"staff",label:"Petugas",type:"text"},
        {key:"targetDate",label:"Target Selesai",type:"date"},
        {key:"completedDate",label:"Tanggal Selesai",type:"date"},
        {key:"publicNote",label:"Keterangan Publik",type:"textarea",full:true},
      ]}
    />
  );
}
