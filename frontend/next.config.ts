import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      root: ".",
    },
    // @ts-ignore
    allowedDevOrigins: ['unsquelched-untributarily-kayden.ngrok-free.dev'],
  },
  // In Next.js 15+, it might be under experimental or top-level, so adding to top-level too
  // @ts-ignore
  allowedDevOrigins: ['unsquelched-untributarily-kayden.ngrok-free.dev'],
};

export default nextConfig;
