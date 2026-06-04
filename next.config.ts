import type { NextConfig } from "next";

const repo = "spread-content-opt-sys-test-1";

const nextConfig: NextConfig = {
  output: "export",
  basePath: `/${repo}`,
  assetPrefix: `/${repo}`,
  trailingSlash: true,
  images: { unoptimized: true },
  allowedDevOrigins: ["10.12.28.255", "localhost"],
};

export default nextConfig;
