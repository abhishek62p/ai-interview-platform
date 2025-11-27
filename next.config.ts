import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["bcrypt"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", 
      },
    ],
  },
};

export default nextConfig;
