// Chronological, newest first. `type` is "work" or "education".
export const experience = [
  {
    id: "qyrus-lead",
    type: "work",
    role: "Data Science Lead, GenAI",
    org: "Qyrus",
    url: "https://www.qyrus.com",
    location: "Bengaluru",
    start: "2024-07",
    end: null,
    summary:
      "Own the GenAI roadmap: agentic workflows that make testing autonomous across web, mobile, desktop and APIs, and the platform underneath them.",
    highlights: [
      "Lead development of agentic workflows that deliver autonomous testing across web, mobile, desktop applications and APIs.",
      "Built and deployed a browser-use automation framework with streaming execution, accessibility checks and network-level trace capture, adopted internally as the standard for AI-driven automation.",
      "Developed a distributed telemetry platform that tracks every inference call across heterogeneous endpoints: operation metadata, inputs, outputs, tool traces, token usage, latency, errors and diagnostics. Shipped one-click cloud deployment templates and made telemetry a flip switch in the shared SDK.",
      "Architected a hybrid memory system combining graph relationships, semantic retrieval, structured metadata and object storage, enabling multimodal search over text and images and long-horizon agent execution through deep entity connections.",
      "Decoupled memory ingestion from retrieval with distributed compute, queue-driven transformations and scalable serving, for high-throughput ingestion and low-latency runtime access.",
      "Built and maintain a unified Python SDK adopted across all AI apps and agents, standardizing agent loops, tool integration, model invocation, retries and observability by configuration rather than custom glue code.",
      "Productized a standardized agent runtime where teams only define tools and instructions; the execution loop, tool routing, structured traces and guardrails are handled centrally by the SDK.",
      "Extended the SDK to cover embedding workflows end to end: pluggable embedding backends, chunking strategies for text, code and mixed content, batch embedding and persistence for downstream retrieval.",
      "Implemented vector storage and retrieval connectors across multiple vector backends and object stores, with multi-step decomposition and hybrid query patterns for better recall.",
      "Developed an IDE extension that pairs a REST client with agentic code search, evaluation and test generation, including route-level actions that generate API tests, assertions, test data and security audit guidance from application code.",
      "Architected a cloud marketplace deployment model for a data testing platform with control-plane and data-plane separation, one-click cluster provisioning, metering, access keys and control-plane enforced API-key validation.",
      "Built an agent evaluation stack that validates response quality with and without ground truth, measures retrieval-to-answer consistency for RAG systems, and scores tool-using agents on tool success rate, tool selection and execution reliability.",
      "Created an autonomous exploratory testing agent for mobile apps that runs on a distributed execution fabric, observes screens, takes actions, learns repeatable locators, generates objectives and data, and iterates until coverage goals or timeouts are met.",
      "Mentored and unblocked junior engineers across delivery, deployment, monitoring and documentation for an agentic browser testing workflow (extension plus backend) and a large-scale data testing service spanning 18+ serverless functions, 8+ container services, training jobs, queues, retries and pub/sub patterns.",
      "Partnered with client-facing teams on responsible AI, safety and compliance documentation that supports enterprise onboarding and trust.",
      "Led demo readiness for analyst and client conversations with demo content, videos and synchronized multi-agent walkthroughs, including the Forrester Wave preparation in which Qyrus was named in the Leaders category.",
      "Own sprint scope planning with PMs and stakeholders, run planning and retros, and support external demos at events, analyst briefings and prospect discussions.",
    ],
    stack: ["Python", "Agent runtimes", "Memory & retrieval", "Telemetry", "Evaluation", "AWS", "Azure OpenAI", "Playwright"],
  },
  {
    id: "qyrus-senior",
    type: "work",
    role: "Senior Data Science Engineer",
    org: "Qyrus",
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
    summary: "CGPA 8.48/10. Awarded VIT Best Project 2019 for the capstone. Published four papers as an undergraduate.",
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
