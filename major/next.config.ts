import * as path from "path";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
  typescript: {
    ignoreBuildErrors: false, // Set false for safer builds
  },
  eslint: {
    ignoreDuringBuilds: false, // Set false for proper linting
  },
};

export default nextConfig;
