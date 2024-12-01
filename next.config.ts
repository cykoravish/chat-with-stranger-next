import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "randomuser.me" }],
  },
  devIndicators: {
    appIsrStatus: false,
  },
};

export default nextConfig;
