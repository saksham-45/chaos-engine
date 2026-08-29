import type { VizMode } from "@/components/kb/Visualizer";

/* =========================================================================
   Flagship projects. Single source of copy; used by the home projects section,
   the /projects index, and /projects/[slug]. Grounded in the real GitHub repos.
   ========================================================================= */

export interface SpecRow {
  label: string;
  value: string;
}

export interface Flagship {
  no: string;
  slug: string;
  name: string;
  tag: string; // short professional label, e.g. "On-device ML"
  role: string;
  period: string;
  discipline: "ML" | "Embedded" | "Music" | "Systems" | "Graphics";
  tagline: string;
  thesis: string;
  headline: { value: string; label: string };
  overview: string;
  spec: SpecRow[];
  responsibilities: string[];
  stack: string[];
  viz: VizMode;
  demo?: string;
  demoLabel?: string;
  repo?: string;
}

export const FLAGSHIPS: Flagship[] = [
  {
    no: "01",
    slug: "moodscope",
    name: "MoodScope",
    tag: "On-device ML",
    role: "Health Hacks @ USF 2025",
    period: "2025",
    discipline: "ML",
    tagline: "Real-time facial-emotion recognition, quantized for the edge",
    thesis:
      "Reads emotion from a face in real time on a Raspberry Pi 4, using INT8 quantization to run entirely on the edge so nothing ever leaves the device.",
    headline: { value: "~33 FPS", label: "on-device on a Raspberry Pi 4" },
    overview:
      "An on-device facial-emotion detector built for edge hardware: INT8-quantized TensorFlow Lite models hit ~30 ms per frame (~33 FPS) on a Raspberry Pi 4, and threaded dual detection backends cut frame stalls by ~45%. A local Llama 3.2 turns the readings into plain-language insight without any data leaving the device. Built at Health Hacks @ USF 2025.",
    spec: [
      { label: "Device", value: "Raspberry Pi 4 (edge)" },
      { label: "Models", value: "TensorFlow Lite, INT8 quantized" },
      { label: "Throughput", value: "~30 ms/frame (~33 FPS)" },
      { label: "Latency", value: "~45% fewer frame stalls (threaded dual backends)" },
      { label: "Insight", value: "local Llama 3.2, on-device" },
      { label: "Vision", value: "OpenCV" },
    ],
    responsibilities: [
      "Quantized the detection models to INT8 TFLite for real-time inference on a Pi 4.",
      "Built threaded dual detection backends, cutting frame stalls ~45%.",
      "Integrated a local Llama 3.2 for private, on-device insight.",
    ],
    stack: ["TensorFlow Lite (INT8)", "Llama 3.2", "OpenCV", "Raspberry Pi 4", "Python"],
    viz: "bars",
    repo: "https://github.com/saksham-45/MoodScope",
  },
  {
    no: "02",
    slug: "automix",
    name: "AutoMix",
    tag: "AI · Music",
    role: "Solo build",
    period: "2025",
    discipline: "Music",
    tagline: "Automatic beat-matched mixing, driven by a learned model",
    thesis:
      "Blends tracks into one continuous mix, using a dual-stage model to pick the technique and generate the automation curve for each transition.",
    headline: { value: "17", label: "blend / transition strategies" },
    overview:
      "A dual-stage architecture first picks the mixing technique, then generates the automation curves across 17 blend and transition strategies. A separate 3-stage data-analysis pipeline handles QA, testing the transition logic against published work on mixing rather than hand-tuned rules.",
    spec: [
      { label: "Model", value: "dual-stage: technique + automation curves" },
      { label: "Strategies", value: "17 blend / transition types" },
      { label: "QA", value: "3-stage data-analysis pipeline" },
      { label: "Audio", value: "Librosa · Demucs stem separation" },
    ],
    responsibilities: [
      "Built the dual-stage model across 17 blend/transition strategies.",
      "Generated per-transition automation curves from the audio.",
      "Architected a 3-stage QA pipeline validating the transition logic.",
    ],
    stack: ["PyTorch", "LSTM", "scikit-learn", "Librosa", "Demucs", "NumPy", "Pandas"],
    viz: "oscilloscope",
    demo: "https://huggingface.co/spaces/saksss/automix",
    demoLabel: "Live demo",
    repo: "https://github.com/saksham-45/automix",
  },
  {
    no: "03",
    slug: "visualizzer",
    name: "Visualizzer",
    tag: "Real-time graphics",
    role: "Solo build",
    period: "2026",
    discipline: "Graphics",
    tagline: "Real-time audio-reactive graphics from live sound",
    thesis:
      "Turns live audio into reactive graphics: a 44.1 kHz ingestion pipeline drives 12+ styles on a 2-D canvas, held at a steady 60 FPS.",
    headline: { value: "12+", label: "audio-reactive styles" },
    overview:
      "A high-quality (44.1 kHz) audio-ingestion pipeline drives 12+ unique audio-reactive styles rendered on a 2-D canvas. A quality controller scales pixel density on the fly to hold a consistent 60 FPS at 1080p even under extreme compute load. Built on the Web Audio API with GLSL shaders and Three.js / WebGL2. (The windows around this site are small visualizers built the same way.)",
    spec: [
      { label: "Ingestion", value: "44.1 kHz audio pipeline" },
      { label: "Styles", value: "12+ audio-reactive visualizers" },
      { label: "Canvas", value: "2-D canvas rendering" },
      { label: "Perf", value: "adaptive pixel density, 60 FPS @ 1080p" },
    ],
    responsibilities: [
      "Built the 44.1 kHz audio-ingestion and analysis pipeline.",
      "Designed 12+ audio-reactive visual styles.",
      "Wrote a quality controller scaling pixel density to hold 60 FPS at 1080p.",
    ],
    stack: ["Web Audio API", "GLSL", "Three.js", "WebGL2", "TypeScript"],
    viz: "particleField",
    demo: "https://visualizzer.vercel.app/",
    demoLabel: "Live demo",
    repo: "https://github.com/saksham-45/visualizzer",
  },
  {
    no: "04",
    slug: "covid-help",
    name: "COVID-HELP",
    tag: "Systems at scale",
    role: "Founder & Lead Developer",
    period: "2021",
    discipline: "Systems",
    tagline: "10,000+ people to live ICU beds and oxygen",
    thesis:
      "A platform I founded during India's second COVID wave that connected 10,000+ people to live ICU-bed and oxygen availability.",
    headline: { value: "10,000+", label: "people served · ~99.9% uptime" },
    overview:
      "Finding an open bed or an oxygen cylinder was a matter of hours. I founded and led a real-time crisis-response platform that served 10,000+ people, aggregating data from 50+ sources at ~99.9% uptime through unpredictable traffic. Node and Firebase powered the real-time updates, and I led a 15+ person cross-functional volunteer team on Agile.",
    spec: [
      { label: "Scale", value: "10,000+ users in production" },
      { label: "Uptime", value: "~99.9% through crisis spikes" },
      { label: "Ingestion", value: "aggregated 50+ live sources" },
      { label: "Team", value: "15+ cross-functional volunteers" },
      { label: "Backend", value: "Node.js · Firebase, real-time" },
    ],
    responsibilities: [
      "Founded the platform and led a 15+ person volunteer team on Agile.",
      "Architected the ingestion pipeline aggregating 50+ live sources.",
      "Held ~99.9% uptime through unpredictable crisis traffic.",
    ],
    stack: ["Node.js", "Firebase", "REST APIs", "Real-time"],
    viz: "tunnel",
  },
];

export function getFlagship(slug: string): Flagship | undefined {
  return FLAGSHIPS.find((p) => p.slug === slug);
}

/* Selected work beyond the flagships, from GitHub, showing the range. */
export interface Selected {
  name: string;
  blurb: string;
  tags: string[];
  repo: string;
  demo?: string;
}

export const SELECTED: Selected[] = [
  {
    name: "LMMS AgentControl + MCP",
    blurb:
      "An AgentControl plugin and MCP server that expose LMMS DAW state (tracks, FX, clips, song) to an LLM through a local daemon. Built as a real plugin in the C++ DAW. The upstream PR was not merged; the work is mine.",
    tags: ["C++", "Qt", "MCP", "DAW"],
    repo: "https://github.com/saksham-45/lmms",
  },
  {
    name: "Mathon",
    blurb:
      "A scientific-computing language with a real compiler: parser to AST, LLVM IR via llvmlite, JIT to native code, plus symbolic and automatic differentiation.",
    tags: ["Compilers", "LLVM", "Autodiff", "Python"],
    repo: "https://github.com/saksham-45/Mathon",
  },
  {
    name: "isomercount",
    blurb:
      "USF Math & Statistics research: a Python pipeline that computes exact combinatorial counts up to a ~602,000-digit result in under 3 seconds, replacing brute-force enumeration (11 s) with an optimized Transfer Matrix Method (0.24 µs), with WebGL2 shaders and matplotlib validating the structures.",
    tags: ["Combinatorics", "Research", "Transfer Matrix", "Python"],
    repo: "https://github.com/saksham-45/isomercount",
  },
  {
    name: "Grassland",
    blurb: "Real-time grassland rendering experiments in Unity and C#.",
    tags: ["Unity", "C#", "Graphics"],
    repo: "https://github.com/saksham-45/grassland-unity3d",
  },
  {
    name: "introvertensemble",
    blurb:
      "A PPO agent trained in a custom Gymnasium simulator to pick the best seat in a room of introverts, with domain randomization across 128 layouts and an evaluation suite measuring 85% confidence intervals on unseen layouts.",
    tags: ["RL / PPO", "Stable-Baselines3", "Gymnasium", "Python"],
    repo: "https://github.com/saksham-45/introvertensemble",
  },
  {
    name: "codeformaths",
    blurb: "A growing set of Python scripts for the calculations I reach for most.",
    tags: ["Math", "Python"],
    repo: "https://github.com/saksham-45/codeformaths",
  },
];

/* Four headline numbers. */
export const STATS: { value: string; unit?: string; label: string; callout?: boolean }[] = [
  { value: "10,000", unit: "+", label: "people served in production", callout: true },
  { value: "~99.9", unit: "%", label: "uptime under crisis traffic" },
  { value: "20,000", unit: "+", label: "students reached, AI teaching assistant" },
  { value: "~30", unit: "ms", label: "on-device inference per frame" },
];

/* What I build with. */
export const STACK: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "C / C++", "JavaScript / TypeScript", "SQL", "Bash", "HTML / CSS"] },
  { group: "Web & Backend", items: ["Next.js", "Node.js", "REST APIs", "FastAPI", "MySQL", "SQLite", "Three.js / WebGL2"] },
  { group: "ML / Data", items: ["PyTorch", "TensorFlow Lite", "scikit-learn", "Librosa", "NumPy", "Pandas"] },
  { group: "Tools & Practices", items: ["Git / GitHub", "CI/CD", "unit & integration testing", "Linux", "Docker"] },
];

export const PROFILE = {
  name: "Saksham Srivastava",
  role: "Full-stack Developer",
  thesis: "Full-stack developer and researcher. I build applications end to end, with a strong foundation in ML.",
  location: "Tampa, FL",
  email: "saksham146053@gmail.com",
  phone: "(813) 860-8506",
  phoneHref: "tel:+18138608506",
  github: "https://github.com/saksham-45",
  githubHandle: "github.com/saksham-45",
  linkedin: "https://linkedin.com/in/sakshamsriv",
  linkedinHandle: "linkedin.com/in/sakshamsriv",
  scholar: "Green & Gold Presidential Scholar",
  research: "Undergraduate researcher, USF Bellini College of AI",
  mathMinor: "Math minor",
};
