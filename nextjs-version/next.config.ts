import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure allowed development origins to prevent cross-origin warnings
  experimental: {
    allowedDevOrigins: ["*"],
  },
};

export default nextConfig;
