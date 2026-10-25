/* Projects. Single source of copy for home, /projects, and /projects/[slug].
   Tone rule, Oct 25: first person, simple. Each project says only three
   things: what I did, why I did it, and how I did it. No extra language.
   If a project has no public screenshot, its card shows a static diagram
   of what it does, labeled as a diagram, not a demo. */

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
  what: string;
  why: string;
  how: string;
  headline: { value: string; label: string };
  spec: SpecRow[];
  stack: string[];
  image?: string;
  imageLabel?: string;
  gallery?: { src: string; label: string }[];
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
    what: "I built Helion, an open-source FPGA toolchain in Rust. It does synthesis, packing, placement, routing, timing analysis, and bitstream generation, with a CLI, a Tcl session, and an IDE on the same engines.",
    why: "I did it because FPGA work should not depend on proprietary vendor tools and black boxes. A design should build the same way every time, fail loudly instead of silently clipping, and be checkable.",
    how: "I wrote the pack, PathFinder placement and routing, and timing engines in Rust. I kept a gold timing value, WNS_PS=9640, and a corpus check, 100/100 on the 1.0 corpus, and I added HL10T, Xilinx 7-series, iCE40, and ECP5 targets, with UltraScale+ in progress.",
    headline: { value: "~30 ms", label: "empty-XDC counter, synth to bitstream" },
    spec: [
      { label: "Flow", value: "synth, pack, place, route, STA, bitstream" },
      { label: "Engines", value: "pack, PathFinder, static timing analysis" },
      { label: "Timing gold", value: "WNS_PS=9640" },
      { label: "Corpus", value: "100/100 on the 1.0 corpus" },
      { label: "Targets", value: "HL10T, Xilinx 7-series, iCE40, ECP5" },
      { label: "Interface", value: "CLI, Tcl session, IDE" },
    ],
    stack: ["Rust", "SystemVerilog", "VHDL", "PathFinder", "STA", "Tcl"],
    image: "/projects/shots/helion-ide-device.png",
    imageLabel: "Helion IDE, device view",
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
    what: "I write Zephyr firmware for a 10-sensor mouthguard telemetry node on the nRF52840, in the USF SHIELD Lab with Dr. Templeton.",
    why: "I did it because a mouthguard sensor has a small battery and a slow BLE link. Sending every tiny reading in its own packet wastes 89 percent on overhead, and an impact spike should not wait for a batch window.",
    how: "I wrote drivers for 2 high-G accelerometers, 2 6-axis IMUs, 2 molar force sensors, heart rate and SpO2, and 2 temperature sensors, and I packed them into a 10-sensor TLV superframe, 138 bytes in a 244 byte BLE notification, with impact data flushed immediately and other data prioritized, for about 21 hours on a 40 mAh mouthguard battery.",
    headline: { value: "nRF52840", label: "Zephyr firmware, BLE to a phone app" },
    spec: [
      { label: "Board", value: "nRF52840 DK (PCA10056)" },
      { label: "Firmware", value: "Zephyr RTOS" },
      { label: "Sensors", value: "10: 2 high-G accel, 2 IMU, 2 molar FSR, HR plus SpO2, 2 temperature" },
      { label: "Link", value: "10-sensor TLV superframe, 138 bytes in a 244 byte BLE notification, 2M PHY" },
      { label: "Battery", value: "about 21 hours on a 40 mAh mouthguard battery" },
      { label: "Lab", value: "USF SHIELD Lab, Dr. Templeton" },
    ],
    stack: ["Zephyr", "C", "nRF52840", "BLE", "IMU", "Python"],
    imageLabel: "sensor to phone",
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
    what: "I built long-term memory for the campus AI tutor at USF, in the AICC Lab with Dr. Topsakal.",
    why: "I did it because a tutor that only remembers the last 10 turns cannot help a student build on earlier questions and gaps.",
    how: "I compared compiled-note and search-old-chat methods for cost and accuracy, I cut Gemini prompt latency 40% with server-side batching and MySQL caching, and I deployed Gemini mind-maps to 20,000+ USF students.",
    headline: { value: "20,000+", label: "USF students on the production tutor" },
    spec: [
      { label: "Reach", value: "20,000+ USF students, production" },
      { label: "Memory", value: "long-term, beyond the last 10 turns" },
      { label: "Latency", value: "Gemini prompt latency cut 40%" },
      { label: "Method", value: "server-side batching, MySQL caching" },
      { label: "Feature", value: "Gemini mind-maps" },
      { label: "Lab", value: "USF AICC Lab, Dr. Topsakal" },
    ],
    stack: ["C++", "PHP", "JavaScript", "MySQL", "Gemini", "RAG"],
    imageLabel: "student to tutor to memory",
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
    what: "I work on a GenAI dealership platform at AeroLot.ai, as a software engineering intern.",
    why: "I did it because a dealership assistant that guesses from old data is worse than no assistant. It should answer from live CRM, inventory, and financing data.",
    how: "I wired RAG, LLM tool use, and REST APIs into Ask Aero, across 3 chat surfaces with approval-gated writes, and I built evaluation harnesses for task completion, regression, and drift, with latency and cost telemetry.",
    headline: { value: "12+", label: "agents, 33 Autopilot rules, one platform" },
    spec: [
      { label: "Agents", value: "12+ agents, 33 Autopilot rules" },
      { label: "Surfaces", value: "retail site, DMs, staff co-pilot" },
      { label: "Writes", value: "approval-gated" },
      { label: "Target", value: "site and SMS replies under 5 s" },
      { label: "Evals", value: "task completion, regression, drift" },
      { label: "Telemetry", value: "latency and cost" },
    ],
    stack: ["TypeScript", "Python", "RAG", "LLMs", "REST APIs", "Evals"],
    imageLabel: "store data to Ask Aero",
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
    what: "I built AutoMix, a tool that blends tracks into one continuous mix.",
    why: "I did it because an automatic mix should sound like a human DJ made it, tempo-matched, phrase-locked, loudness-matched, with bass swapped on a downbeat, not a simple volume fade.",
    how: "I built a dual-stage model, DecisionNN to pick one of 18 mix techniques and CurveLSTM to generate the automation curve, using 100+ spectral and harmonic features per pair and Demucs stem separation.",
    headline: { value: "18", label: "mix techniques, DecisionNN + CurveLSTM" },
    spec: [
      { label: "Model", value: "dual-stage: technique + automation curves" },
      { label: "Techniques", value: "18 mix techniques" },
      { label: "Features", value: "100+ spectral / harmonic per pair" },
      { label: "QA", value: "data-analysis pipeline, published work" },
      { label: "Audio", value: "Librosa, Demucs stem separation" },
    ],
    stack: ["PyTorch", "LSTM", "scikit-learn", "Librosa", "Demucs", "NumPy", "Pandas"],
    imageLabel: "audio to mix",
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
    what: "I built myMiami, a native iOS app that guides newcomer families through verified civic services, rights disclosures, and emergency workflows in Miami-Dade, at ShellHacks 2026.",
    why: "I did it because in Miami many families rely on one kid to translate everything, the leak, the fender bender, the county office. When something goes wrong, newcomers need the next right step, in their language, from a source they can trust, not a chatbot.",
    how: "I built it in SwiftUI with 10 languages, 5 Siri App Intents, Gemini photo classification, and ElevenLabs voice, and I used a verified local ledger with refusal-first guardrails, so it refuses instead of inventing a number, fee, or ordinance.",
    headline: { value: "10", label: "languages, 5 Siri App Intents" },
    spec: [
      { label: "Platform", value: "native iOS, SwiftUI" },
      { label: "Languages", value: "10, including Spanish, Haitian Creole, Portuguese" },
      { label: "Voice", value: "multilingual voice UX, Siri App Intents" },
      { label: "Vision", value: "Gemini photo classification" },
      { label: "Safety", value: "refusal-first guardrails, verified ledger" },
    ],
    stack: ["Swift", "SwiftUI", "Gemini", "ElevenLabs", "Siri App Intents"],
    imageLabel: "family to verified civic step",
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
    what: "I built MoodScope, a facial-emotion app that runs on a Raspberry Pi 4, at Health Hacks at USF 2025.",
    why: "I did it because people want to understand their own emotions in real time, for wellness and self-awareness, and that should not require sending their face video to a server.",
    how: "I quantized TensorFlow Lite models to INT8, about 30 ms per frame, about 33 FPS, I used threaded dual backends to cut frame stalls about 45%, and I ran a local Llama 3.2 on device for plain-language insight.",
    headline: { value: "~33 FPS", label: "on-device on a Raspberry Pi 4" },
    spec: [
      { label: "Device", value: "Raspberry Pi 4 (edge)" },
      { label: "Models", value: "TensorFlow Lite, INT8 quantized" },
      { label: "Throughput", value: "~30 ms/frame (~33 FPS)" },
      { label: "Latency", value: "~45% fewer frame stalls (threaded dual backends)" },
      { label: "Insight", value: "local Llama 3.2, on-device" },
      { label: "Vision", value: "OpenCV" },
    ],
    stack: ["TensorFlow Lite (INT8)", "Llama 3.2", "OpenCV", "Raspberry Pi 4", "Python"],
    image: "/projects/shots/moodscope-live.webp",
    imageLabel: "MoodScope live detection",
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
    what: "I built Visualizzer, a web app that turns live audio into reactive graphics.",
    why: "I did it because music is usually only heard, not seen. A visual that reacts to frequency and amplitude, and picks itself based on the audio, lets people watch the music change instead of watching a fixed animation loop.",
    how: "I built a 44.1 kHz Web Audio ingestion pipeline, 12+ visual styles on a 2-D canvas with GLSL and Three.js, and a quality controller that scales pixel density to hold 60 FPS at 1080p.",
    headline: { value: "12+", label: "audio-reactive styles" },
    spec: [
      { label: "Ingestion", value: "44.1 kHz audio pipeline" },
      { label: "Styles", value: "12+ audio-reactive visualizers" },
      { label: "Canvas", value: "2-D canvas rendering" },
      { label: "Perf", value: "adaptive pixel density, 60 FPS @ 1080p" },
    ],
    stack: ["Web Audio API", "GLSL", "Three.js", "WebGL2", "TypeScript"],
    image: "/projects/shots/visualizzer-sphere-1.jpg",
    imageLabel: "Visualizzer, live render",
    imageKind: "screenshot",
    gallery: [
      { src: "/projects/shots/visualizzer-sphere-1.jpg", label: "Live render" },
      { src: "/projects/shots/visualizzer-sphere-2.jpg", label: "Live render" },
      { src: "/projects/shots/visualizzer-app-ui.jpg", label: "App controls, Liquid Geometry selected" },
      { src: "/projects/shots/visualizzer-fullscreen.jpg", label: "Fullscreen render, from my video" },
    ],
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
    what: "I founded COVID-HELP during India's second COVID wave in 2021, and I led it.",
    why: "I did it because during India's second COVID wave, people could not find a live ICU bed or oxygen supply, and a stale list was useless when hours mattered.",
    how: "I built a Node.js and Firebase backend that aggregated 50+ live sources in real time, I led a 15+ person volunteer team, and the site served 40,000+ users at about 99.9% uptime.",
    headline: { value: "40,000+", label: "users · ~99.9% uptime" },
    spec: [
      { label: "Scale", value: "40,000+ users in production" },
      { label: "Uptime", value: "~99.9% through crisis spikes" },
      { label: "Ingestion", value: "aggregated 50+ live sources" },
      { label: "Team", value: "15+ cross-functional volunteers" },
      { label: "Backend", value: "Node.js, Firebase, real-time" },
    ],
    stack: ["Node.js", "Firebase", "REST APIs", "Real-time"],
    imageLabel: "sources to users",
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
  { group: "FPGA and Embedded", items: ["Rust", "SystemVerilog", "FPGA CAD", "Zephyr", "BLE", "PathFinder", "Static timing analysis", "nRF52840"] },
  { group: "Applied AI", items: ["Python", "PyTorch", "TensorFlow Lite", "RAG", "LLM tool use", "Evals", "Librosa", "NumPy", "Pandas"] },
  { group: "Systems and Web", items: ["C / C++", "TypeScript", "Next.js", "Node.js", "REST APIs", "MySQL", "Three.js / WebGL2"] },
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
