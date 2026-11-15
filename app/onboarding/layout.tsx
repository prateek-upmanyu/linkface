import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claim Your Username — Linkface",
  description:
    "Choose your personal @handle to create an editorial link in bio page for your digital brand.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
