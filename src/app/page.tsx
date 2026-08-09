import HomePage from "@/components/public/HomePage";

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "GovernmentOrganization",
        "@id": "https://website-kelurahan-amborawang-darat.vercel.app/#organization",
        "name": "Pemerintah Kelurahan Amborawang Darat",
        "url": "https://website-kelurahan-amborawang-darat.vercel.app/",
        "logo": "https://website-kelurahan-amborawang-darat.vercel.app/images/logo-amborawang-darat.png",
        "image": "https://website-kelurahan-amborawang-darat.vercel.app/images/kantor-kelurahan-amborawang-darat.jpg",
        "description": "Pemerintah Kelurahan Amborawang Darat, Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jl. Balikpapan-Handil II KM 42, RT 12",
          "addressLocality": "Amborawang Darat",
          "addressRegion": "Kutai Kartanegara, Kalimantan Timur",
          "postalCode": "75274",
          "addressCountry": "ID"
        },
        "telephone": "+62-812-5800-224",
        "areaServed": {
          "@type": "AdministrativeArea",
          "name": "Kelurahan Amborawang Darat"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://website-kelurahan-amborawang-darat.vercel.app/#website",
        "url": "https://website-kelurahan-amborawang-darat.vercel.app/",
        "name": "Website Resmi Kelurahan Amborawang Darat",
        "description": "Website resmi Kelurahan Amborawang Darat, Kecamatan Samboja Barat, Kabupaten Kutai Kartanegara, Kalimantan Timur.",
        "publisher": {
          "@id": "https://website-kelurahan-amborawang-darat.vercel.app/#organization"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  );
}
