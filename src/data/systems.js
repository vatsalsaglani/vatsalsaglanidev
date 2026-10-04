// Professional work at Qyrus, described as systems rather than product names.
// `maturity` is deliberately conservative: "shipped", "architected", "prototype" or "in progress".
export const systems = [
  {
    slug: "agent-sdk",
    title: "A shared agent SDK and execution harness",
    problem:
      "Every AI feature was becoming its own wrapper around a model API, with its own retries, tool plumbing and logging.",
    role: "Built and maintain",
    approach:
      "A reusable Python foundation adopted across internal AI applications. Teams define tools and instructions; the SDK runs the agent loop, routes tool calls, handles model invocation, retries and guardrails, and emits token, latency, error and trace telemetry by configuration.",
    capabilities: ["Standard agent loop", "Tool routing", "Retries and guardrails", "Telemetry as a switch"],
    maturity: "shipped",
    tags: ["Python", "Agent runtime", "Observability"],
  },
  {
    slug: "device-farm-ai-sessions",
    title: "Natural-language testing on real phones",
    problem:
      "Writing mobile tests means knowing the app's internals. Most people who need a test only know what they want to check.",
    role: "Led",
    approach:
      "Device Farm AI Sessions: a user states a testing objective in plain language and agents operate real Android and iOS devices to carry it out, producing a reusable test. Users can guide the agent live, run sessions in parallel, rerun them, and inspect step-by-step evidence.",
    capabilities: ["Plain-language objectives", "Live guidance", "Parallel sessions and reruns", "Step-by-step evidence"],
    maturity: "shipped",
    tags: ["Mobile agents", "Android and iOS", "UX and reporting"],
  },
  {
    slug: "distributed-runtime",
    title: "A distributed runtime with durable evidence",
    problem:
      "People need to watch an agent run while it happens, and later inspect exactly what it did. Those are different storage and streaming problems.",
    role: "Architected",
    approach:
      "Execution and reporting on AWS AgentCore and ECS, separating live session streams from durable run history and artifacts, with CI/CD integration and support for enterprise deployments.",
    capabilities: ["Live session streams", "Durable run history", "Artifacts", "CI/CD hooks"],
    maturity: "shipped",
    tags: ["AWS AgentCore", "ECS", "CI/CD"],
  },
  {
    slug: "browser-and-cross-surface",
    title: "Browser automation and cross-surface agents",
    problem: "Web testing agents need to see pages the way users and tools do: rendered, accessible, and with the network visible.",
    role: "Developed the framework; prototyped the coordination",
    approach:
      "An agent-driven browser framework with streaming execution, accessibility checks and network traces, adopted internally as the standard for AI-driven browser automation. Separately, a prototype of multi-agent workflows where isolated web and mobile agents coordinate through shared task context.",
    capabilities: ["Streaming execution", "Accessibility checks", "Network traces", "Multi-agent coordination (prototype)"],
    maturity: "shipped + prototype",
    tags: ["Playwright", "Multi-agent", "Web and mobile"],
  },
  {
    slug: "agent-memory",
    title: "Hybrid memory for long-running agents",
    problem: "Agents on long tasks forget what they learned earlier, and text-only retrieval misses what was on screen.",
    role: "Architected",
    approach:
      "A memory system combining graph relationships, semantic retrieval, structured metadata and object storage. Queue-driven ingestion is decoupled from retrieval so context can be multimodal and workflows can run long.",
    capabilities: ["Graph + semantic retrieval", "Multimodal context", "Queue-driven ingestion", "Decoupled serving"],
    maturity: "architected",
    tags: ["Knowledge graph", "Vector retrieval", "Object storage"],
  },
  {
    slug: "evaluation",
    title: "Evaluating agents, not just answers",
    problem: "A good final answer can hide a bad trajectory: wrong tools, wasted steps, lucky guesses.",
    role: "Built the LLM/RAG evaluation; designing agent evaluation",
    approach:
      "LLM and RAG evaluation, plus LLM-as-judge integration for API testing. Newer work designs evaluation of complete agent trajectories and persona scenarios using deterministic checks alongside LLM judges, with implementation ongoing.",
    capabilities: ["RAG consistency checks", "LLM-as-judge for API tests", "Trajectory evaluation (in progress)", "Persona scenarios (in progress)"],
    maturity: "shipped + in progress",
    tags: ["Evaluation", "LLM-as-judge", "RAG"],
  },
  {
    slug: "impact-analysis",
    title: "Which tests does this change touch?",
    problem: "A code change lands and nobody is sure which requirements it affects or whether the existing tests cover it.",
    role: "Implemented",
    approach:
      "Links Python code changes to business requirements and the tests that exercise them, highlighting misalignment, insufficient evidence and coverage gaps. It answers what a change may affect; it does not claim perfect dependency tracing.",
    capabilities: ["Change to requirement links", "Affected tests", "Coverage gaps"],
    maturity: "shipped",
    tags: ["Static analysis", "LLMs", "Requirements"],
  },
  {
    slug: "developer-tooling",
    title: "Testing from inside the editor",
    problem: "Developers will not leave the IDE to write API tests.",
    role: "Developed",
    approach:
      "An IDE extension pairing code search with API test generation, including assertions and test data, plus skills for API testing and MCP-backed web testing inside AI coding assistants.",
    capabilities: ["Code search", "API test generation", "Assertions and test data", "MCP-backed web testing skills"],
    maturity: "shipped",
    tags: ["IDE extension", "MCP", "Skills"],
  },
  {
    slug: "duomo",
    title: "DUOMO: a compact computer-use model",
    problem: "General vision-language models are large and slow for the narrow job of looking at a screen and deciding where to act.",
    role: "Prototyping",
    approach:
      "A compact vision-language model that predicts actions and coordinates from screenshots and objectives, with a direct spatial prediction head and training and evaluation scaffolding. Research work: no production use or benchmark claims.",
    capabilities: ["Screenshot + objective in", "Action + coordinates out", "Spatial prediction head", "Training/eval scaffolding"],
    maturity: "prototype",
    tags: ["Vision-language", "Computer use", "PyTorch"],
  },
];
