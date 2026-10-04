import { profile } from "@/data/profile";

export const dynamic = "force-static";

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${profile.siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${profile.siteUrl}/resume/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
