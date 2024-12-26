import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 's3-jak01.storageraya.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
};


export default nextConfig;
