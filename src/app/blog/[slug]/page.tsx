"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlasmaBackground } from '@/components/PlasmaBackground';
import ReactMarkdown from 'react-markdown';

// Blog posts content - in a real app, this would come from a CMS or markdown files
const blogPosts: Record<string, { title: string; content: string; date: string; readTime: string; tags: string[] }> = {
  welcome: {
    title: 'Welcome to My Blog',
    date: '2024-01-15',
    readTime: '3 min read',
    tags: ['General', 'Introduction'],
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

Thanks for reading! 🚀`,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <>
        <PlasmaBackground theme="rose" />
        <main className="relative z-10 min-h-screen bg-black text-green-400 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">Blog post not found</p>
            <Link
              href="/blog"
              className="px-6 py-3 bg-green-500/20 border border-green-500 text-green-400 rounded hover:bg-green-500/30 transition-colors"
            >
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
      <main className="relative z-10 min-h-screen bg-black text-green-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm text-green-300/70">
            <Link href="/" className="hover:text-green-400 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-green-400 transition-colors">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-green-400">{post.title}</span>
          </nav>

          {/* Header */}
          <motion.article
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-green-700/50 rounded-lg p-8 md:p-12 bg-black/40 backdrop-blur-sm"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 matrix-font" style={{
              textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00',
            }}>
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-8 text-sm text-green-400/70">
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/30 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-4 mt-8 text-green-300 matrix-font">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold mb-3 mt-6 text-green-300 matrix-font">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold mb-2 mt-4 text-green-300">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-green-200 mb-4 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 text-green-200 space-y-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 text-green-200 space-y-2">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-green-200">{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-green-300 font-bold">{children}</strong>
                  ),
                  code: ({ children }) => (
                    <code className="px-2 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/30 text-sm font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="p-4 bg-black/60 border border-green-700/50 rounded-lg overflow-x-auto mb-4">
                      {children}
                    </pre>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Back Button */}
            <div className="mt-12 pt-8 border-t border-green-700/50">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500 text-green-400 rounded-lg hover:bg-green-500/30 hover:border-green-400 transition-colors matrix-font"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blog
              </Link>
            </div>
          </motion.article>
        </div>
      </main>
    </>
  );
}

