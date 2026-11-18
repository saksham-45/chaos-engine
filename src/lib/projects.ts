/* Projects. Single source of copy for home, /projects, and /projects/[slug].
   Voice: explain it like the reader is 22: smart, not a specialist. Normal
   sentences in first person, real terms where a sharp reader knows them,
   no baby-talk definitions, no taglines, no frameworks. `tagline` is the one sentence shown on cards and under the
   title; what / why / how are the three short paragraphs on the project’s
   page. `spec` holds the technical detail for people who want it.
   Every number is a real measurement: do not round up or add unsourced ones.
   Projects without a public screenshot get a drawing of how the system works
   (components/site/ProjectArt.tsx), never a mocked-up screenshot. */

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
  hue: string;
  what: string;
  why?: string; // left out when the project's own docs do not say
  how: string;
  headline: { value: string; label: string };
  spec: SpecRow[];
  stack: string[];
  image?: string;
  imageLabel?: string;
  gallery?: { src: string; label: string }[];
  imageKind?: "screenshot" | "diagram";
  /** full-bleed image instead of a framed window (for art that is the product) */
  imageCover?: boolean;
  /** muted looping clip shown instead of the image; `image` is its poster */
  video?: string;
  /** gallery holds landscape screenshots (shown uncropped) rather than phone-shaped ones */
  galleryWide?: boolean;
  /** a scroll-driven walkthrough of how it works, one stage per entry (drawn by FlowScene) */
  flow?: { title: string; text: string }[];
  /** the things about this project most worth knowing, in plain words */
  highlights?: { title: string; text: string }[];
  /** measured comparisons against another tool; lower is better */
  compare?: { note: string; rows: { label: string; mine: number; other: number; unit: string; otherName: string }[] };
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
    period: "Aug 2026 - Present",
    discipline: "FPGA",
    tagline: "An open-source FPGA toolchain I’m writing from scratch in Rust.",
    hue: "#ff9f0a",
    what: "Helion takes hardware code written in SystemVerilog, VHDL, or C and turns it into a bitstream you can flash onto an FPGA. Think of it as my own open-source take on Vivado, written in Rust, with no vendor tools anywhere in the flow.",
    why: "Vivado and Quartus, the tools everyone uses, don’t run on a Mac at all, and I couldn’t find a complete FPGA suite that runs natively on Apple Silicon. So I’m building one. I also wanted a tool that gives the same output every time, tells you exactly why something failed, and lets you verify what it did.",
    how: "I wrote every stage myself: synthesis, packing, placement, routing, timing analysis, and bitstream generation. On top of that there’s a simulator, a JTAG engine for talking to real boards, and a full IDE. CI checks on every push that the output is still identical run to run.",
    headline: { value: "8.9×", label: "faster than Yosys at synthesizing a PicoRV32 processor" },
    spec: [
      { label: "Input", value: "SystemVerilog, VHDL-2008 subset, C" },
      { label: "Flow", value: "synthesis, pack, place, route, timing, bitstream" },
      { label: "Chips", value: "HL10, Lattice iCE40, Lattice ECP5, Xilinx 7-series" },
      { label: "Checking", value: "SAT equivalence, CDC analysis, event simulator, SVA subset" },
      { label: "Debug", value: "FTDI JTAG engine, ILA, VIO, JTAG-to-AXI" },
      { label: "Timing gold", value: "WNS_PS=9640 on the counter example, checked in CI" },
      { label: "Interface", value: "CLI, Tcl, IDE" },
      { label: "Release", value: "4.0.0, November 2026, AGPL-3.0" },
      { label: "Size", value: "360,000+ lines of Rust in 30 crates, 1,900+ tests, 1,200+ commits" },
    ],
    stack: ["Rust", "SystemVerilog", "VHDL", "PathFinder", "STA", "Tcl"],
    image: "/projects/shots/helion-ide-summary.webp",
    imageLabel: "The Helion IDE after building a counter design",
    imageKind: "screenshot",
    demo: "https://helion-fpga.github.io/helion/",
    demoLabel: "Helion site",
    repo: "https://github.com/helion-fpga/helion",
    highlights: [
      { title: "No vendor tools", text: "Every stage is my own Rust code. No vendor binaries, libraries, or device databases." },
      { title: "Four chip families", text: "It targets Lattice iCE40, Lattice ECP5, Xilinx 7-series, and HL10, an FPGA architecture I designed myself that only exists in software for now." },
      { title: "Byte-identical output", text: "A blinky design for Xilinx 7-series comes out byte-for-byte identical to the open prjxray reference. I haven’t flashed it onto a real board yet." },
      { title: "Its own JTAG engine", text: "I wrote a JTAG engine for FTDI cables that scans the chain on a real ZedBoard at up to 30 MHz." },
      { title: "It checks its own work", text: "It ships with a simulator, SAT-based equivalence checking, and clock-domain-crossing analysis that catches eleven kinds of bugs." },
      { title: "A full IDE", text: "Flow navigator, device view, schematic view, timing reports, a waveform viewer, and a real Tcl console, all in one app." },
    ],
    compare: {
      note: "These are my own published runs. Synthesis compares Helion 3.0.0 with Yosys 0.33; the full-flow runs compare Helion 2.0.5 with Yosys 0.69 plus nextpnr-ecp5. In the full-flow runs Yosys used 2 to 5 times fewer LUTs and the two flows target different chips, so read this as a speed comparison, not a quality one.",
      rows: [
        { label: "Synthesis, PicoRV32 processor", mine: 1.02, other: 9.12, unit: "s", otherName: "Yosys" },
        { label: "Full flow, PicoRV32 processor", mine: 3.5, other: 10.4, unit: "s", otherName: "Yosys + nextpnr" },
        { label: "Full flow, AES-128", mine: 1.9, other: 332, unit: "s", otherName: "Yosys + nextpnr" },
      ],
    },
    flow: [
      { title: "Synthesis", text: "Turns your SystemVerilog or VHDL into a netlist of small logic cells." },
      { title: "Packing", text: "Groups those cells into logic blocks, eight to a block." },
      { title: "Placement", text: "Picks a physical spot on the chip for every block." },
      { title: "Routing", text: "Wires the blocks together through the chip’s routing fabric, using the PathFinder algorithm." },
      { title: "Timing", text: "Finds the slowest path and checks that every signal still arrives before the next clock edge." },
      { title: "Bitstream", text: "Writes out the configuration bits that actually program the chip." },
    ],
    galleryWide: true,
    gallery: [
      { src: "/projects/shots/helion-ide-device.webp", label: "Device view: a RISC-V core placed on the HL10 chip" },
      { src: "/projects/shots/helion-ide-schematic.webp", label: "Schematic view of the same design" },
      { src: "/projects/shots/helion-ide-timing.webp", label: "Timing report" },
    ],
  },
  {
    no: "02",
    slug: "shield-nrf52840",
    name: "SHIELD injury sensor",
    tag: "Embedded · Zephyr",
    role: "Undergraduate Research Assistant, USF SHIELD Lab",
    period: "Aug 2026 - Present",
    discipline: "Embedded",
    tagline: "Firmware for a sensor that lives inside a mouthguard and tracks impacts.",
    hue: "#30d158",
    what: "I write the firmware for a tiny sensor board that fits inside a mouthguard. It reads 10 sensors and streams the data to a phone over Bluetooth. This is my work in USF’s SHIELD Lab with Dr. Templeton.",
    why: "A mouthguard only has room for a tiny battery, and Bluetooth bandwidth is tight. Sending each reading on its own would waste 89% of every packet on overhead. But when a hard hit happens, that data can’t sit in a queue.",
    how: "I wrote drivers for all 10 sensors (accelerometers, IMUs, bite-force sensors, heart rate, blood oxygen, and temperature) and pack their readings into a single Bluetooth packet, with impact data always going out first. It lasts about 21 hours on a 40 mAh battery.",
    headline: { value: "~21 h", label: "of battery life on a 40 mAh battery" },
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
    tagline: "I built long-term memory for the AI tutor USF students use.",
    hue: "#2997ff",
    what: "I work on USF’s AI tutor in the AICC Lab with Dr. Topsakal. I built its long-term memory and shipped a Gemini-powered mind-map feature to more than 20,000 students.",
    why: "The tutor could only remember the last 10 messages, so it couldn’t build on anything a student had asked earlier.",
    how: "I prototyped two approaches to memory, saving notes and searching past chats, and compared them on cost and accuracy. I also cut Gemini wait times by 40% with server-side batching and MySQL caching.",
    headline: { value: "20,000+", label: "USF students have the tutor" },
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
  },
  {
    no: "04",
    slug: "automix",
    name: "AutoMix",
    tag: "AI · Music",
    role: "Solo build",
    period: "2025",
    discipline: "Music",
    tagline: "An AI that blends songs together the way a real DJ would.",
    hue: "#bf5af2",
    what: "Give AutoMix a playlist and it turns it into one continuous, gapless mix, the way a DJ would play it.",
    why: "Most auto-mix tools just crossfade. A real DJ matches tempo, lines up the beats, and swaps the bass at the right moment. I wanted mine to do all of that.",
    how: "It finds each song’s beats down to the millisecond and time-stretches both tracks onto one tempo without changing their key. It also splits songs into drums, bass, vocals, and everything else, so it can lay one song’s vocals over another’s instrumental. An earlier version used two neural networks I trained to pick transitions and draw the volume curves.",
    headline: { value: "18", label: "kinds of transitions it can choose from" },
    spec: [
      { label: "Transitions", value: "18 techniques: beat-matched, cuts, and fades" },
      { label: "Beat grid", value: "3 ms onset envelope, drift corrected every 32 beats" },
      { label: "Tempo", value: "key-locked WSOLA onto one master tempo" },
      { label: "Loudness", value: "−14 LUFS, measured per BS.1770" },
      { label: "Stems", value: "Demucs, 4 stems" },
      { label: "Keys", value: "Krumhansl profiles, Camelot wheel" },
      { label: "Earlier models", value: "DecisionNN + CurveLSTM, 100+ audio features per song" },
    ],
    stack: ["PyTorch", "LSTM", "scikit-learn", "Librosa", "Demucs", "NumPy", "Pandas"],
    imageLabel: "A frame from a music video AutoMix rendered for one of its mixes",
    imageKind: "screenshot",
    demo: "https://huggingface.co/spaces/saksss/automix",
    demoLabel: "Live demo",
    repo: "https://github.com/saksham-45/automix",
    image: "/projects/shots/automix-chrome-morph.jpg",
    video: "/projects/shots/automix-chrome-morph.mp4",
    imageCover: true,
    highlights: [
      { title: "Millisecond timing", text: "A 0.1% tempo error becomes a 30 ms flam after 16 bars, so it re-corrects the beat grid every 32 beats." },
      { title: "Mixing across stems", text: "Each song is split into drums, bass, vocals, and the rest, so it can mix across them, like one song’s vocals over another’s beat." },
      { title: "Same key, same loudness", text: "Both tracks are stretched to one tempo with the key locked, and everything is leveled to −14 LUFS." },
      { title: "It makes its own videos", text: "Every mix gets a music video, rendered frame by frame with my Visualizzer engine." },
    ],
  },
  {
    no: "09",
    slug: "streammm",
    name: "streammm",
    tag: "Systems · Rust",
    role: "Solo build",
    period: "2026",
    discipline: "Systems",
    tagline: "Streams my screen to any browser with about half a second of delay, remote control included.",
    hue: "#38bdf8",
    what: "streammm streams my screen to anyone’s browser with about half a second of delay. People I trust can also control my computer from their browser, and so can an AI.",
    why: "Normal tunnels buffer video until the connection closes, so nothing ever shows up live. I wanted every chunk of video sent the moment it’s encoded, to as many viewers as I want.",
    how: "A Rust program encodes my screen to H.264 and pushes it over a WebSocket. A Cloudflare Worker takes that single upload and fans it out to every viewer, who joins with a 6-digit PIN. Remote control is the same path in reverse: the browser sends mouse and keyboard events back.",
    headline: { value: "~0.45 s", label: "behind live in the viewer’s browser" },
    spec: [
      { label: "Video", value: "30 fps H.264, fragmented MP4 over WebSocket" },
      { label: "Bitrate", value: "20 Mbps by default, up to 50 Mbps" },
      { label: "Fan-out", value: "Cloudflare Worker and Durable Object" },
      { label: "Access", value: "6-digit PIN, good for about 5 minutes" },
      { label: "Control", value: "remote and AI control, both off by default" },
      { label: "Tested", value: "16 viewers on a 1080p 30 fps stream" },
    ],
    stack: ["Rust", "ffmpeg", "WebSocket", "Cloudflare Workers", "Durable Objects"],
    imageLabel: "streammm, how it works",
    imageKind: "diagram",
    highlights: [
      { title: "One upload, many viewers", text: "My machine sends the stream once and Cloudflare copies it to everyone watching, so more viewers don’t slow my computer down." },
      { title: "An AI can drive it", text: "It can send a screenshot to a vision model and carry out whatever actions the model returns. It’s off unless I turn it on." },
      { title: "It moves files too", text: "Trusted viewers can send files up to 2 GB and share the clipboard." },
    ],
    repo: "https://github.com/saksham-45/streammm",
  },
  {
    no: "10",
    slug: "showonce",
    name: "showonce",
    tag: "Applied AI · Vision",
    role: "Meta Global AI Developer Hackathon 2026",
    period: "2026",
    discipline: "Applied AI",
    tagline: "An AI coach that learns a physical skill from a single video.",
    hue: "#a78bfa",
    what: "showonce watches one video of an expert doing something physical, learns the steps, and then coaches you through it live using your camera. I built it for the Meta Global AI Developer Hackathon 2026.",
    how: "It pulls frames and audio from the video, segments the important objects, and breaks the skill into 5 steps, each with a reference image. While you practice, it compares a frame from your camera with the current step every 2.5 seconds and tells you out loud what to fix. So far I’ve tested the full pipeline with stand-in models.",
    headline: { value: "2.5 s", label: "between each check of what you are doing" },
    spec: [
      { label: "Learning", value: "upload, frames and audio, segmentation, skill graph, reference images" },
      { label: "Steps", value: "5 per skill, one reference image each" },
      { label: "Coach", value: "judges one camera frame every 2.5 seconds" },
      { label: "Models", value: "SAM 3.1, Muse Spark, Muse Voice, Muse Image" },
      { label: "App", value: "Next.js, plus an Electron app for macOS and Windows" },
    ],
    stack: ["TypeScript", "Next.js", "Electron", "ffmpeg"],
    imageLabel: "showonce, how it works",
    imageKind: "diagram",
    highlights: [
      { title: "One video is enough", text: "It only needs one clip of someone doing the skill well and figures out the steps from there." },
      { title: "It talks you through it", text: "Corrections are spoken out loud, so your hands and eyes stay on the task." },
      { title: "Runs without API keys", text: "Every model has a stand-in, so you can run the whole app without any API keys." },
    ],
    repo: "https://github.com/saksham-45/showonce",
  },
  {
    no: "11",
    slug: "perfectable",
    name: "perfectable",
    tag: "Developer tool",
    role: "Solo build",
    period: "2026",
    discipline: "Systems",
    tagline: "A design review for desktop apps that AI coding agents built.",
    hue: "#f472b6",
    what: "perfectable reviews desktop apps written by AI coding agents and flags what looks or behaves wrong. It runs as a CLI and as a skill the agents can call themselves.",
    why: "Ask an AI for a desktop app and you often get a website in a window. Ask it to review its own UI and it grades itself way too generously.",
    how: "It detects which toolkit the app uses (Electron, SwiftUI, egui, Qt, GTK, WinUI, or Flutter) and can inspect the live window through the OS accessibility APIs. Then two separate agents critique it against 17 rules and score it out of 68.",
    headline: { value: "17", label: "rules every app is scored against" },
    spec: [
      { label: "Toolkits", value: "Electron, SwiftUI, egui, Qt, GTK, WinUI, Flutter" },
      { label: "Live check", value: "macOS Accessibility, Windows UI Automation, Linux AT-SPI" },
      { label: "Critique", value: "17 heuristics, scored out of 68" },
      { label: "Works with", value: "Claude, Cursor, Codex, Gemini, Copilot, OpenCode" },
      { label: "Runtime", value: "Node 18 or newer" },
    ],
    stack: ["JavaScript", "Node.js", "Accessibility APIs", "SARIF"],
    imageLabel: "perfectable, how it works",
    imageKind: "diagram",
    highlights: [
      { title: "It looks at the real window", text: "It inspects the running app the way a screen reader does, so it checks what’s actually on screen, not just the code." },
      { title: "Two reviewers, one score", text: "Two agents critique the app independently before it gets a score out of 68, which makes the result harder to game." },
      { title: "It plugs into the agent", text: "After an agent edits the UI, perfectable feeds its findings straight back so the agent can fix them." },
    ],
    repo: "https://github.com/saksham-45/perfectable",
  },
  {
    no: "05",
    slug: "mymiami",
    name: "myMiami",
    tag: "iOS · Civic",
    role: "ShellHacks 2026",
    period: "2026",
    discipline: "Systems",
    tagline: "An iPhone app that helps families new to Miami, in their own language.",
    hue: "#ff375f",
    what: "myMiami helps families who just moved to Miami find city services, understand their rights, and know what to do in an emergency. I built it at ShellHacks 2026.",
    why: "In a lot of Miami families, one kid ends up translating everything for their parents. I wanted an app that tells the whole family what to do next, in their own language, from sources they can trust.",
    how: "It’s a native SwiftUI app. It takes voice commands in 10 languages, works with Siri, talks back, and can figure out a problem from a photo. It only answers from verified information, and when it doesn’t know something it says so instead of guessing.",
    headline: { value: "10", label: "languages it understands" },
    spec: [
      { label: "Platform", value: "native iOS 18, SwiftUI, Swift 6" },
      { label: "Languages", value: "10 for voice; English, Spanish, and Haitian Creole fully translated" },
      { label: "Guides", value: "88 civic guides" },
      { label: "Siri", value: "5 App Intents" },
      { label: "AI", value: "Gemini for intent and photos, ElevenLabs voice" },
      { label: "Safety", value: "every figure must come from a sourced fact" },
    ],
    stack: ["Swift", "SwiftUI", "Gemini", "ElevenLabs", "Siri App Intents"],
    imageLabel: "The app’s opening screen",
    imageKind: "screenshot",
    repo: "https://github.com/saksham-45/shellhacks-2026",
    image: "/projects/shots/mymiami-opening.webp",
    imageCover: true,
    demo: "https://www.youtube.com/watch?v=g7litrk7xSA",
    demoLabel: "Demo video",
    highlights: [
      { title: "It checks its facts", text: "Every phone number and fee it shows has to come from a list of sourced facts. If it’s not on the list, the app won’t say it." },
      { title: "It asks when it isn’t sure", text: "When it’s confident it acts, when it’s partly sure it asks one question, and when it has no idea it sends you to a real person." },
      { title: "88 guides", text: "88 step-by-step guides for city services, each one written for a specific situation." },
      { title: "Voice first", text: "You can talk to it in 10 languages, and basic voice commands work offline." },
    ],
  },
  {
    no: "06",
    slug: "moodscope",
    name: "MoodScope",
    tag: "On-device ML",
    role: "Health Hacks @ USF 2025",
    period: "2025",
    discipline: "ML",
    tagline: "Real-time emotion detection that runs entirely on a Raspberry Pi.",
    hue: "#ffd60a",
    what: "MoodScope reads emotions from your face in real time and runs entirely on a Raspberry Pi 4. I built it at Health Hacks @ USF 2025.",
    why: "I wanted people to be able to track their mood without streaming video of their face to some server.",
    how: "I quantized the models so they run at about 33 FPS on the Pi, and a small language model on the device explains the results in plain English.",
    headline: { value: "~33 FPS", label: "on a Raspberry Pi 4, with nothing sent to a server" },
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
    highlights: [
      { title: "Seven emotions", text: "It distinguishes angry, disgust, fear, happy, sad, surprise, and neutral." },
      { title: "Nothing leaves the device", text: "Camera, vision model, and language model all run locally. No video gets uploaded anywhere." },
      { title: "It flags rough stretches", text: "If sad, angry, or afraid shows up in 8 of the last 10 minutes, it raises an alert." },
      { title: "Works for groups", text: "With several people in frame, it reports the group’s dominant emotion and how engaged everyone looks." },
    ],
    galleryWide: true,
    gallery: [
      { src: "/projects/shots/moodscope-live.webp", label: "Live detection with the confidence chart" },
      { src: "/projects/shots/moodscope-report.webp", label: "The analysis report it writes afterwards" },
    ],
  },
  {
    no: "07",
    slug: "visualizzer",
    name: "Visualizzer",
    tag: "Real-time graphics",
    role: "Solo build",
    period: "2026",
    discipline: "Graphics",
    tagline: "A web app that turns whatever’s playing into live visuals.",
    hue: "#64d2ff",
    what: "Visualizzer turns music into real-time visuals right in the browser.",
    why: "Most visualizers just loop the same animation. I wanted one that actually reacts to the music as it plays.",
    how: "It listens through the mic or to system audio, splits the sound into five frequency bands, and drives the visuals from those. There are 20 modes plus an auto mode that picks one to fit the song, and if the frame rate drops it lowers its own quality to stay smooth.",
    headline: { value: "20", label: "visual modes, plus an auto mode" },
    spec: [
      { label: "Modes", value: "20, plus Auto: 6 GPU shaders, 1 particle, 4 Three.js, 9 classic" },
      { label: "Audio", value: "44.1 kHz, 2048-sample FFT, five energy bands" },
      { label: "Particles", value: "60,000 in the GPU particle mode" },
      { label: "Quality", value: "targets 60 FPS, steps down below 30 FPS" },
      { label: "Input", value: "microphone or system audio" },
    ],
    stack: ["Web Audio API", "GLSL", "Three.js", "WebGL2", "TypeScript"],
    image: "/projects/shots/visualizzer-liquid-metal.jpg",
    imageLabel: "A frame of Visualizzer’s liquid metal mode reacting to a song",
    imageCover: true,
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
    video: "/projects/shots/visualizzer-liquid-metal.mp4",
    highlights: [
      { title: "60,000 particles", text: "One mode moves 60,000 particles on the GPU in sync with the music." },
      { title: "Five frequency bands", text: "Sound is split into sub-bass, bass, mids, high mids, and treble, and it tracks the average, the peak, and sudden hits in each." },
      { title: "It picks for you", text: "Auto mode chooses a visual that fits what’s playing and switches every few seconds." },
      { title: "It powers AutoMix’s videos", text: "The same engine renders the music videos for my AutoMix mixes, frame by frame." },
    ],
  },
  {
    no: "08",
    slug: "covid-help",
    name: "COVID-HELP",
    tag: "Systems at scale",
    role: "Founder & Lead Developer",
    period: "2021",
    discipline: "Systems",
    tagline: "A site that tracked live ICU beds and oxygen during India’s 2021 COVID wave.",
    hue: "#ff453a",
    what: "During India’s second COVID wave in 2021, COVID-HELP showed people where ICU beds and oxygen were actually available. I started it and led the team.",
    why: "People were desperately searching for hospital beds and oxygen, and an outdated list was useless when hours mattered.",
    how: "I built the backend on Node.js and Firebase, pulling live data from more than 50 sources. I led a team of 15+ volunteers, and more than 40,000 people used the site.",
    headline: { value: "40,000+", label: "people used the site" },
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
  image?: string;
  repo?: string; // omitted when the repository is private
  demo?: string;
}

export const SELECTED: Selected[] = [
  {
    name: "Resume Site Builder",
    blurb:
      "An AI pipeline that designs a personal website, reviews it, and fixes what’s broken before it goes live. It’s a 16-step LangGraph workflow, tested with Playwright across 8 templates.",
    tags: ["Next.js", "LangGraph", "Playwright"],
    image: "/projects/shots/resume-builder.webp",
    demo: "https://createadigitalresume.com/",
  },
  {
    name: "LMMS AgentControl",
    blurb:
      "A plugin for LMMS, the open-source music program, that lets an AI model drive it: add tracks, write notes, tweak the mixer. Every change can be undone with a snapshot, and it takes voice commands too.",
    tags: ["C++", "MCP", "Python", "Voice"],
  },
  {
    name: "isomercount",
    blurb:
      "Math research from USF. I found an exact formula for a counting problem, plus a second sequence that isn’t in the OEIS. My code gets an answer with 903,084 digits in about 36 ms; brute force takes over 11 seconds on a tiny case.",
    tags: ["Combinatorics", "Research", "Python"],
    repo: "https://github.com/saksham-45/isomercount",
  },
  {
    name: "humane",
    blurb:
      "A daily game: read two short texts on the same topic and guess which one a human wrote. It runs on Cloudflare Workers, and all you need to play is a username.",
    tags: ["TypeScript", "Cloudflare Workers", "D1"],
    image: "/projects/shots/humane.webp",
    repo: "https://github.com/saksham-45/humane",
    demo: "https://humane.sakshamiscool3434.workers.dev/",
  },
  {
    name: "Mathon",
    blurb:
      "A small programming language for math, with its own compiler that turns code into fast native code through LLVM. It can take derivatives two different ways.",
    tags: ["Compilers", "LLVM", "Python"],
    repo: "https://github.com/saksham-45/Mathon",
  },
  {
    name: "introvertensemble",
    blurb:
      "I trained an RL agent to find the best seat in a library full of introverts. On 16 layouts it had never seen, it scored 47.9, close to a hand-written strategy (49.2) and way above random (−17.9).",
    tags: ["Reinforcement learning", "PPO", "Python"],
    repo: "https://github.com/saksham-45/introvertensemble",
  },
  {
    name: "TikTok MCP server",
    blurb:
      "An MCP server that lets an AI assistant use TikTok’s official APIs to post videos, save drafts, and read profiles. Everything stays a draft until I confirm it.",
    tags: ["TypeScript", "MCP"],
    repo: "https://github.com/saksham-45/tiktok-mcp-server",
  },
];

/* Home-page numbers. Each one is checkable: the Yosys figure is Helion's
   published benchmark (1.02 s vs 9.12 s), the line count is the repo's Rust
   outside third_party, the other two are from the resume. */
export const STATS: { value: string; unit?: string; label: string }[] = [
  { value: "8.9", unit: "×", label: "faster than Yosys at synthesizing a PicoRV32 CPU, using my own toolchain" },
  { value: "360,000", unit: "+", label: "lines of Rust in Helion, backed by 1,900+ tests" },
  { value: "40,000", unit: "+", label: "people used COVID-HELP, a site I started in 2021" },
  { value: "20,000", unit: "+", label: "USF students have access to the AI tutor I work on" },
];

export const STACK: { group: string; items: string[] }[] = [
  { group: "Hardware and firmware", items: ["Rust", "SystemVerilog", "FPGA CAD", "Zephyr", "BLE", "PathFinder", "Static timing analysis", "nRF52840"] },
  { group: "AI and data", items: ["Python", "PyTorch", "TensorFlow Lite", "RAG", "LLM tool use", "Evals", "Librosa", "NumPy", "Pandas"] },
  { group: "Software and web", items: ["C / C++", "TypeScript", "Next.js", "Node.js", "REST APIs", "MySQL", "Three.js / WebGL2"] },
];

export const PROFILE = {
  name: "Saksham Srivastava",
  role: "Computer Engineering · FPGA / Applied AI",
  thesis: "I’m a computer engineering student at USF who builds software that sits close to the hardware.",
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
