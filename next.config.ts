import type { NextConfig } from "next";

// 靜態輸出，部署到 GitHub Pages 的子路徑
const repo = "psych-knowledge-graph";
const isPages = process.env.DEPLOY_TARGET === "pages";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(isPages ? { basePath: `/${repo}`, assetPrefix: `/${repo}/` } : {}),
};

export default nextConfig;
