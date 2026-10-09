import Resume from "@/components/Resume";
import JsonLd from "@/components/JsonLd";
import { profile } from "@/data/profile";
import { resumeDescription, resumeJsonLd, resumeTitle } from "@/lib/seo";
import "./resume.css";

export const metadata = {
  title: resumeTitle,
  description: resumeDescription,
  alternates: { canonical: "/resume/" },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: "/resume/",
    title: resumeTitle,
    description: resumeDescription,
    siteName: profile.name,
    firstName: profile.firstName,
    lastName: profile.name.replace(`${profile.firstName} `, ""),
    images: [{ url: profile.ogImage, width: 1200, height: 630, alt: `${profile.name} — resume` }],
  },
  twitter: {
    card: "summary_large_image",
    title: resumeTitle,
    description: resumeDescription,
    images: [profile.ogImage],
    creator: `@${profile.links.x.handle}`,
  },
};

export default function ResumePage() {
  return (
    <>
      <JsonLd data={resumeJsonLd()} />
      <Resume />
    </>
  );
}
