import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { publications } from "@/data/publications";
import { skills } from "@/data/skills";

// Shared copy so every route's <title>, description and social cards agree.
export const siteTitle = `${profile.name} — ${profile.role} at ${profile.company}`;
export const siteDescription =
  "Vatsal Saglani builds AI agents that test software, and the systems that keep them reliable: agent SDKs, runtimes, memory and evaluation at QyrusAI, plus open source.";

export const resumeTitle = `Resume — ${profile.name}`;
export const resumeDescription = `Resume of ${profile.name}, ${profile.role} at ${profile.company}: experience, selected projects, skills, education and publications.`;

const abs = (path) => new URL(path, profile.siteUrl).toString();
const PERSON_ID = abs("/#person");
const SITE_ID = abs("/#website");

const education = experience.find((e) => e.type === "education");

// Only facts that are already visible on the page or in the owner's profile links.
export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    givenName: profile.firstName,
    url: abs("/"),
    image: abs(profile.photo),
    jobTitle: profile.role,
    description: profile.tagline,
    email: `mailto:${profile.email}`,
    worksFor: { "@type": "Organization", name: profile.company, url: profile.companyUrl },
    address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
    alumniOf: education ? { "@type": "CollegeOrUniversity", name: education.org } : undefined,
    knowsAbout: skills.flatMap((g) => g.items).slice(0, 12),
    sameAs: Object.values(profile.links).map((l) => l.url),
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: abs("/"),
    name: profile.name,
    description: siteDescription,
    inLanguage: "en",
    author: { "@id": PERSON_ID },
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteJsonLd(),
      personJsonLd(),
      {
        "@type": "ProfilePage",
        "@id": abs("/#profilepage"),
        url: abs("/"),
        name: siteTitle,
        description: siteDescription,
        isPartOf: { "@id": SITE_ID },
        mainEntity: { "@id": PERSON_ID },
        primaryImageOfPage: { "@type": "ImageObject", url: abs(profile.ogImage), width: 1200, height: 630 },
      },
    ],
  };
}

export function resumeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personJsonLd(),
      {
        "@type": "WebPage",
        "@id": abs("/resume/#webpage"),
        url: abs("/resume/"),
        name: resumeTitle,
        description: resumeDescription,
        isPartOf: { "@id": SITE_ID },
        about: { "@id": PERSON_ID },
        inLanguage: "en",
      },
      {
        "@type": "CreativeWork",
        name: "Publications",
        hasPart: publications.map((p) => ({
          "@type": "ScholarlyArticle",
          name: p.title,
          author: { "@id": PERSON_ID },
          datePublished: String(p.year),
          publisher: { "@type": "Organization", name: p.venue },
        })),
      },
    ],
  };
}
