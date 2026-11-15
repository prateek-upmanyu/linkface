import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Linklet — Editorial Digital Presence",
  description:
    "An editorial colophon for your digital presence. Curate destinations from 50+ platforms, spotlight three collaborators, and observe private traffic.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://linktree-livid-three.vercel.app"),
  openGraph: {
    title: "Linklet — Editorial Digital Presence",
    description:
      "Your entire presence, reduced to one link. Curate destinations with architectural elegance.",
    type: "website",
    siteName: "Linklet",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linklet — Editorial Digital Presence",
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
      className={`${bodoniModa.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body selection:bg-[#0a3d7a] selection:text-[#d0f600]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
