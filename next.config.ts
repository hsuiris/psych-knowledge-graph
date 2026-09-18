import type { NextConfig } from "next";

// 靜態輸出，部署到 GitHub Pages 的子路徑
const repo = "psych-knowledge-graph";
const isPages = process.env.DEPLOY_TARGET === "pages";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages 的網址是 /concept/cbt/ 這種形式，要輸出成資料夾加 index.html 才對得上
  trailingSlash: true,
  images: { unoptimized: true },
  // public/ 底下的圖片路徑要自己補上子路徑，給 <img> 和 canvas 用
  env: { NEXT_PUBLIC_BASE_PATH: isPages ? `/${repo}` : "" },
  ...(isPages ? { basePath: `/${repo}`, assetPrefix: `/${repo}/` } : {}),
};

export default nextConfig;
