import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Linkface — Quiet Luxury Link in Bio",
  description:
    "An editorial colophon for your digital presence. Curate destinations with architectural precision.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://linktree-livid-three.vercel.app"),
  openGraph: {
    title: "Linkface — Quiet Luxury Link in Bio",
    description: "Your entire presence, reduced to one link.",
    type: "website",
    siteName: "Linkface",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkface — Quiet Luxury Link in Bio",
    description: "Your entire presence, reduced to one link.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-[#0a0f1c] text-[#f5f1e8]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
