import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow placeholder external images if needed later
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
