import type { Metadata } from "next";
import StatusCheckPage from "@/components/public/StatusCheckPage";
export const metadata:Metadata={title:"Cek Status Pengaduan | Kelurahan Amborawang Darat"};
export default function Page(){return <StatusCheckPage kind="pengaduan"/>}
