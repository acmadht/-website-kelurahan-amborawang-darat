import { redirect } from "next/navigation";

export default function Page() {
  // Konten KKN bersifat statis dan tidak dikelola dari dashboard kelurahan.
  redirect("/admin");
}
