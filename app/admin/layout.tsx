import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Executive Admin Console — Linkface",
  description: "Secure owner terminal for system monitoring, user administration, and subscriber management.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
