import type { Metadata } from "next";
import { Oswald, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { ScrollProgress } from "@/components/kb/Micro";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sakshamportfolioforeng.vercel.app"),
  title: "Saksham Srivastava | Computer Engineering · FPGA / Applied AI",
  description:
    "Computer engineering student at USF, graduating May 2027. FPGA tooling, embedded firmware, and applied AI projects, with specs, measurements, and links.",
  keywords: [
    "Saksham Srivastava",
    "Computer Engineering",
    "FPGA",
    "Software Engineer",
    "Machine Learning",
    "Computer Engineering",
    "On-device ML",
    "USF",
    "Python",
    "TypeScript",
    "Node.js",
    "PyTorch",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Saksham Srivastava" }],
  openGraph: {
    title: "Saksham Srivastava | Computer Engineering · FPGA / Applied AI",
    description:
      "Computer engineering student building FPGA tooling, embedded firmware, and production applied AI.",
    type: "website",
    locale: "en_US",
    url: "https://sakshamportfolioforeng.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saksham Srivastava | Computer Engineering · FPGA / Applied AI",
    description:
      "FPGA tooling, embedded firmware, and production applied AI, built and measured end to end.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${plexSans.variable} ${plexMono.variable} antialiased`}
      >
        <ScrollProgress />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
