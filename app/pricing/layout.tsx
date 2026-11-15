import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple & Transparent Pricing — Free & Pro Plans",
  description:
    "Start free with 3 links and quiet luxury themes. Upgrade to Linkface Pro ($3/month) for unlimited links, high-conversion analytics, verified badge, and bespoke themes.",
  openGraph: {
    title: "Simple & Transparent Pricing | Linkface",
    description: "Start free or upgrade to Linkface Pro. Transparent pricing for creators, developers, and brands.",
    url: "https://linkface.in/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
