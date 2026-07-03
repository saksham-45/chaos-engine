"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlasmaBackground } from "@/components/PlasmaBackground";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

// Real posts go here as they're written — no filler in the meantime.
const blogPosts: Post[] = [];

// Things I actually want to write up, from real work on this site & my projects.
const PLANNED = [
  "Sampling continents into a 25,000-node point cloud (the homepage planet)",
  "INT8 quantization on a Raspberry Pi: how MoodScope hits ~30 ms/frame",
  "Keeping 99.9% uptime when traffic is a crisis, not a curve",
];

export default function BlogPage() {
  return (
    <>
      <PlasmaBackground />
      <main className="relative z-10 min-h-screen text-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="font-mono text-[11px] tracking-[0.35em] uppercase text-amber-400/60 mb-4">
              field notes
            </p>
            <h1
              className="text-5xl md:text-6xl font-bold mb-4 matrix-font text-amber-100"
              style={{ textShadow: "0 0 24px rgba(255,183,56,0.35)" }}
            >
              Writing
            </h1>
            <p className="text-amber-100/60 text-lg max-w-2xl mx-auto">
              Build logs and deep dives on the things I make. First one&rsquo;s in the oven.
            </p>
          </motion.div>

          {blogPosts.length > 0 ? (
            <div className="space-y-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-amber-700/40 rounded-xl p-8 bg-black/40 backdrop-blur-sm hover:border-amber-400 transition-all"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-3xl font-bold mb-3 text-amber-200 matrix-font">{post.title}</h2>
                    <p className="text-amber-100/70 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-sm text-amber-400/70">
                      <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-amber-800/40 rounded-2xl bg-black/30 backdrop-blur-sm p-8 md:p-10"
            >
              <p className="text-amber-100/80 mb-6">
                No posts yet — I&rsquo;d rather have none than filler. Here&rsquo;s what&rsquo;s coming, drawn straight
                from real work:
              </p>
              <ul className="space-y-3 mb-8">
                {PLANNED.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-amber-100/70">
                    <span className="text-amber-400 mt-1 font-mono text-xs">soon</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-amber-200/60 text-sm">
                In the meantime, the code speaks —{" "}
                <Link href="/projects" className="underline hover:text-white">see the projects</Link> or{" "}
                <a href="https://github.com/saksham-45" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                  browse GitHub
                </a>.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
