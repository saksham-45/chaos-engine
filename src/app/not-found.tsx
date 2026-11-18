import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[100svh] max-w-[1200px] flex-col items-center justify-center px-5 text-center sm:px-8">
      <p className="t-num text-[clamp(5rem,18vw,11rem)] leading-none text-accent">404</p>
      <h1 className="t-h2 mt-4">I can’t find that page.</h1>
      <p className="t-lead mt-4">It may have moved. My projects are all on one page.</p>
      <Link href="/projects" className="btn btn-primary mt-8">
        See my projects
      </Link>
    </main>
  );
}
