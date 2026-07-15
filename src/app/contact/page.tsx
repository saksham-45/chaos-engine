"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StampButton, PupsikAmbient, PupsikCat } from "@/components/kb";
import { PROFILE } from "@/lib/projects";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    const subject = encodeURIComponent(`Portfolio · hello from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`);
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const inputCls =
    "w-full px-4 py-3 bg-[#0d120c]/85 border-2 border-[var(--color-bone)]/20 text-[var(--color-bone)] placeholder:text-[var(--color-bone)]/35 focus:border-[var(--color-oxide)] focus:outline-none text-[1.125rem] font-mono";
  const labelCls =
    "block mb-2 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-[var(--color-cyan)]";
  const errCls = "mt-1.5 font-mono text-[0.8rem] text-[#f3a08f]";

  const rails = [
    { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { label: "Phone", value: PROFILE.phone, href: PROFILE.phoneHref },
    { label: "GitHub", value: PROFILE.githubHandle, href: PROFILE.github },
    { label: "LinkedIn", value: PROFILE.linkedinHandle, href: PROFILE.linkedin },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden pt-14 text-[var(--color-bone)]">
      <PupsikAmbient />

      <div className="relative z-10 mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16 items-start">
          {/* ---- content (never overlaps the cat) ---- */}
          <div className="order-2 lg:order-1">
            <span className="font-mono text-[0.8rem] tracking-[0.22em] uppercase text-[var(--color-cyan)]">
              Contact
            </span>
            <h1 className="display-hero text-[clamp(2.6rem,8vw,5.5rem)] mt-3 text-[var(--color-bone)]">
              Let&rsquo;s build
            </h1>
            <p className="mt-5 max-w-md text-[1.125rem] leading-relaxed text-[var(--color-bone)]/85">
              Building something, or hiring for a full-stack or ML role? I reply to everything. Based in{" "}
              {PROFILE.location}, open to full-time software and ML engineering roles.
            </p>

            {/* quick rails */}
            <div className="mt-7 border-2 border-[var(--color-bone)]/20 bg-[#10160f]/85">
              {rails.map((r, i) => (
                <a
                  key={r.label}
                  href={r.href}
                  target={r.href.startsWith("http") ? "_blank" : undefined}
                  rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`group grid grid-cols-[minmax(80px,0.35fr)_1fr] items-center transition-colors hover:bg-[var(--color-oxide)] ${
                    i > 0 ? "border-t border-[var(--color-bone)]/15" : ""
                  }`}
                >
                  <span className="px-4 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-[var(--color-cyan)] border-r border-[var(--color-bone)]/15 group-hover:text-[var(--color-paper)]">
                    {r.label}
                  </span>
                  <span className="px-4 py-3 font-mono text-[0.9rem] text-[var(--color-bone)] truncate group-hover:text-[var(--color-paper)]">
                    {r.value}
                  </span>
                </a>
              ))}
            </div>

            {/* mailto form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 max-w-lg">
              <div>
                <label htmlFor="name" className={labelCls}>
                  Name
                </label>
                <input
                  id="name"
                  className={inputCls}
                  placeholder="Your name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className={errCls}>{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email" className={labelCls}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={inputCls}
                  placeholder="you@company.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                  })}
                />
                {errors.email && <p className={errCls}>{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="message" className={labelCls}>
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className={`${inputCls} resize-none`}
                  placeholder="What are you building, or hiring for?"
                  {...register("message", { required: "Message is required" })}
                />
                {errors.message && <p className={errCls}>{errors.message.message}</p>}
              </div>

              <StampButton type="submit" variant="primary">
                Compose message
              </StampButton>

              {sent && (
                <p className="font-mono text-[0.85rem] text-[var(--color-bone)]/80">
                  Your mail app should be open with everything filled in. Prefer to skip it?{" "}
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="text-[var(--color-cyan)] underline underline-offset-4"
                  >
                    Email me directly
                  </a>
                  .
                </p>
              )}
            </form>
          </div>

          {/* ---- the cat (unobscured; top on mobile, right on desktop) ---- */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <PupsikCat className="mx-auto w-full max-w-[520px]" />
            <p className="mt-4 text-center font-mono text-[0.72rem] tracking-[0.14em] uppercase text-[var(--color-bone)]/45">
              move your cursor over the cat · click it
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
