import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vatsal Saglani | Data Science Lead - GenAI",
  description: "Data Science Lead specializing in Generative AI, Autonomous Agents, and AI-powered testing solutions with expertise in LLMs, PyTorch, and Computer Vision.",
  keywords: "Vatsal Saglani, Data Science, Generative AI, Autonomous Agents, Machine Learning, LLMs, PyTorch, Computer Vision",
  authors: [{ name: "Vatsal Saglani", url: "https://github.com/vatsalsaglani" }],
  creator: "Vatsal Saglani",
  icons: {
    icon: [{ url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👨‍💻</text></svg>" }],
    apple: [{ url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👨‍💻</text></svg>" }],
    shortcut: [{ url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👨‍💻</text></svg>" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vatsalsaglani.com",
    title: "Vatsal Saglani | Data Science Lead - GenAI",
    description: "Data Science Leader with expertise in Autonomous Agents, AI Testing, and Machine Learning applications",
    siteName: "Vatsal Saglani",
    images: [
      {
        url: "/assets/vatsal.JPG",
        width: 800,
        height: 800,
        alt: "Vatsal Saglani"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vatsal Saglani | Data Science Lead - GenAI",
    description: "Data Science Leader specializing in Generative AI and Autonomous Agents",
    images: ["/assets/vatsal.JPG"],
    creator: "@vatsalsaglani",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
