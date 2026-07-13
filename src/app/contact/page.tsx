"use client";

import React, { useState } from "react";
import { PlasmaBackground } from "@/components/PlasmaBackground";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const EMAIL = "saksham146053@gmail.com";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    const subject = encodeURIComponent(`Portfolio · hello from ${data.name}`);
    const body = encodeURIComponent(
      `${data.message}\n\n— ${data.name}\n${data.email}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/saksham-45",
      icon: (
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      ),
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/sakshamsriv",
      icon: (
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      ),
    },
    {
      name: "Email",
      url: `mailto:${EMAIL}`,
      icon: (
        <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" />
      ),
    },
  ];

  const inputCls =
    "w-full px-4 py-3 bg-[var(--surface)]/80 border border-white/[0.08] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[var(--accent-border)] focus:ring-1 focus:ring-[var(--accent)]/40 transition-colors font-mono text-sm";

  return (
    <>
      <PlasmaBackground theme="indigo" />
      <main className="relative z-10 min-h-screen text-[var(--foreground)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="label-mono mb-4">
              open to software engineer intern roles
            </p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4 text-white">
              Say Hello
            </h1>
            <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
              Building something interesting, or hiring for one? I&rsquo;d genuinely love to hear about it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">Direct</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${EMAIL}`}
                      className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors font-mono text-sm"
                    >
                      {EMAIL}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
                      Phone
                    </p>
                    <a
                      href="tel:+18138608506"
                      className="text-[var(--foreground)] hover:text-[var(--accent)] transition-colors font-mono text-sm"
                    >
                      (813) 860-8506
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--muted)] mb-1">
                      Based in
                    </p>
                    <p className="text-[var(--foreground)] font-mono text-sm">Tampa, FL</p>
                  </div>
                </div>
              </div>

              <div className="surface-card rounded-xl p-5">
                <p className="text-[var(--muted)] text-sm leading-relaxed">
                  <span className="text-[var(--foreground)] font-semibold">Currently:</span> B.S.
                  Computer Engineering &rsquo;27 at USF &middot; 3.89 GPA &middot; Green &amp; Gold
                  Presidential Scholar &middot; undergraduate researcher at the Bellini College of AI.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Elsewhere</h3>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target={link.url.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      aria-label={link.name}
                      className="w-11 h-11 border border-white/[0.08] rounded-lg flex items-center justify-center text-[var(--muted)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)] transition-colors"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        {link.icon}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-mono text-[var(--muted)] mb-2"
                  >
                    Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    id="name"
                    className={inputCls}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-mono text-[var(--muted)] mb-2"
                  >
                    Email
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    id="email"
                    className={inputCls}
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-mono text-[var(--muted)] mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    {...register("message", { required: "Message is required" })}
                    id="message"
                    rows={6}
                    className={`${inputCls} resize-none`}
                    placeholder="What's on your mind…"
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                  )}
                </div>

                <button type="submit" className="btn-primary w-full">
                  Compose Message →
                </button>

                {sent && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[var(--muted)] text-center text-sm"
                  >
                    Your mail app should be open with everything filled in. Prefer to skip it?{" "}
                    <a
                      href={`mailto:${EMAIL}`}
                      className="text-[var(--accent)] underline underline-offset-4 hover:text-white"
                    >
                      Email me directly
                    </a>
                    .
                  </motion.p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
