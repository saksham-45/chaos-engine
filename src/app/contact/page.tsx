"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Reveal } from "@/components/site/motion";
import { CopyButton } from "@/components/site/Contact";
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

  // No backend: the form hands a finished draft to the visitor's mail app.
  const onSubmit = (data: ContactFormData) => {
    const subject = encodeURIComponent(`Portfolio · hello from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`);
    window.location.assign(`mailto:${PROFILE.email}?subject=${subject}&body=${body}`);
    setSent(true);
  };

  const inputCls =
    "w-full rounded-[16px] bg-raised px-4 py-3.5 text-[1.125rem] text-ink placeholder:text-muted/70 outline-none ring-1 ring-transparent transition-shadow focus:ring-2 focus:ring-accent aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#ff453a]";
  const labelCls = "mb-2 block text-[0.9375rem] font-medium text-muted";
  const errCls = "mt-2 text-[0.9375rem] text-[#ff6961]";

  const rails = [
    { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { label: "Phone", value: PROFILE.phone, href: PROFILE.phoneHref },
    { label: "GitHub", value: PROFILE.githubHandle, href: PROFILE.github },
    { label: "LinkedIn", value: PROFILE.linkedinHandle, href: PROFILE.linkedin },
  ];

  return (
    <main className="mx-auto min-h-[100svh] max-w-[1200px] px-5 pb-24 pt-32 sm:px-8 md:pt-44">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal now blur>
            <h1 className="t-h1">
              Contact <span className="hl">me.</span>
            </h1>
          </Reveal>
          <Reveal now delay={0.08}>
            <p className="t-lead mt-6 max-w-[34ch]">
              I&rsquo;m based in {PROFILE.location} and graduate in May 2027. I&rsquo;m looking for a full-time role working on{" "}
              <strong>FPGA and EDA tools, compilers, or systems</strong>, so if that&rsquo;s what your team does, I&rsquo;d love to hear from you.
            </p>
          </Reveal>

          <Reveal now delay={0.16} className="mt-10">
            <ul className="divide-y divide-line border-y border-line">
              {rails.map((r) => (
                <li key={r.label}>
                  <a
                    href={r.href}
                    target={r.href.startsWith("http") ? "_blank" : undefined}
                    rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex min-h-[64px] items-center gap-4 py-3"
                  >
                    <span className="w-24 shrink-0 text-[0.9375rem] text-muted">{r.label}</span>
                    <span className="truncate text-[1.1875rem] font-medium tracking-[-0.015em]">{r.value}</span>
                    <span aria-hidden className="ml-auto text-[1.25rem] text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink">
                      ›
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CopyButton value={PROFILE.email} label="Copy email" />
            </div>
          </Reveal>
        </div>

        <Reveal now delay={0.2}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-5 p-6 sm:p-9">
            <div>
              <label htmlFor="name" className={labelCls}>
                Name
              </label>
              <input id="name" autoComplete="name" className={inputCls} placeholder="Your name" aria-invalid={!!errors.name} {...register("name", { required: "Add your name so I know who's writing." })} />
              {errors.name && <p className={errCls}>{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className={labelCls}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={inputCls}
                placeholder="you@company.com"
                aria-invalid={!!errors.email}
                {...register("email", {
                  required: "Add an email so I can reply.",
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "That email doesn't look right. Check for a typo." },
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
                aria-invalid={!!errors.message}
                {...register("message", { required: "Write a line or two first." })}
              />
              {errors.message && <p className={errCls}>{errors.message.message}</p>}
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Open in my mail app
            </button>
            <p className="text-[0.9375rem] leading-snug text-muted" aria-live="polite">
              {sent ? (
                <>
                  Your mail app should be open with the message filled in. If it isn&rsquo;t,{" "}
                  <a href={`mailto:${PROFILE.email}`} className="link">
                    email me directly
                  </a>
                </>
              ) : (
                "This opens a draft in your mail app. Nothing is sent until you send it."
              )}
            </p>
          </form>
        </Reveal>
      </div>
    </main>
  );
}
