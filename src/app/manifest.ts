import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sirpi Matrimony",
    short_name: "Sirpi",
    description: "Bilingual Tamil/English matrimony platform",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F7F2EC",
    theme_color: "#8A1538",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
