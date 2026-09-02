import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // English lives at the root; Arabic at /ar. Both render from app/[locale].
    return [{ source: "/", destination: "/en" }, { source: "/work/:id", destination: "/en/work/:id" }];
  },
  async redirects() {
    return [{ source: "/en", destination: "/", permanent: true }, { source: "/en/work/:id", destination: "/work/:id", permanent: true }];
  },
};

export default nextConfig;
