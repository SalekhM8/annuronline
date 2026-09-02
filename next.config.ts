import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow placeholder external images if needed later
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      // v1 → v2 route migrations
      { source: "/offerings", destination: "/courses", permanent: true },
      { source: "/offerings/qaidah", destination: "/courses/qaidah", permanent: true },
      { source: "/offerings/tajweed", destination: "/courses/tajweed", permanent: true },
      { source: "/offerings/arabic", destination: "/courses/arabic", permanent: true },
      { source: "/offerings/hifz", destination: "/courses/hifz", permanent: true },
      { source: "/offerings/islamic-studies", destination: "/courses/islamic-studies", permanent: true },
      { source: "/offerings/quran", destination: "/courses/tajweed", permanent: true },
      { source: "/offerings/naseeha", destination: "/counselling", permanent: true },
      { source: "/offerings/counselling", destination: "/counselling", permanent: true },
      { source: "/enroll", destination: "/enrol", permanent: true },
      { source: "/counselling-booking", destination: "/counselling", permanent: true },
    ];
  },
};

export default nextConfig;
