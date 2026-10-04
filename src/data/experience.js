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
      "Own the GenAI roadmap: agentic workflows that make testing autonomous across web, mobile, desktop and APIs.",
    highlights: [
      "Built and deployed a Playwright-based browser-use framework with adaptive streaming, accessibility checks and HAR logging. It became the standard for browser automation across the product.",
      "Architected multi-agent orchestration so complex automation scenarios are composed from cooperating agents instead of hand-written flows.",
      "Maintain the QyrusAI SDK (published on PyPI) and the internal QAI package, giving every team one standard way to call OpenAI, Azure OpenAI, AWS Bedrock, Groq and Claude.",
      "Built DevBot, an internal AI assistant with diagramming and code preview used by UI, backend and data teams.",
      "Set up SageMaker pipelines for enterprise-wide training and processing, plus domain knowledge bases for Qyrus, SAP and Calypso that measurably improved answer quality.",
      "Wrote the client-facing documentation on AI safety, compliance and ethics that enterprise onboarding now relies on.",
    ],
    stack: ["Python", "LLM agents", "Playwright", "AWS Bedrock", "SageMaker", "Azure OpenAI", "FastAPI"],
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
