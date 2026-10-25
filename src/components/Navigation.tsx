"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/kb/Micro";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bone)] border-b-2 border-[var(--color-rule)]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-14">
          {/* name / logo */}
          <Link href="/" className="flex items-center gap-2.5 group min-w-0 mr-3" aria-label="Home">
            <span className="w-4 h-4 shrink-0 bg-[var(--color-oxide)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-90" />
            <span className="font-display uppercase tracking-tight text-[var(--color-ink)] text-[0.95rem] sm:text-[1.05rem] leading-none truncate">
              Saksham Srivastava
            </span>
          </Link>

          {/* desktop nav */}
          <nav className="hidden md:flex items-stretch h-full">
            {navItems.map((item) => {
              const active =
                item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative flex items-center px-4 font-mono text-[0.74rem] uppercase tracking-[0.14em] border-l-2 border-[var(--color-rule)] transition-colors ${
                    active
                      ? "bg-[var(--color-oxide)] text-[var(--color-paper)]"
                      : "text-[var(--color-ink)] hover:bg-[var(--color-concrete)]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center ml-3">
            <ThemeToggle />
          </div>

          {/* mobile toggle */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center border-2 border-[var(--color-rule)] text-[var(--color-ink)]"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="font-mono text-lg leading-none">{open ? "×" : "≡"}</span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t-2 border-[var(--color-rule)] bg-[var(--color-bone)]">
          {navItems.map((item) => {
            const active =
              item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={`block px-5 py-3.5 font-mono text-[0.85rem] uppercase tracking-[0.14em] border-b border-[var(--color-rule)] ${
                  active
                    ? "bg-[var(--color-oxide)] text-[var(--color-paper)]"
                    : "text-[var(--color-ink)]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="px-5 py-3">
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
