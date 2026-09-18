import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "心理諮商知識圖譜 | Psych Knowledge Graph",
  description:
    "以知識圖譜檢索諮商與臨床心理學的核心概念——治療學派、理論、疾患、評估、技術與倫理之間的關係網。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={`${notoSansTC.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
