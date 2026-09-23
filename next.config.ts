import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
      { protocol: "https", hostname: "api.senja.sabirudigital.id", pathname: "/storage/**" },
      { protocol: "https", hostname: "staging-api.senja.sabirudigital.id", pathname: "/storage/**" },
    ],
  },
};

export default nextConfig;
