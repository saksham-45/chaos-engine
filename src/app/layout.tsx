import type { Metadata } from "next";
import { Oswald, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

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
  metadataBase: new URL("https://portfolio-eight-beta-78.vercel.app"),
  title: "Saksham Srivastava | Full-stack Developer",
  description:
    "Full-stack developer and researcher at USF, with a strong foundation in ML. End-to-end builds: a crisis platform that served 10,000+ people, an automatic DJ, a real-time audio visualizer, and a live math lab.",
  keywords: [
    "Saksham Srivastava",
    "Full-stack Developer",
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
    title: "Saksham Srivastava | Full-stack Developer",
    description:
      "Full-stack developer and researcher. End-to-end projects across ML, real-time graphics, and systems, plus a live math lab and GitHub feed.",
    type: "website",
    locale: "en_US",
    url: "https://portfolio-eight-beta-78.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saksham Srivastava | Full-stack Developer",
    description:
      "Full-stack developer and researcher. End-to-end builds across ML, real-time graphics, and systems.",
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
        <Navigation />
        {children}
      </body>
    </html>
  );
}
