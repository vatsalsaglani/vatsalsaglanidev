// Single source of truth for identity, links and copy used across the site.
export const profile = {
  name: "Vatsal Saglani",
  firstName: "Vatsal",
  role: "Data Science Lead, GenAI",
  company: "Qyrus",
  companyUrl: "https://www.qyrus.com",
  location: "Bengaluru, India",
  timeZone: "Asia/Kolkata",
  email: "saglanivatsal@gmail.com",
  siteUrl: "https://vatsalsaglani.pages.dev",
  mirrorUrl: "https://vatsalsaglani.github.io",
  available: true,
  availabilityNote: "Open to interesting conversations, talks and collaborations",
  // Short, punchy line for the hero.
  tagline: "I build agents, and the tools around them.",
  // Rotating verbs used in the hero headline.
  rotatingRoles: [
    "autonomous testing agents",
    "native macOS apps in Swift",
    "LLM tooling people actually use",
    "multi-agent systems that run locally",
  ],
  // One-paragraph bio used in the hero / about block.
  bio:
    "I lead the GenAI team at Qyrus, where we are making software testing genuinely autonomous across web, mobile, desktop and APIs. Before that I trained transformers from scratch, fine-tuned vision models and shipped recommendation systems. After hours I build native macOS apps in Swift, write about agent architectures and MCP, and keep a steady stream of open-source experiments going.",
  // Longer narrative for an "about" section.
  about: [
    "I have spent the last seven years on the applied side of machine learning: first classical NLP and computer vision, then transformers, and since 2023 almost entirely large language models and the agent systems built on top of them.",
    "At Qyrus I own the GenAI roadmap. That means designing multi-agent orchestration, building the browser-use framework our agents drive, maintaining the Python SDKs every team uses to talk to LLM providers, and shipping the internal developer tooling that keeps the whole thing moving.",
    "Outside work I am drawn to local-first software. Recently that has meant Swift: a notch utility for your Mac, a container manager for Apple's native runtime, a clipboard manager and a lightweight repo editor built for the age of coding agents.",
  ],
  stats: [
    { label: "Years in applied ML", value: "7+" },
    { label: "GitHub stars", value: "450+" },
    { label: "Public repos", value: "110+" },
    { label: "Paper citations", value: "30+" },
  ],
  links: {
    github: { label: "GitHub", handle: "vatsalsaglani", url: "https://github.com/vatsalsaglani" },
    linkedin: { label: "LinkedIn", handle: "vatsalsaglani", url: "https://linkedin.com/in/vatsalsaglani" },
    medium: { label: "Medium", handle: "thevatsalsaglani", url: "https://thevatsalsaglani.medium.com" },
    x: { label: "X", handle: "saglanivatsal", url: "https://x.com/saglanivatsal" },
    scholar: { label: "Google Scholar", handle: "Vatsal Saglani", url: "https://scholar.google.com/citations?user=3RB_jh0AAAAJ&hl=en" },
    pypi: { label: "PyPI", handle: "claudetools", url: "https://pypi.org/project/claudetools/" },
  },
  // Google Apps Script endpoint that the previous site used for the contact form.
  contactEndpoint:
    "https://script.google.com/macros/s/AKfycbwgKPm-kUShXf6iBcpNQCEYQWDfE4J5j4CvFaiH7J0EgA-wmRcfGg9skv8mAl6pi5Op/exec",
  photo: "/assets/vatsal.JPG",
  ogImage: "/assets/og.png",
};

export const nav = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "writing", label: "Writing" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const now = [
  "Leading GenAI at Qyrus",
  "Building Cider, a notch companion for macOS",
  "Writing about MCP and agent architectures",
  "Shipping Swift apps on macOS 26",
  "Running agent swarms on local LLMs",
  "Based in Bengaluru",
];
