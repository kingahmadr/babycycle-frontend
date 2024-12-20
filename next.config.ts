import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ibb.co"], // Add allowed domains here
  },
};

export default nextConfig;
