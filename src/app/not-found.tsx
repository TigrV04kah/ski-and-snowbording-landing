import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-serif text-5xl">404</h1>
      <p className="text-sm text-[var(--ink-muted)]">The page was not found.</p>
      <Link href="/" className="rounded-full bg-[var(--ink)] px-5 py-2 text-sm text-white">
        Go home
      </Link>
    </div>
  );
}
