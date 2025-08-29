import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sorsele-assets.s3.eu-north-1.amazonaws.com", // replace this
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
