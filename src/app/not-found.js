import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap flex min-h-dvh flex-col items-start justify-center py-24">
      <p className="eyebrow mb-4"><span className="text-accent">404</span> Not found</p>
      <h1 className="font-serif text-display-lg">This page <em>wandered off</em>.</h1>
      <Link href="/" className="btn-primary mt-10">Back home</Link>
    </main>
  );
}
