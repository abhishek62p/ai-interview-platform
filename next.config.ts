import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["bcrypt"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Restrict to specific known hostnames for better security
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
