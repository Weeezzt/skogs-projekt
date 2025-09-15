import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      // Virtual-hosted–style S3 URL
      {
        protocol: "https",
        hostname: "allmskog-ac.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      // Path-style S3 URL (covers any links like s3.amazonaws.com/<bucket>/...)
      {
        protocol: "https",
        hostname: "s3.eu-north-1.amazonaws.com",
        pathname: "/allmskog-ac/**",
      },
    ],
  },
};

export default nextConfig;
