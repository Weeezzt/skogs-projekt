import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        port: "",
        hostname: "allmskog-ac.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        port: "",
        hostname: "s3.eu-north-1.amazonaws.com",
        pathname: "/allmskog-ac/**",
      },
    ],
  },
};
console.log("🚀 Config loaded build marker: 2025-09-15-B");

export default nextConfig;
