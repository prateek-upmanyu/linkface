import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
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
  title: {
    default: "Linkface — Quiet Luxury Link in Bio for Creators & Brands",
    template: "%s | Linkface",
  },
  description:
    "Curate your digital destinations with architectural precision. The fastest, cleanest link in bio platform with high-conversion landing pages, real-time analytics, and custom themes.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://linkface.in"),
  keywords: [
    "link in bio",
    "linkface",
    "creator links",
    "biolink",
    "social links",
    "linktree alternative",
    "creator portfolio",
    "custom domain biolink",
  ],
  authors: [{ name: "Linkface Studio" }],
  creator: "Linkface",
  publisher: "Linkface",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Linkface — Quiet Luxury Link in Bio",
    description: "Curate your digital presence. The modern, editorial biolink platform for creators, musicians, and brands.",
    type: "website",
    url: "https://linkface.in",
    siteName: "Linkface",
    locale: "en_US",
    images: [
      {
        url: "/brand-logo-128.png",
        width: 128,
        height: 128,
        alt: "Linkface Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkface — Quiet Luxury Link in Bio",
    description: "Curate your digital presence. The modern, editorial biolink platform for creators, musicians, and brands.",
    images: ["/brand-logo-128.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=6", sizes: "any" },
      { url: "/icon.png?v=6", sizes: "48x48", type: "image/png" },
      { url: "/brand-logo-64.png?v=6", sizes: "64x64", type: "image/png" },
      { url: "/brand-logo-32.png?v=6", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png?v=6", sizes: "180x180", type: "image/png" },
      { url: "/brand-logo-128.png?v=6", sizes: "128x128", type: "image/png" },
    ],
  },
  verification: {
    google: "google5cd57795125adb2b",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFFFF",
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
      <body className="min-h-full min-h-[100dvh] flex flex-col font-body bg-[#FFFFFF] text-[#18181B]">
        <SmoothScroll>{children}</SmoothScroll>
        <CookieConsentBanner />
      </body>
    </html>
  );
}
