import { profile } from "@/data/profile";

export const dynamic = "force-static";

export default function robots() {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${profile.siteUrl}/sitemap.xml` };
}
