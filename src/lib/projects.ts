import type { VizMode } from "@/components/kb/Visualizer";

/* =========================================================================
   Projects. Single source of copy; used by the home projects section,
   the /projects index, and /projects/[slug]. Numbers are taken from
   Saksham's current resume and the repos themselves, not invented.
   The Lab, the cat, and the scenic dossier language are gone on purpose:
   this is a professional engineering portfolio, not a novelty site.
   ========================================================================= */

export interface SpecRow {
  label: string;
  value: string;
}

export interface Flagship {
  no: string;
  slug: string;
  name: string;
  tag: string;
  role: string;
  period: string;
  discipline: "Hardware" | "FPGA" | "Embedded" | "Applied AI" | "ML" | "Music" | "Graphics" | "Systems";
  tagline: string;
  thesis: string;
  story?: string;
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
    slug: "helion",
    name: "Helion",
    tag: "FPGA CAD · Rust",
    role: "Creator and lead developer",
    period: "2024 - Present",
    discipline: "FPGA",
    tagline: "An open-source FPGA toolchain, built from scratch in Rust",
    thesis:
      "A complete synthesis, placement, routing, timing-analysis, and bitstream flow that does not depend on a vendor tool. I built it because I wanted to understand every layer between SystemVerilog and silicon, and because I wanted a tool I could actually defend, number by number.",
    story:
      "This is the project I measure myself against. If a claim is on this page, there is a command and a run behind it.",
    headline: { value: "~30 ms", label: "empty-XDC counter, synth to bitstream" },
    overview:
      "Helion covers pack, PathFinder placement and routing, and static timing analysis in Rust, with an IDE and a Tcl session driving the same engines as the CLI. The timing gold is WNS_PS=9640, and the 1.0 corpus is 100/100, so timing and bitstream output stay honest. Targets include HL10T, Xilinx 7-series, iCE40, and ECP5, with Virtex UltraScale+ support in progress, license-free end to end. The work is AGPL-3.0-or-later.",
    spec: [
      { label: "Flow", value: "synth, pack, place, route, STA, bitstream" },
      { label: "Engines", value: "pack, PathFinder, static timing analysis" },
      { label: "Timing gold", value: "WNS_PS=9640" },
      { label: "Corpus", value: "100/100 on the 1.0 corpus" },
      { label: "Targets", value: "HL10T, Xilinx 7-series, iCE40, ECP5" },
      { label: "Interface", value: "CLI, Tcl session, IDE" },
    ],
    responsibilities: [
      "Built the synthesis, placement, routing, and timing engines in Rust.",
      "Kept timing honest with a gold WNS value and a full corpus check.",
      "Drove the same engines from the CLI, a Tcl session, and the IDE, never a vendor bitstream.",
    ],
    stack: ["Rust", "SystemVerilog", "VHDL", "PathFinder", "STA", "Tcl"],
    viz: "bars",
    demo: "https://helion-fpga.github.io/helion/",
    demoLabel: "Helion site",
    repo: "https://github.com/helion-fpga/helion",
  },
  {
    no: "02",
    slug: "shield-nrf52840",
    name: "SHIELD injury sensor",
    tag: "Embedded · Zephyr",
    role: "Undergraduate Research Assistant, USF SHIELD Lab",
    period: "Aug 2026 - Present",
    discipline: "Embedded",
    tagline: "Firmware for a mouth-worn injury sensor, on the nRF52840",
    thesis:
      "Real hardware, real constraints. I write Zephyr firmware that fuses IMU, pulse-ox, force, and temperature data, then streams packed BLE packets to a phone for live readout, while the research side uses motion, video, joint-angle, EMG, and clinical data for knee and head-injury prediction.",
    story:
      "This is where software meets a body. A dropped packet or a sloppy driver is not an abstract bug here.",
    headline: { value: "nRF52840", label: "Zephyr firmware, BLE to a phone app" },
    overview:
      "Under Dr. Templeton in the USF SHIELD Lab (Bellini), I am building sensor-node firmware for a mouth-worn injury sensor: fuse IMU, pulse-ox, force, and temperature drivers, then stream packed BLE packets to a phone app for live readout. The sensor work sits alongside models trained and validated on IRB motion, video, joint-angle, EMG, and clinical data, advancing knee and head-injury outcome prediction for clinical research.",
    spec: [
      { label: "Board", value: "nRF52840 DK (PCA10056)" },
      { label: "Firmware", value: "Zephyr RTOS" },
      { label: "Sensors", value: "IMU, pulse-ox, force, temperature" },
      { label: "Link", value: "packed BLE packets to a phone app" },
      { label: "Research", value: "knee and head-injury outcome prediction" },
      { label: "Lab", value: "USF SHIELD Lab, Dr. Templeton" },
    ],
    responsibilities: [
      "Wrote Zephyr drivers and sensor fusion for the mouth-worn sensor node.",
      "Packed sensor data into BLE packets for live phone readout.",
      "Supported injury-outcome models on IRB motion, video, EMG, and clinical data.",
    ],
    stack: ["Zephyr", "C", "nRF52840", "BLE", "IMU", "Python"],
    viz: "bars",
    repo: "https://github.com/saksham-45",
  },
  {
    no: "03",
    slug: "aicc-tutor",
    name: "AICC campus AI tutor",
    tag: "Applied AI · Production",
    role: "Undergraduate Research Assistant, USF AICC Lab",
    period: "May 2026 - Present",
    discipline: "Applied AI",
    tagline: "An AI tutor with long-term memory, used by 20,000+ students",
    thesis:
      "A tutor that only remembers the last 10 turns forgets the student. I built long-term memory so it keeps the facts that matter, prior questions and gaps included, and I measured the compiled-note method against searching old chats for cost and accuracy instead of assuming one was better.",
    story:
      "I like this one because it shipped to real students, not just a demo. That changes what counts as done.",
    headline: { value: "20,000+", label: "USF students on the production tutor" },
    overview:
      "Under Dr. Topsakal in the USF AICC Lab (Bellini), I architected long-term memory for a campus AI tutor, cut Gemini prompt latency 40% through server-side batching and MySQL caching that skips duplicate LLM calls, and deployed Gemini mind-maps to 20,000+ USF students on the production tutor using C++, PHP, JavaScript, and MySQL.",
    spec: [
      { label: "Reach", value: "20,000+ USF students, production" },
      { label: "Memory", value: "long-term, beyond the last 10 turns" },
      { label: "Latency", value: "Gemini prompt latency cut 40%" },
      { label: "Method", value: "server-side batching, MySQL caching" },
      { label: "Feature", value: "Gemini mind-maps" },
      { label: "Lab", value: "USF AICC Lab, Dr. Topsakal" },
    ],
    responsibilities: [
      "Architected long-term memory for the campus AI tutor.",
      "Cut Gemini prompt latency 40% with batching and caching.",
      "Deployed Gemini mind-maps to 20,000+ students in production.",
    ],
    stack: ["C++", "PHP", "JavaScript", "MySQL", "Gemini", "RAG"],
    viz: "oscilloscope",
  },
  {
    no: "04",
    slug: "aerolot",
    name: "AeroLot.ai",
    tag: "Applied AI · Full-stack",
    role: "Software Engineering Intern",
    period: "Aug 2026 - Present",
    discipline: "Applied AI",
    tagline: "A GenAI dealership platform with 12+ agents and 33 Autopilot rules",
    thesis:
      "Ask Aero is not a side chatbot. It answers from live store data, across CRM, inventory, and financing, with approval-gated writes so an agent cannot just do something because it sounded confident.",
    story:
      "Production AI work taught me the boring part matters most: evals, telemetry, and gates.",
    headline: { value: "12+", label: "agents, 33 Autopilot rules, one platform" },
    overview:
      "At AeroLot.ai I am building a full-stack GenAI dealership platform with 12+ agents and 33 Autopilot rules unifying CRM, inventory, and financing. I wired RAG, LLM tool use, and REST APIs so Ask Aero answers from live store data, delivered 3 chat surfaces (retail site, DMs, staff co-pilot) with approval-gated writes targeting site and SMS replies under 5 seconds, and engineered evaluation harnesses for task completion, regression, and drift plus latency and cost telemetry.",
    spec: [
      { label: "Agents", value: "12+ agents, 33 Autopilot rules" },
      { label: "Surfaces", value: "retail site, DMs, staff co-pilot" },
      { label: "Writes", value: "approval-gated" },
      { label: "Target", value: "site and SMS replies under 5 s" },
      { label: "Evals", value: "task completion, regression, drift" },
      { label: "Telemetry", value: "latency and cost" },
    ],
    responsibilities: [
      "Built the GenAI dealership platform across CRM, inventory, and financing.",
      "Wired RAG and LLM tool use to live store data for Ask Aero.",
      "Built eval harnesses and latency and cost telemetry for reliable inference.",
    ],
    stack: ["TypeScript", "Python", "RAG", "LLMs", "REST APIs", "Evals"],
    viz: "tunnel",
  },
  {
    no: "05",
    slug: "automix",
    name: "AutoMix",
    tag: "AI · Music",
    role: "Solo build",
    period: "2025",
    discipline: "Music",
    tagline: "Automatic beat-matched mixing, driven by a learned model",
    thesis:
      "Blends tracks into one continuous mix, using a dual-stage model to pick the technique and generate the automation curve for each transition.",
    headline: { value: "18", label: "mix techniques, chosen by DecisionNN + CurveLSTM" },
    overview:
      "A dual-stage architecture first picks the mixing technique, then generates the automation curves across 18 mix techniques. It uses 100+ spectral and harmonic features per pair via Monte Carlo, Demucs stem separation, and a separate data-analysis pipeline that tests transition logic against published work on mixing rather than hand-tuned rules. Demo on Hugging Face Spaces.",
    spec: [
      { label: "Model", value: "dual-stage: technique + automation curves" },
      { label: "Techniques", value: "18 mix techniques" },
      { label: "Features", value: "100+ spectral / harmonic per pair" },
      { label: "QA", value: "data-analysis pipeline, published work" },
      { label: "Audio", value: "Librosa, Demucs stem separation" },
    ],
    responsibilities: [
      "Built the dual-stage model across 18 mix techniques.",
      "Generated per-transition automation curves from the audio.",
      "Validated transition logic against published mixing work.",
    ],
    stack: ["PyTorch", "LSTM", "scikit-learn", "Librosa", "Demucs", "NumPy", "Pandas"],
    viz: "oscilloscope",
    demo: "https://huggingface.co/spaces/saksss/automix",
    demoLabel: "Live demo",
    repo: "https://github.com/saksham-45/automix",
  },
  {
    no: "06",
    slug: "mymiami",
    name: "myMiami",
    tag: "iOS · Civic",
    role: "ShellHacks 2026",
    period: "2026",
    discipline: "Systems",
    tagline: "A native iOS app guiding newcomer families through civic services",
    thesis:
      "Newcomer families do not need another chatbot. They need verified civic services, rights disclosures, and emergency workflows they can trust, in their language, with safety guardrails that refuse before they mislead.",
    headline: { value: "SwiftUI", label: "native iOS, voice-first, multilingual" },
    overview:
      "Built at ShellHacks 2026, myMiami guides newcomer families through verified civic services, rights disclosures, and emergency workflows, with multilingual voice UX, Siri shortcuts, Gemini photo classification, and refusal-first safety guardrails.",
    spec: [
      { label: "Platform", value: "native iOS, SwiftUI" },
      { label: "Voice", value: "multilingual voice UX, Siri App Intents" },
      { label: "Vision", value: "Gemini photo classification" },
      { label: "Safety", value: "refusal-first guardrails" },
      { label: "Use", value: "civic services, rights, emergencies" },
    ],
    responsibilities: [
      "Built the native iOS app for newcomer families.",
      "Added multilingual voice UX and Siri shortcuts.",
      "Added Gemini photo classification with refusal-first safety guardrails.",
    ],
    stack: ["Swift", "SwiftUI", "Gemini", "ElevenLabs", "Siri App Intents"],
    viz: "particleField",
    repo: "https://github.com/saksham-45/shellhacks-2026",
  },
  {
    no: "07",
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
    no: "08",
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
      "A high-quality (44.1 kHz) audio-ingestion pipeline drives 12+ unique audio-reactive styles rendered on a 2-D canvas. A quality controller scales pixel density on the fly to hold a consistent 60 FPS at 1080p even under extreme compute load. Built on the Web Audio API with GLSL shaders and Three.js / WebGL2.",
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
    no: "09",
    slug: "covid-help",
    name: "COVID-HELP",
    tag: "Systems at scale",
    role: "Founder & Lead Developer",
    period: "2021",
    discipline: "Systems",
    tagline: "40,000+ users to live ICU beds and oxygen",
    thesis:
      "A platform I founded during India's second COVID wave that connected 40,000+ users to live ICU-bed and oxygen availability.",
    headline: { value: "40,000+", label: "users · ~99.9% uptime" },
    overview:
      "Finding an open bed or an oxygen cylinder was a matter of hours. I founded and led a real-time crisis-response platform that served 40,000+ users, aggregating data from 50+ sources at ~99.9% uptime through unpredictable traffic. Node and Firebase powered the real-time updates, and I led a 15+ person cross-functional volunteer team on Agile.",
    spec: [
      { label: "Scale", value: "40,000+ users in production" },
      { label: "Uptime", value: "~99.9% through crisis spikes" },
      { label: "Ingestion", value: "aggregated 50+ live sources" },
      { label: "Team", value: "15+ cross-functional volunteers" },
      { label: "Backend", value: "Node.js, Firebase, real-time" },
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

export const FEATURED = FLAGSHIPS.slice(0, 4);

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
    name: "Resume Site Builder",
    blurb:
      "A 16-node agentic LangGraph workflow that designs, reviews, and repairs a personal site before it goes live. It routes CSS patches versus full rewrites, the judge never writes the files (12-defect cap), and Playwright tests run on 8 templates.",
    tags: ["Next.js", "LangGraph", "Stripe", "Playwright"],
    repo: "https://createadigitalresume.com/",
    demo: "https://createadigitalresume.com/",
  },
  {
    name: "LMMS AgentControl + MCP",
    blurb:
      "An AgentControl plugin and MCP server that expose LMMS DAW state (tracks, FX, clips, song) to an LLM through a local daemon. Built as a real plugin in the C++ DAW, with snapshot rollback.",
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
      "USF Math and Statistics research: exact combinatorial counts up to a ~602,000-digit result in under 3 seconds, replacing brute-force enumeration (11 s) with an optimized Transfer Matrix Method (0.24 us), with WebGL2 shaders and matplotlib validating the structures.",
    tags: ["Combinatorics", "Research", "Transfer Matrix", "Python"],
    repo: "https://github.com/saksham-45/isomercount",
  },
  {
    name: "introvertensemble",
    blurb:
      "A PPO agent trained in a custom Gymnasium simulator to pick the best seat in a room of introverts, with domain randomization across 128 layouts and an evaluation suite measuring 85% confidence intervals on unseen layouts.",
    tags: ["RL / PPO", "Stable-Baselines3", "Gymnasium", "Python"],
    repo: "https://github.com/saksham-45/introvertensemble",
  },
  {
    name: "Grassland",
    blurb: "Real-time grassland rendering experiments in Unity and C#.",
    tags: ["Unity", "C#", "Graphics"],
    repo: "https://github.com/saksham-45/grassland-unity3d",
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
  { value: "40,000", unit: "+", label: "users served in production", callout: true },
  { value: "20,000", unit: "+", label: "students reached, AI teaching assistant" },
  { value: "50", unit: "+", label: "open-source PRs merged, 20+ repos" },
  { value: "~30", unit: "ms", label: "Helion synth to bitstream, empty-XDC counter" },
];

/* What I build with. */
export const STACK: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "Rust", "C / C++", "SystemVerilog", "JavaScript / TypeScript", "SQL", "Bash"] },
  { group: "Hardware & Embedded", items: ["FPGA CAD", "Zephyr", "BLE", "PathFinder", "Static timing analysis", "nRF52840"] },
  { group: "Web & Backend", items: ["Next.js", "Node.js", "REST APIs", "FastAPI", "MySQL", "SQLite", "Three.js / WebGL2"] },
  { group: "ML & Applied AI", items: ["PyTorch", "TensorFlow Lite", "RAG", "LLM tool use", "Evals", "Librosa", "NumPy", "Pandas"] },
  { group: "Tools & Practices", items: ["Git / GitHub", "CI/CD", "Unit & integration testing", "Linux", "Docker"] },
];

export const PROFILE = {
  name: "Saksham Srivastava",
  role: "Computer Engineering · FPGA / Applied AI",
  thesis: "I build hardware-software systems end to end, from Rust and SystemVerilog down to the board, and from the model up to the interface.",
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
