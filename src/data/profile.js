// Single source of truth for identity, links and copy used across the site.
export const profile = {
  name: "Vatsal Saglani",
  firstName: "Vatsal",
  role: "Data Science Lead, GenAI",
  headline: "Agents that test software, and the systems that make them reliable",
  company: "QyrusAI",
  companyUrl: "https://qyrus.ai",
  location: "Bengaluru, India",
  timeZone: "Asia/Kolkata",
  email: "saglanivatsal@gmail.com",
  siteUrl: "https://vatsalsaglani.pages.dev",
  mirrorUrl: "https://vatsalsaglani.github.io",
  available: true,
  availabilityNote: "Open to interesting conversations, talks and collaborations",
  // Short, punchy line for the hero.
  tagline: "I build AI agents that test software, and the systems that make them reliable.",
  // Rotating verbs used in the hero headline.
  rotatingRoles: [
    "AI agents that test software",
    "the harnesses that make them reliable",
    "memory and evaluation for agents",
    "SDKs other teams build on",
  ],
  // One-paragraph bio used in the hero / about block.
  bio:
    "I lead AI engineering at QyrusAI, where agents test software across web, mobile, desktop and APIs. My work is the systems around those agents: the execution harness and shared SDK, distributed runtimes with durable evidence, memory, and evaluation. I still work directly on models and code. I write about agent architectures and MCP, and keep a steady stream of open-source experiments going.",
  // Longer narrative for an "about" section.
  about: [
    "Seven years in machine learning, most of them close to the models themselves: I have trained transformers from scratch for classification, entity extraction and recommendation, fine-tuned detection and vision-language models, and quantized them to run on small hardware. Since 2023 the work has been mostly large language models and the agent systems built on top of them, but I keep coming back to training, most recently a compact vision-language model that reads a screen and decides where to act.",
    "At QyrusAI I set the technical direction for AI. The through-line is reliability: a shared SDK so every agent runs the same loop with the same telemetry, a runtime that streams a session live and keeps the evidence afterwards, memory for long tasks, and evaluation that looks at the whole trajectory rather than just the final answer. I mentor the engineers building on it and plan delivery with product.",
    "Outside work I spend a lot of time on agentic development itself: how far can a coding agent take a real product? Tinker, a bring-your-own-key coding assistant for VS Code, is the main one. The native macOS apps in my GitHub are experiments from the same question, built mostly to see what agents can ship.",
  ],
  stats: [
    { label: "Years in applied ML", value: "7+" },
    { label: "GitHub stars", value: "450+" },
    { label: "Public repos", value: "110+" },
    { label: "Paper citations", value: "40+" },
  ],
  links: {
    github: { label: "GitHub", handle: "vatsalsaglani", url: "https://github.com/vatsalsaglani" },
    linkedin: { label: "LinkedIn", handle: "vatsalsaglani", url: "https://www.linkedin.com/in/vatsalsaglani/" },
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
  { id: "systems", label: "Systems" },
  { id: "work", label: "Open source" },
  { id: "experience", label: "Experience" },
  { id: "writing", label: "Writing" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const now = [
  "Leading AI engineering at QyrusAI",
  "Agents testing software on real devices",
  "Building Tinker, a BYOK coding agent for VS Code",
  "Writing about MCP and agent architectures",
  "Shipping products with coding agents",
  "Running agent swarms on local LLMs",
  "Based in Bengaluru",
];
