import type { MetadataRoute } from "next";

const BASE_URL =
    "https://website-kelurahan-amborawang-darat.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
    ];
}