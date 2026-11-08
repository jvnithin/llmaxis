import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  compress: true,
  images: {
    // Static export cannot use the Next image optimizer; keep dimensions + priority accurate.
    unoptimized: true,
  },
  // Do not put next/font/google in optimizePackageImports — it breaks font loaders
  // ("Plus_Jakarta_Sans is not a function" via barrel optimization).
};

export default nextConfig;
