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

const blogPosts: Post[] = [];

const PLANNED = [
  "Sampling continents into a 25,000-node point cloud (the homepage planet)",
  "INT8 quantization on a Raspberry Pi: how MoodScope hits ~30 ms/frame",
  "Keeping 99.9% uptime when traffic is a crisis, not a curve",
];

export default function BlogPage() {
  return (
    <>
      <PlasmaBackground theme="rose" />
      <main className="relative z-10 min-h-screen text-[var(--foreground)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="label-mono mb-4">field notes</p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4 text-white">
              Writing
            </h1>
            <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
              Build logs and deep dives on the things I make. First one&rsquo;s in the oven.
            </p>
          </motion.div>

          {blogPosts.length > 0 ? (
            <div className="space-y-6">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="surface-card rounded-xl p-8 hover:border-[var(--accent-border)] transition-colors"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-semibold mb-3 text-white tracking-tight">
                      {post.title}
                    </h2>
                    <p className="text-[var(--muted)] mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-white/20">•</span>
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
              className="surface-card rounded-2xl p-8 md:p-10"
            >
              <p className="text-[var(--muted)] mb-6">
                No posts yet — I&rsquo;d rather have none than filler. Here&rsquo;s what&rsquo;s coming, drawn straight
                from real work:
              </p>
              <ul className="space-y-3 mb-8">
                {PLANNED.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[var(--muted)]">
                    <span className="text-[var(--accent)] mt-0.5 font-mono text-[10px] uppercase tracking-wider shrink-0">
                      soon
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[var(--muted)] text-sm">
                In the meantime, the code speaks —{" "}
                <Link href="/projects" className="text-[var(--accent)] underline underline-offset-4 hover:text-white">
                  see the projects
                </Link>{" "}
                or{" "}
                <a
                  href="https://github.com/saksham-45"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] underline underline-offset-4 hover:text-white"
                >
                  browse GitHub
                </a>
                .
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
