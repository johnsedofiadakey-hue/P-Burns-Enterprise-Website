import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pburns.com'),
  title: "P-Burns Enterprise - Premium Ceramics & Doors",
  description: "Ghana's premier destination for high-quality building finishing materials, luxury ceramics, and robust security doors.",
  keywords: ["ceramics", "doors", "tiles", "building materials", "Ghana", "construction", "pre-order"],
  openGraph: {
    title: "P-Burns Enterprise - Premium Ceramics & Doors",
    description: "Ghana's premier destination for high-quality building finishing materials, luxury ceramics, and robust security doors.",
    url: "https://pburns.com",
    siteName: "P-Burns Enterprise",
    images: [
      {
        url: "/logo_high_quality.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "P-Burns Enterprise - Premium Ceramics & Doors",
    description: "Ghana's premier destination for high-quality building finishing materials, luxury ceramics, and robust security doors.",
    images: ["/logo_high_quality.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
