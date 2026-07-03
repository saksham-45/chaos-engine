import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import CustomCursor from "@/components/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-eight-beta-78.vercel.app"),
  title: "Saksham Srivastava | Computer Engineer & Full-Stack Developer",
  description:
    "Computer Engineering student (B.S. '27, 3.89 GPA) at USF. On-device ML, full-stack platforms serving 40,000+ users, 21 merged open-source PRs. Python · C/C++ · React · Embedded Linux.",
  keywords: [
    "Saksham Srivastava", "Computer Engineering", "Software Engineer Intern", "Full-Stack Developer",
    "Machine Learning", "Embedded Systems", "USF", "Python", "C++", "React", "Next.js", "TensorFlow Lite",
  ],
  authors: [{ name: "Saksham Srivastava" }],
  openGraph: {
    title: "Saksham Srivastava | Computer Engineer & Full-Stack Developer",
    description:
      "On-device ML, full-stack platforms at scale, and open-source contributions. Building where math meets the machine.",
    type: "website",
    locale: "en_US",
    url: "https://portfolio-eight-beta-78.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saksham Srivastava | Computer Engineer & Full-Stack Developer",
    description: "On-device ML, full-stack platforms at scale, and open-source contributions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <CustomCursor />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
