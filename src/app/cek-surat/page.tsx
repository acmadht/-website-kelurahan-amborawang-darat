import type { Metadata } from "next";
import StatusCheckPage from "@/components/public/StatusCheckPage";
export const metadata:Metadata={title:"Cek Status Surat | Kelurahan Amborawang Darat"};
export default function Page(){return <StatusCheckPage kind="surat"/>}
