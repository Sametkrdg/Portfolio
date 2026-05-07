import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-*.r2.dev",   // Cloudflare R2 public bucket CDN
      },
    ],
  },
  experimental: {
    /*
     * Tree-shake large barrel packages on both Turbopack and webpack.
     * Turbopack (default in Next 16) handles code splitting automatically,
     * so manual splitChunks config is not needed.
     */
    optimizePackageImports: [
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "framer-motion",
      "gsap",
      "ai",
      "@ai-sdk/google",
      "zustand",
    ],
  },
};

export default nextConfig;
