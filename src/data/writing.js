// Latest articles. `scripts/refresh-data.mjs` can regenerate `src/data/medium-snapshot.json`
// from the Medium RSS feed; when present it is merged in at build time.
export const writing = [
  {
    title: "Schema-First Function Calling",
    url: "https://ai.plainenglish.io/schema-first-function-calling-0c42e57f3264",
    date: "2025-05-21",
    publication: "AI in Plain English",
    tags: ["agents", "function calling"],
    blurb: "Design the schema before the prompt: a more reliable way to get structured tool calls out of any model.",
  },
  {
    title: "MCP vs A2A: Building Bridges Between AI Agents",
    url: "https://medium.com/data-science-collective/mcp-vs-a2a-building-bridges-between-ai-agents-f6b64be97a35",
    date: "2025-05-06",
    publication: "Data Science Collective",
    tags: ["mcp", "a2a", "agents"],
    blurb: "Where Anthropic's Model Context Protocol and Google's Agent2Agent overlap, where they do not, and when to reach for each.",
  },
  {
    title: "AI Engineer's Handbook to MCP Architecture",
    url: "https://medium.com/data-science-collective/ai-engineers-handbook-to-mcp-architecture-905b47965cb1",
    date: "2025-04-27",
    publication: "Data Science Collective",
    tags: ["mcp", "architecture"],
    blurb: "A multi-part walk through hosts, clients, servers, transports and the lifecycle of a tool call, written for people who ship.",
    series: true,
  },
  {
    title: "I Built an OpenAI-Style Swarm That Runs Entirely on My Laptop",
    url: "https://generativeai.pub/i-built-an-openai-style-swarm-that-runs-entirely-on-my-laptop-heres-how-ac606ba739f3",
    date: "2024-11-18",
    publication: "Generative AI",
    tags: ["agents", "local llms"],
    blurb: "Hand-off based multi-agent orchestration on Qwen 2.5, no API keys required. The write-up behind swarmloka.",
  },
  {
    title: "How I Developed a NotebookLM Clone",
    url: "https://pub.towardsai.net/how-i-developed-a-notebooklm-clone-2d901d1c72a6",
    date: "2024-10-20",
    publication: "Towards AI",
    tags: ["audio", "llms"],
    blurb: "From PDF to a two-host podcast with GPT-4 and ElevenLabs. The story behind PDF2Pod.",
  },
  {
    title: "Why you don't need LangChain for building a RAG bot",
    url: "https://thevatsalsaglani.medium.com",
    date: "2023-10-01",
    publication: "Medium",
    tags: ["rag"],
    blurb: "A plain-Python RAG pipeline, and why fewer abstractions made it easier to debug and ship.",
  },
];
