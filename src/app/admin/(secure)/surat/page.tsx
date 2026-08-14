import AdminCollectionManager from "@/components/admin/AdminCollectionManager";

export default function Page() {
  return (
    <AdminCollectionManager
      collectionName="serviceRequests"
      publicHref="/cek-surat"
      title="Permohonan Surat"
      description="Kelola permohonan surat dari website dan Google Spreadsheet. Data ini memakai Firestore yang sama sehingga perubahan status tetap sejalur."
      defaults={{ticketId:"",name:"",nik:"",rt:"",letterType:"",purpose:"",letterNumber:"",status:"Baru",staff:"",completedDate:"",documentUrl:"",verificationUrl:"",publicNote:"",isPublicVerification:false}}
      displayFields={["ticketId","name","letterType","status"]}
      fields={[
        {key:"ticketId",label:"ID Surat",type:"text",required:true},
        {key:"name",label:"Nama Pemohon",type:"text",required:true},
        {key:"nik",label:"NIK",type:"text"},
        {key:"rt",label:"RT",type:"text"},
        {key:"letterType",label:"Jenis Surat",type:"text",required:true},
        {key:"purpose",label:"Keperluan",type:"textarea",full:true},
        {key:"letterNumber",label:"Nomor Surat",type:"text"},
        {key:"status",label:"Status",type:"select",options:["Baru","Diproses","Selesai","Ditolak","Dibatalkan"]},
        {key:"staff",label:"Petugas",type:"text"},
        {key:"completedDate",label:"Tanggal Selesai",type:"date"},
        {key:"documentUrl",label:"Link Dokumen",type:"text",full:true},
        {key:"verificationUrl",label:"URL Verifikasi",type:"text",full:true},
        {key:"publicNote",label:"Keterangan Publik",type:"textarea",full:true},
        {key:"isPublicVerification",label:"Tampil pada Cek Surat",type:"checkbox"},
      ]}
    />
  );
}
