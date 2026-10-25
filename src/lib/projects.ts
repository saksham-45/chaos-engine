/* Projects. Single source of copy for home, /projects, and /projects/[slug].
   Tone rule, Oct 25: plain engineering description. No marketing language,
   no claims without a number or a link, no story quotes. If a project has
   no public screenshot, its card shows a static diagram of what it does,
   labeled as a diagram, not a demo. */

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
  description: string;
  headline: { value: string; label: string };
  spec: SpecRow[];
  responsibilities: string[];
  stack: string[];
  image?: string;
  imageLabel?: string;
  imageKind?: "screenshot" | "diagram";
  flow?: string[];
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
    tagline: "Open-source FPGA toolchain in Rust",
    description:
      "I built Helion as a synthesis, packing, placement, routing, timing-analysis, and bitstream-generation toolchain. It includes a CLI, a Tcl session, and an IDE that drive the same engines. Targets include HL10T, Xilinx 7-series, iCE40, and ECP5, with Virtex UltraScale+ support in progress. The timing gold value is WNS_PS=9640, and the 1.0 corpus is 100/100. The project is AGPL-3.0-or-later.",
    headline: { value: "~30 ms", label: "empty-XDC counter, synth to bitstream" },
    spec: [
      { label: "Flow", value: "synth, pack, place, route, STA, bitstream" },
      { label: "Engines", value: "pack, PathFinder, static timing analysis" },
      { label: "Timing gold", value: "WNS_PS=9640" },
      { label: "Corpus", value: "100/100 on the 1.0 corpus" },
      { label: "Targets", value: "HL10T, Xilinx 7-series, iCE40, ECP5" },
      { label: "Interface", value: "CLI, Tcl session, IDE" },
    ],
    responsibilities: [
      "Implemented synthesis, placement, routing, and timing engines in Rust.",
      "Maintained a gold timing value and a full corpus check for timing and bitstream output.",
      "Wired the same engines to the CLI, a Tcl session, and the IDE.",
    ],
    stack: ["Rust", "SystemVerilog", "VHDL", "PathFinder", "STA", "Tcl"],
    image: "/projects/shots/helion-ide-device.png",
    imageLabel: "Screenshot · Helion IDE, device view",
    imageKind: "screenshot",
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
    tagline: "Zephyr firmware for a mouth-worn injury sensor",
    description:
      "I write Zephyr firmware for a mouth-worn injury sensor on the nRF52840. The firmware reads IMU, pulse-ox, force, and temperature sensors and streams packed BLE packets to a phone app for live readout. Related research uses motion, video, joint-angle, EMG, and clinical data for knee and head-injury outcome prediction. Advisor: Dr. Templeton, USF SHIELD Lab.",
    headline: { value: "nRF52840", label: "Zephyr firmware, BLE to a phone app" },
    spec: [
      { label: "Board", value: "nRF52840 DK (PCA10056)" },
      { label: "Firmware", value: "Zephyr RTOS" },
      { label: "Sensors", value: "IMU, pulse-ox, force, temperature" },
      { label: "Link", value: "packed BLE packets to a phone app" },
      { label: "Research", value: "knee and head-injury outcome prediction" },
      { label: "Lab", value: "USF SHIELD Lab, Dr. Templeton" },
    ],
    responsibilities: [
      "Wrote Zephyr drivers and sensor fusion for the sensor node.",
      "Packed sensor data into BLE packets for live phone readout.",
      "Supported injury-outcome models on IRB motion, video, EMG, and clinical data.",
    ],
    stack: ["Zephyr", "C", "nRF52840", "BLE", "IMU", "Python"],
    imageLabel: "Diagram · sensor to phone",
    imageKind: "diagram",
    flow: ["Sensors", "nRF52840", "BLE packets", "Phone app"],
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
    tagline: "Campus AI tutor with long-term memory",
    description:
      "I built long-term memory for a campus AI tutor at USF, so it retains prior questions and gaps instead of only the last 10 chat turns. I compared compiled-note and search-old-chat methods for cost and accuracy. I also cut Gemini prompt latency 40% with server-side batching and MySQL caching, and deployed Gemini mind-maps to 20,000+ USF students on the production tutor. Advisor: Dr. Topsakal, USF AICC Lab.",
    headline: { value: "20,000+", label: "USF students on the production tutor" },
    spec: [
      { label: "Reach", value: "20,000+ USF students, production" },
      { label: "Memory", value: "long-term, beyond the last 10 turns" },
      { label: "Latency", value: "Gemini prompt latency cut 40%" },
      { label: "Method", value: "server-side batching, MySQL caching" },
      { label: "Feature", value: "Gemini mind-maps" },
      { label: "Lab", value: "USF AICC Lab, Dr. Topsakal" },
    ],
    responsibilities: [
      "Built long-term memory for the campus AI tutor.",
      "Cut Gemini prompt latency 40% with batching and caching.",
      "Deployed Gemini mind-maps to 20,000+ students in production.",
    ],
    stack: ["C++", "PHP", "JavaScript", "MySQL", "Gemini", "RAG"],
    imageLabel: "Diagram · student to tutor to memory",
    imageKind: "diagram",
    flow: ["Student", "Tutor", "Long-term memory", "Mind-maps"],
  },
  {
    no: "04",
    slug: "aerolot",
    name: "AeroLot.ai",
    tag: "Applied AI · Full-stack",
    role: "Software Engineering Intern",
    period: "Aug 2026 - Present",
    discipline: "Applied AI",
    tagline: "GenAI dealership platform",
    description:
      "I work on a full-stack GenAI dealership platform with 12+ agents and 33 Autopilot rules covering CRM, inventory, and financing. I wired RAG, LLM tool use, and REST APIs so Ask Aero answers from live store data. The platform has 3 chat surfaces (retail site, DMs, staff co-pilot) with approval-gated writes, targeting site and SMS replies under 5 seconds. I also built evaluation harnesses for task completion, regression, and drift, with latency and cost telemetry.",
    headline: { value: "12+", label: "agents, 33 Autopilot rules, one platform" },
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
      "Built eval harnesses and latency and cost telemetry.",
    ],
    stack: ["TypeScript", "Python", "RAG", "LLMs", "REST APIs", "Evals"],
    imageLabel: "Diagram · store data to Ask Aero",
    imageKind: "diagram",
    flow: ["CRM", "Inventory", "Financing", "Ask Aero"],
  },
  {
    no: "05",
    slug: "automix",
    name: "AutoMix",
    tag: "AI · Music",
    role: "Solo build",
    period: "2025",
    discipline: "Music",
    tagline: "Automatic beat-matched mixing",
    description:
      "AutoMix blends tracks into one continuous mix. A dual-stage model picks the mixing technique, then generates the automation curve for each transition, across 18 mix techniques. It uses 100+ spectral and harmonic features per pair, Demucs stem separation, and a data-analysis pipeline that tests transition logic against published mixing work. A demo is on Hugging Face Spaces.",
    headline: { value: "18", label: "mix techniques, DecisionNN + CurveLSTM" },
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
    imageLabel: "Diagram · audio to mix",
    imageKind: "diagram",
    flow: ["Tracks", "Demucs stems", "DecisionNN", "CurveLSTM", "Mix"],
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
    tagline: "Native iOS app for newcomer families in Miami",
    description:
      "myMiami is a native iOS app that guides newcomer families through verified civic services, rights disclosures, and emergency workflows in Miami-Dade. It supports 10 languages, uses Siri App Intents (5 intents), Gemini photo classification, and ElevenLabs voice synthesis. Phone numbers and desks come from a verified local ledger, and the app uses refusal-first guardrails: it refuses to guess a number, fee, or ordinance instead of inventing one.",
    headline: { value: "10", label: "languages, 5 Siri App Intents" },
    spec: [
      { label: "Platform", value: "native iOS, SwiftUI" },
      { label: "Languages", value: "10, including Spanish, Haitian Creole, Portuguese" },
      { label: "Voice", value: "multilingual voice UX, Siri App Intents" },
      { label: "Vision", value: "Gemini photo classification" },
      { label: "Safety", value: "refusal-first guardrails, verified ledger" },
    ],
    responsibilities: [
      "Built the native iOS app for newcomer families.",
      "Added multilingual voice UX and Siri shortcuts.",
      "Added Gemini photo classification with refusal-first safety guardrails.",
    ],
    stack: ["Swift", "SwiftUI", "Gemini", "ElevenLabs", "Siri App Intents"],
    imageLabel: "Diagram · family to verified civic step",
    imageKind: "diagram",
    flow: ["Family", "Verified ledger", "Walkthrough", "Next step"],
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
    tagline: "Facial-emotion recognition, quantized for the edge",
    description:
      "MoodScope reads facial emotion in real time on a Raspberry Pi 4. INT8-quantized TensorFlow Lite models run at about 30 ms per frame (about 33 FPS), and threaded dual detection backends cut frame stalls by about 45%. A local Llama 3.2 turns readings into plain-language insight without data leaving the device. Built at Health Hacks @ USF 2025.",
    headline: { value: "~33 FPS", label: "on-device on a Raspberry Pi 4" },
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
      "Built threaded dual detection backends, cutting frame stalls about 45%.",
      "Integrated a local Llama 3.2 for private, on-device insight.",
    ],
    stack: ["TensorFlow Lite (INT8)", "Llama 3.2", "OpenCV", "Raspberry Pi 4", "Python"],
    image: "/projects/shots/moodscope-live.webp",
    imageLabel: "Screenshot · MoodScope live detection",
    imageKind: "screenshot",
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
    tagline: "Audio-reactive graphics from live sound",
    description:
      "Visualizzer turns live audio into reactive graphics. A 44.1 kHz audio-ingestion pipeline drives 12+ visual styles on a 2-D canvas. A quality controller scales pixel density to hold 60 FPS at 1080p under load. It uses the Web Audio API, GLSL shaders, and Three.js / WebGL2. The live demo is linked below; the card image here is a diagram, not a live visualizer.",
    headline: { value: "12+", label: "audio-reactive styles" },
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
    imageLabel: "Diagram · audio to canvas",
    imageKind: "diagram",
    flow: ["Live audio", "Analyzer", "Styles", "Canvas"],
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
    tagline: "Live ICU-bed and oxygen availability, 2021",
    description:
      "I founded COVID-HELP during India's second COVID wave. It connected 40,000+ users to live ICU-bed and oxygen availability, aggregating data from 50+ sources at about 99.9% uptime through traffic spikes. The backend used Node.js and Firebase for real-time updates, and I led a 15+ person volunteer team.",
    headline: { value: "40,000+", label: "users · ~99.9% uptime" },
    spec: [
      { label: "Scale", value: "40,000+ users in production" },
      { label: "Uptime", value: "~99.9% through crisis spikes" },
      { label: "Ingestion", value: "aggregated 50+ live sources" },
      { label: "Team", value: "15+ cross-functional volunteers" },
      { label: "Backend", value: "Node.js, Firebase, real-time" },
    ],
    responsibilities: [
      "Founded the platform and led a 15+ person volunteer team.",
      "Built the ingestion pipeline aggregating 50+ live sources.",
      "Held about 99.9% uptime through unpredictable crisis traffic.",
    ],
    stack: ["Node.js", "Firebase", "REST APIs", "Real-time"],
    imageLabel: "Diagram · sources to users",
    imageKind: "diagram",
    flow: ["50+ sources", "Ingest", "Firebase", "Users"],
  },
];

export function getFlagship(slug: string): Flagship | undefined {
  return FLAGSHIPS.find((p) => p.slug === slug);
}

export const FEATURED = FLAGSHIPS.slice(0, 4);

/* Selected work beyond the flagships. */
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
      "An AgentControl plugin and MCP server that expose LMMS DAW state (tracks, FX, clips, song) to an LLM through a local daemon. Built as a plugin in the C++ DAW, with snapshot rollback.",
    tags: ["C++", "Qt", "MCP", "DAW"],
    repo: "https://github.com/saksham-45/lmms",
  },
  {
    name: "Mathon",
    blurb:
      "A scientific-computing language with a compiler: parser to AST, LLVM IR via llvmlite, JIT to native code, plus symbolic and automatic differentiation.",
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
    blurb: "Python scripts for the calculations I reach for most.",
    tags: ["Math", "Python"],
    repo: "https://github.com/saksham-45/codeformaths",
  },
];

export const STATS: { value: string; unit?: string; label: string; callout?: boolean }[] = [
  { value: "40,000", unit: "+", label: "users served in production", callout: true },
  { value: "20,000", unit: "+", label: "students reached, AI teaching assistant" },
  { value: "50", unit: "+", label: "open-source PRs merged, 20+ repos" },
  { value: "~30", unit: "ms", label: "Helion synth to bitstream, empty-XDC counter" },
];

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
  thesis: "Computer engineering student working on FPGA tooling, embedded firmware, and applied AI.",
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
