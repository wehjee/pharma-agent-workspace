import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/pharma-agent-workspace",
  images: { unoptimized: true },
};
export default nextConfig;
