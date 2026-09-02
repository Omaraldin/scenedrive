import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // English lives at the root; Arabic at /ar. Both render from app/[locale].
    return [{ source: "/", destination: "/en" }];
  },
  async redirects() {
    return [{ source: "/en", destination: "/", permanent: true }];
  },
};

export default nextConfig;
