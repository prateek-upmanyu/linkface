import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In or Create Account — Linkface",
  description:
    "Log in to your Linkface creator dashboard to curate destinations, reorder links, and inspect engagement analytics.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
