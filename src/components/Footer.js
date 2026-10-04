import Link from "next/link";
import { profile } from "@/data/profile";

const REPO_URL = "https://github.com/vatsalsaglani/vatsalsaglanidev";

const linkClass = "link-underline hover:text-fg";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line/10 pb-10 pt-20 md:pt-28">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="font-serif text-display-lg">
            Vatsal <em>Saglani</em>
          </p>
          <a href="#top" className="btn-ghost shrink-0 self-start md:self-auto">
            Back to top
            <ArrowUpIcon />
          </a>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line/10 pt-6 font-mono text-xs leading-relaxed text-muted md:mt-20 md:flex-row md:flex-wrap md:justify-between md:gap-x-8">
          <p>&copy; {year} Vatsal Saglani</p>
          <p>Built with Next.js and Tailwind, set in Instrument Serif and Geist</p>
          <p>
            Deployed on Cloudflare Pages · mirrored on GitHub Pages:{" "}
            <a href={profile.siteUrl} className={linkClass}>
              pages.dev
            </a>
            {" / "}
            <a href={profile.mirrorUrl} className={linkClass}>
              github.io
            </a>
          </p>
          <p className="flex gap-5">
            <Link href="/resume/" className={linkClass}>
              Resume
            </Link>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Source
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
