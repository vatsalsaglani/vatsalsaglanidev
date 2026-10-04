import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";
import { profile } from "@/data/profile";

const sans = Geist({ variable: "--font-sans", subsets: ["latin"], display: "swap" });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const title = `${profile.name} — ${profile.role} at ${profile.company}`;
const description =
  "Vatsal Saglani builds AI agents that test software, and the systems that make them reliable: agent SDKs, distributed runtimes, memory and evaluation at QyrusAI, plus open-source LLM tooling.";

export const metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description,
  keywords: ["Vatsal Saglani", "GenAI", "AI agents", "MCP", "LLM", "Swift", "macOS", "QyrusAI", "machine learning", "Bengaluru"],
  authors: [{ name: profile.name, url: profile.links.github.url }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: profile.siteUrl,
    title,
    description,
    siteName: profile.name,
    images: [{ url: profile.ogImage, width: 1200, height: 630, alt: `${profile.name} — portfolio` }],
  },
  twitter: { card: "summary_large_image", title, description, images: [profile.ogImage], creator: `@${profile.links.x.handle}` },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh">
        <ThemeProvider>
          {children}
          <div className="grain" aria-hidden="true" />
        </ThemeProvider>
      </body>
    </html>
  );
}
