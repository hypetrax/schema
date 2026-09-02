import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://schema.bartpullen.nl' : undefined,
};

export default nextConfig;
