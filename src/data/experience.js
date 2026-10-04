// Chronological, newest first. `type` is "work" or "education".
export const experience = [
  {
    id: "qyrus-lead",
    type: "work",
    role: "Data Science Lead, GenAI",
    org: "Qyrus",
    url: "https://www.qyrus.com",
    location: "Bengaluru",
    employerNote: "Quinnox, Jul 2024 – Feb 2026 · Qyrus India, Mar 2026 – present (one continuous role)",
    start: "2024-07",
    end: null,
    summary:
      "Lead AI engineering for Qyrus: agents that test software across web, mobile, desktop and APIs, and the systems that make them reliable.",
    highlights: [
      "Built and maintain a shared Python agent SDK and execution harness adopted across internal AI applications, standardizing model calls, tool execution, retries and guardrails, with token, latency, error and trace telemetry.",
      "Led Device Farm AI Sessions: users state a testing objective in plain language and agents operate real Android and iOS devices to produce reusable tests, with live guidance, parallel sessions, reruns and step-by-step evidence.",
      "Architected execution and reporting on AWS AgentCore and ECS, separating live session streams from durable run history and artifacts, with CI/CD integration and enterprise deployment support.",
      "Developed an agent-driven browser automation framework with streaming execution, accessibility checks and network traces; prototyped multi-agent workflows coordinating isolated web and mobile agents through shared task context.",
      "Architected a hybrid agent memory system combining graph relationships, semantic retrieval, metadata and object storage, with queue-driven ingestion decoupled from retrieval for multimodal context and long-running workflows.",
      "Built LLM and RAG evaluation and led LLM-as-judge integration for API testing; designing evaluation of full agent trajectories and persona scenarios with deterministic checks plus LLM judges, implementation ongoing.",
      "Implemented code-change impact analysis linking Python changes to business requirements and affected tests, surfacing misalignment, thin evidence and coverage gaps.",
      "Developed an IDE extension for code search and API test generation (assertions and test data), and skills for API testing and MCP-backed web testing in AI coding assistants.",
      "Prototyping DUOMO, a compact vision-language computer-use model that predicts actions and coordinates from screenshots and objectives, including a direct spatial prediction head and training and evaluation scaffolding (research, not production).",
      "Set technical direction, mentor engineers and plan delivery with product stakeholders; partner with client-facing teams on responsible AI, safety and compliance documentation.",
      "Participate in Forrester and Gartner analyst briefings, explaining Qyrus's AI capabilities and demonstrating agent-driven testing workflows.",
    ],
    stack: ["Python", "Agent runtimes", "AWS AgentCore", "ECS", "Memory and retrieval", "Evaluation", "Playwright", "PyTorch"],
  },
  {
    id: "qyrus-senior",
    type: "work",
    role: "Senior Data Science Engineer",
    org: "Quinnox (Qyrus product)",
    url: "https://www.qyrus.com",
    location: "Bengaluru",
    start: "2021-11",
    end: "2024-07",
    summary:
      "Took Qyrus from classical ML models to generative AI, building the first LLM-powered testing products.",
    highlights: [
      "Led development of the Generative AI Software Testing Kit (STK), a Python package that let traditional QA teams use AI in their existing workflows.",
      "Designed a cloud API-testing agent on LLMs with robust fallback strategies, and copilot bots for web, mobile, API and desktop testing.",
      "Trained transformer models from scratch for text classification and NER, and a decoder-only recommender that suggests the next step while authoring tests.",
      "Fine-tuned DETR, Detectron2 and YOLO for UI element detection, and fine-tuned Mistral and Llama for custom vision and text tasks.",
      "Built a self-serve RAG system with tool integration (bring your own actions) and a distributed chatbot-testing service on Kafka, DynamoDB and Redis.",
      "Led a four-person team shipping a desktop-app testing and data comparison service on SQS and Lambda.",
    ],
    stack: ["PyTorch", "Transformers", "Computer vision", "RAG", "AWS", "Kafka", "Next.js", "SvelteKit"],
  },
  {
    id: "quinnox",
    type: "work",
    role: "Machine Learning Consultant",
    org: "Quinnox",
    url: "https://www.quinnox.com",
    location: "Bengaluru",
    start: "2020-01",
    end: "2021-11",
    summary: "Built the NLP stack for automated content categorisation and a conversational bot for test automation.",
    highlights: [
      "Shipped text classification models with scikit-learn, FastText and Gensim, and transformer-based NER.",
      "Designed a text augmentation process that injects realistic errors to harden models against noisy input.",
      "Built a unified async backend (FastAPI, Flask, aiohttp) serving predictions from a fleet of models.",
    ],
    stack: ["Python", "scikit-learn", "FastText", "Transformers", "FastAPI"],
  },
  {
    id: "krishihub",
    type: "work",
    role: "Data Science Intern",
    org: "KrishiHub",
    start: "2019-09",
    end: "2020-01",
    summary: "Crop disease detection that went to production.",
    highlights: [
      "Wrote OpenCV algorithms to isolate diseased regions of crops and a meta-learning classifier for disease type, then integrated both into a deployed pipeline.",
    ],
    stack: ["OpenCV", "Meta-learning", "Python"],
  },
  {
    id: "iiita",
    type: "work",
    role: "Machine Learning Intern",
    org: "IIIT Allahabad",
    start: "2019-05",
    end: "2019-07",
    summary: "Network traffic analysis across switches to optimise cluster efficiency, cutting cost and energy use.",
    highlights: [],
    stack: ["Python", "Data analysis"],
  },
  {
    id: "vit",
    type: "education",
    role: "B.Tech, Computer Science and Engineering",
    org: "Vellore Institute of Technology",
    start: "2015-06",
    end: "2019-05",
    summary: "GPA 8.48/10. VIT Best Project Award, 2019. Published four papers as an undergraduate.",
    highlights: [],
    stack: [],
  },
];

export function formatRange(start, end) {
  const fmt = (ym) => {
    const [y, m] = ym.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  };
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}
