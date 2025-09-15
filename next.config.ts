import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "allmskog-ac.s3.eu-north-1.amazonaws.com", // replace this
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
