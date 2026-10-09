import Link from "next/link";

// A 404 should not advertise itself as the homepage: own title, noindex, no canonical.
export const metadata = {
  title: "Page not found — Vatsal Saglani",
  description: "This page does not exist on vatsalsaglani.pages.dev.",
  robots: { index: false, follow: false },
  alternates: {},
  openGraph: null,
  twitter: null,
};

export default function NotFound() {
  return (
    <main className="wrap flex min-h-dvh flex-col items-start justify-center py-24">
      <p className="eyebrow mb-4"><span className="text-accent">404</span> Not found</p>
      <h1 className="font-serif text-display-lg">This page <em>wandered off</em>.</h1>
      <Link href="/" className="btn-primary mt-10">Back home</Link>
    </main>
  );
}
