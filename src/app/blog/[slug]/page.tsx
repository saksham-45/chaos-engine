"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlasmaBackground } from "@/components/PlasmaBackground";
import ReactMarkdown from "react-markdown";

const blogPosts: Record<
  string,
  { title: string; content: string; date: string; readTime: string; tags: string[] }
> = {
  welcome: {
    title: "Welcome to My Blog",
    date: "2024-01-15",
    readTime: "3 min read",
    tags: ["General", "Introduction"],
    content: `# Welcome to My Blog

This is where I'll be sharing my thoughts, experiences, and insights on:

- **Software Development**: Best practices, tips, and lessons learned
- **Computer Engineering**: Systems programming, embedded systems, and hardware
- **Projects**: Deep dives into my projects and the challenges I've faced
- **Learning**: What I'm currently learning and resources I find valuable

Stay tuned for more content!

## What to Expect

I'll be writing about:
- Technical tutorials and guides
- Project case studies
- Thoughts on software engineering
- Reviews of tools and technologies
- And much more!

Thanks for reading!`,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <>
        <PlasmaBackground theme="rose" />
        <main className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">Blog post not found</p>
            <Link href="/blog" className="btn-secondary">
              Back to Blog
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PlasmaBackground theme="rose" />
      <main className="relative z-10 min-h-screen text-[var(--foreground)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <nav className="mb-8 text-sm text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--accent)] transition-colors">
              Home
            </Link>
            <span className="mx-2 text-white/20">/</span>
            <Link href="/blog" className="hover:text-[var(--accent)] transition-colors">
              Blog
            </Link>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-[var(--foreground)]">{post.title}</span>
          </nav>

          <motion.article
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-card rounded-xl p-8 md:p-12"
          >
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-white">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-8 text-sm text-[var(--muted)]">
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

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-mono text-[var(--muted)] rounded-md border border-white/[0.08] bg-white/[0.03]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-invert max-w-none text-[var(--muted)] prose-headings:text-white prose-a:text-[var(--accent)] prose-strong:text-[var(--foreground)]">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <div className="mt-10 pt-6 border-t border-white/[0.08]">
              <Link href="/blog" className="btn-secondary">
                ← Back to Blog
              </Link>
            </div>
          </motion.article>
        </div>
      </main>
    </>
  );
}
