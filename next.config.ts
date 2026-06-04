import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Enable persistent caching for the development server
    turbopackFileSystemCacheForDev: true,

    // You can also enable it for production builds (experimental)
    turbopackFileSystemCacheForBuild: true,
  },
};

export default nextConfig;
