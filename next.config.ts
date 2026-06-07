import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,

  images: {
    // next/image servirá AVIF/WebP automáticamente cuando el navegador lo soporte.
    formats: ["image/avif", "image/webp"],
    // Cuando migres modelos/imágenes a un CDN, añade aquí su dominio:
    // remotePatterns: [{ protocol: "https", hostname: "cdn.xhiggs.com" }]
    remotePatterns: [],
  },

  experimental: {
    // Tree-shaking agresivo: importa solo los iconos/utilidades que uses,
    // no el paquete entero. Reduce el bundle cliente sensiblemente.
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
  },

  turbopack: {
    // Fija la raíz del workspace para evitar que Turbopack tome el
    // package-lock.json de un directorio padre como raíz del monorepo.
    root: __dirname,
  },
};

export default nextConfig;
