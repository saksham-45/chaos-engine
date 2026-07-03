"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navItems: { name: string; path: string; special?: boolean }[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
  { name: 'Mystery', path: '/mystery', special: true },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-sm border-b border-green-500/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.span
              className="text-2xl font-bold matrix-font text-green-400"
              whileHover={{ scale: 1.1 }}
              style={{
                textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00',
              }}
            >
              {'>'} Saksham
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              if (item.special) {
                return (
                  <Link key={item.path} href={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      className={`ml-1 px-4 py-2 rounded-lg relative font-mono text-sm tracking-wide border transition-colors ${
                        isActive
                          ? 'text-green-300 border-green-400/70 bg-green-500/10'
                          : 'text-green-300/80 border-green-500/30 hover:text-green-200 hover:border-green-400/70'
                      }`}
                      style={{ boxShadow: '0 0 14px rgba(0,255,100,0.18)' }}
                    >
                      <span className="animate-pulse mr-1">◈</span>
                      {item.name}
                    </motion.div>
                  </Link>
                );
              }
              return (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    className={`px-4 py-2 rounded-lg relative ${
                      isActive
                        ? 'text-green-400'
                        : 'text-green-200 hover:text-green-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400"
                        layoutId="activeTab"
                        style={{
                          boxShadow: '0 0 10px #00ff00',
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-green-400 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-green-500/20 bg-black/95 backdrop-blur-sm"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <motion.div
                      className={`px-4 py-3 rounded-lg ${
                        item.special ? 'font-mono border border-green-500/40 ' : ''
                      }${
                        isActive
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'text-green-200 hover:bg-green-500/10'
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      {item.special && <span className="animate-pulse mr-1">◈</span>}
                      {item.name}
                    </motion.div>
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

