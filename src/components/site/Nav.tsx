"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SPRING } from "./motion";

const items = [
  { name: "Projects", path: "/projects" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

/* Dark / light, persisted. The pre-paint script in layout.tsx sets the
   attribute; CSS picks the icon from it, so there is no state to sync. */
function ThemeButton() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      window.localStorage.setItem("portfolio-theme", next);
    } catch {
      // private mode: the switch still works for this visit
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between dark and light mode"
      title="Switch between dark and light mode"
      className="pressable grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-ink/10"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="only-dark h-[18px] w-[18px]" fill="currentColor">
        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
      </svg>
      <svg aria-hidden viewBox="0 0 24 24" className="only-light h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </svg>
    </button>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      <div className="relative w-full max-w-[680px]">
        <div className="glass flex h-12 items-center gap-1 rounded-full pl-5 pr-1.5">
          <Link href="/" className="mr-auto truncate text-[1.0625rem] font-semibold tracking-tight text-ink" onClick={() => setOpen(false)}>
            Saksham Srivastava
          </Link>

          <nav aria-label="Main" className="hidden items-center sm:flex">
            {items.map((item) => {
              const active = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-9 items-center rounded-full px-3.5 text-[0.9375rem] font-medium transition-colors ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink/10" transition={{ ...SPRING, duration: 0.5 }} />
                  )}
                  <span className="relative">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <ThemeButton />

          <button
            type="button"
            className="pressable grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-ink/10 sm:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <motion.path d="M4 8h16" initial={false} animate={{ d: open ? "M6 6l12 12" : "M4 8h16" }} transition={{ ...SPRING, duration: 0.4 }} />
              <motion.path d="M4 16h16" initial={false} animate={{ d: open ? "M18 6L6 18" : "M4 16h16" }} transition={{ ...SPRING, duration: 0.4 }} />
            </svg>
          </button>
        </div>

        {/* mobile sheet: grows out of the menu button it came from */}
        <AnimatePresence>
          {open && (
            <motion.nav
              aria-label="Main"
              className="glass absolute inset-x-0 top-full mt-2 origin-top-right rounded-[26px] p-2 sm:hidden"
              initial={{ opacity: 0, scale: 0.94, y: -6, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.94, y: -6, filter: "blur(10px)" }}
              transition={{ ...SPRING, duration: 0.45 }}
            >
              {[{ name: "Home", path: "/" }, ...items].map((item) => {
                const active = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-[52px] items-center rounded-[18px] px-4 text-[1.375rem] font-semibold tracking-tight ${
                      active ? "bg-ink/10 text-ink" : "text-ink/80"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
