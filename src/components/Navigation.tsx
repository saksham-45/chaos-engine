"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems: { name: string; path: string; quiet?: boolean }[] = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
  { name: "Lab", path: "/mystery", quiet: true },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--background)]/90 backdrop-blur-md border-b border-white/[0.08]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-tight text-[var(--foreground)] hover:text-white transition-colors"
          >
            Saksham<span className="text-[var(--accent)]">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <span
                    className={`relative px-3.5 py-2 rounded-lg text-sm transition-colors ${
                      item.quiet
                        ? isActive
                          ? "text-[var(--accent)] font-mono text-xs tracking-wide"
                          : "text-[var(--muted)] hover:text-[var(--foreground)] font-mono text-xs tracking-wide"
                        : isActive
                          ? "text-white"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {item.name}
                    {isActive && !item.quiet && (
                      <motion.span
                        layoutId="activeTab"
                        className="absolute bottom-0.5 left-3 right-3 h-px bg-[var(--accent)]"
                      />
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          <button
            className="md:hidden p-2 text-[var(--muted)] hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.08] bg-[var(--background)]/95 backdrop-blur-md"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-[var(--accent-dim)] text-[var(--accent)]"
                        : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
