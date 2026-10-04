import { profile } from "@/data/profile";

// Wrap every mention of the company name in prose with a link to its site.
export function linkCompany(text, className = "link-underline text-fg") {
  if (typeof text !== "string" || !text.includes(profile.company)) return text;
  const parts = text.split(profile.company);
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <a key={i} href={profile.companyUrl} target="_blank" rel="noopener noreferrer" className={className}>
            {profile.company}
          </a>,
          part,
        ]
  );
}
