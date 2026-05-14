import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
