import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Doto } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/site/Nav";
import { BitProgress } from "@/components/site/motion";
import { PROFILE } from "@/lib/projects";

// dot-matrix numerals for every measured number on the site
const doto = Doto({ variable: "--font-doto", subsets: ["latin"], display: "swap" });

const title = "Saksham Srivastava · Computer engineering student";
const description =
  "I’m Saksham Srivastava, a computer engineering student at USF graduating in May 2027. I build software that sits close to the hardware, including Helion, an open-source FPGA toolchain written in Rust.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sakshamportfolioforeng.vercel.app"),
  title: { default: title, template: "%s · Saksham Srivastava" },
  description,
  keywords: [
    "Saksham Srivastava",
    "Computer Engineering",
    "FPGA",
    "Rust",
    "Embedded firmware",
    "Zephyr",
    "Applied AI",
    "Machine Learning",
    "USF",
    "New grad 2027",
  ],
  authors: [{ name: "Saksham Srivastava" }],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_US",
    url: "https://sakshamportfolioforeng.vercel.app",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { themeColor: "#000000" };

// Runs before first paint so a saved light theme never flashes dark.
const themeScript =
  "try{var t=localStorage.getItem('portfolio-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}";

const footerLinks = [
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={doto.variable}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <BitProgress />
        <Nav />
        <div id="main">{children}</div>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-5 py-8 text-[0.9375rem] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <p>
              © {new Date().getFullYear()} {PROFILE.name} · {PROFILE.location}
            </p>
            <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((l) => (
                <Link key={l.href} href={l.href} className="transition-colors hover:text-ink">
                  {l.name}
                </Link>
              ))}
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
                GitHub
              </a>
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">
                LinkedIn
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
