import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is static, so build plain HTML/JS into `out/` for static hosting (Render Static Site)
  output: "export",
  // /simulation → /simulation/index.html, which static hosts serve without rewrites
  trailingSlash: true,
  // next/image optimization needs a server; serve images as-is
  images: { unoptimized: true },
};

export default nextConfig;
