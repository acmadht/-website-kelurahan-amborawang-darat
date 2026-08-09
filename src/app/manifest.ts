import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kelurahan Amborawang Darat",
    short_name: "Amborawang Darat",
    description: "Website resmi Kelurahan Amborawang Darat, Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1e3a8a",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
