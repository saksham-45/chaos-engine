import React from "react";
import type { Flagship } from "@/lib/projects";

/* The visual for a project. A real screenshot when one exists; otherwise a
   drawing of how the system works, built from the project's real numbers.
   Never a mocked-up screenshot. Colour comes from the card's --hue. */

const INK = "var(--color-ink)";
const MUTED = "var(--color-muted)";

function Svg({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label={label}
      className="h-full w-full"
      style={{ color: "var(--hue)", fontFamily: "var(--font-mono)" }}
      fill="none"
    >
      {children}
    </svg>
  );
}

/* SHIELD: a quiet accelerometer trace, one impact, and the 138-of-244-byte
   superframe the ten sensors share. */
function ShieldArt() {
  const sensors = ["ACC", "ACC", "IMU", "IMU", "FSR", "FSR", "HR", "SpO2", "TMP", "TMP"];
  const seg = Math.round(((138 / 244) * 680) / sensors.length); // 138 of 244 bytes, to scale
  let d = "";
  for (let i = 0; i <= 170; i++) {
    const x = 60 + i * 4;
    let y = 150 + Math.sin(i * 0.55) * 5 + Math.sin(i * 0.21) * 4;
    if (i >= 96) y -= 104 * Math.exp(-(i - 96) / 8) * Math.cos((i - 96) * 0.95);
    d += `${i ? "L" : "M"}${x} ${y.toFixed(1)}`;
  }
  return (
    <Svg label="An accelerometer trace with one impact spike above a 244-byte BLE notification, 138 bytes of it filled by ten sensor segments">
      <path d={d} stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" className="art-draw" style={{ "--len": 2200 } as React.CSSProperties} />
      <line x1="444" y1="40" x2="444" y2="250" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="3 6" />
      <text x="456" y="52" fontSize="19" fill="currentColor">impact: sent right away</text>
      <text x="60" y="52" fontSize="19" fill={MUTED}>accelerometer</text>

      <rect x="60" y="296" width="680" height="64" rx="16" stroke={INK} strokeOpacity="0.22" />
      {sensors.map((s, i) => (
        <rect key={i} x={64 + i * seg} y="300" width={seg - 4} height="56" rx={i === 0 ? 12 : 5} fill="currentColor" fillOpacity={0.92 - i * 0.055}>
          <title>{s}</title>
        </rect>
      ))}
      <text x="60" y="398" fontSize="19" fill="currentColor">10 sensors in 138 bytes</text>
      <text x="740" y="398" fontSize="19" textAnchor="end" fill={MUTED}>one 244-byte message</text>
      <text x="60" y="430" fontSize="16" fill={MUTED}>2 accel · 2 IMU · 2 force · HR · SpO2 · 2 temp</text>
    </Svg>
  );
}

/* AICC: the tutor's context is the last ten turns; everything older folds
   into long-term memory and comes back when it is needed. */
function AiccArt() {
  const n = 26;
  const xs = Array.from({ length: n }, (_, i) => Math.round(70 + i * 26.4));
  return (
    <Svg label="A row of conversation turns: the last ten are the tutor's context, older ones flow up into long-term memory, which feeds the newest turn">
      <rect x="230" y="78" width="340" height="76" rx="22" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" />
      <text x="400" y="124" fontSize="22" textAnchor="middle" fill="currentColor" fontWeight="600">long-term memory</text>
      {xs.slice(0, n - 10).map((x, i) => (
        <path key={i} d={`M${x} 352 C${x} 250 ${290 + i * 14} 240 ${290 + i * 14} 154`} stroke="currentColor" strokeOpacity="0.38" strokeWidth="1.2" className="art-flow" />
      ))}
      <path d="M570 116 C700 116 730 220 730 338" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="art-draw" style={{ "--len": 420 } as React.CSSProperties} />
      <path d="M722 326 L730 340 L738 326" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) =>
        i < n - 10 ? (
          <circle key={i} cx={x} cy="360" r="5" fill={INK} fillOpacity="0.28" />
        ) : (
          <circle key={i} cx={x} cy="360" r="7.5" fill="currentColor" />
        ),
      )}
      <path d={`M${xs[n - 10] - 8} 392 v8 H${xs[n - 1] + 8} v-8`} stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.5" />
      <text x={(xs[n - 10] + xs[n - 1]) / 2} y="432" fontSize="19" textAnchor="middle" fill="currentColor">last 10 messages</text>
      <text x="70" y="432" fontSize="19" fill={MUTED}>earlier messages</text>
    </Svg>
  );
}

/* AutoMix: track A hands off to track B across a phrase, bass swapped on
   the downbeat, gains following two generated curves. */
function AutomixArt() {
  const bars = 68;
  const rnd = (i: number) => 0.35 + 0.65 * Math.abs(Math.sin(i * 12.9898) * Math.cos(i * 4.1414));
  const fade = (i: number) => Math.min(1, Math.max(0, (i - 24) / 20)); // 0 before the blend, 1 after
  const ease = (t: number) => t * t * (3 - 2 * t);
  return (
    <Svg label="Two audio waveforms: track A fades out as track B fades in, crossing at a marked downbeat">
      {[60, 220, 400, 580, 740].map((x) => (
        <line key={x} x1={x} y1="60" x2={x} y2="440" stroke={INK} strokeOpacity={x === 400 ? 0 : 0.08} />
      ))}
      <line x1="400" y1="50" x2="400" y2="450" stroke="currentColor" strokeOpacity="0.6" strokeDasharray="3 6" />
      <text x="412" y="64" fontSize="19" fill="currentColor">bass switches here</text>
      <text x="60" y="88" fontSize="19" fill={MUTED}>song A</text>
      <text x="740" y="432" fontSize="19" textAnchor="end" fill="currentColor">song B</text>
      {Array.from({ length: bars }, (_, i) => {
        const x = 62 + i * 10;
        // rounded so server and client print identical attributes
        const a = Math.round(rnd(i) * (1 - 0.9 * ease(fade(i))) * 58);
        const b = Math.round(rnd(i + 91) * (0.1 + 0.9 * ease(fade(i))) * 58);
        return (
          <g key={i}>
            <rect x={x} y={160 - a} width="5.5" height={a * 2} rx="2.75" fill={INK} fillOpacity="0.5" />
            <rect x={x} y={350 - b} width="5.5" height={b * 2} rx="2.75" fill="currentColor" />
          </g>
        );
      })}
      <path d="M60 232 H300 C380 232 420 278 500 278 H740" stroke={INK} strokeOpacity="0.55" strokeWidth="2" className="art-draw" />
      <path d="M60 278 H300 C380 278 420 232 500 232 H740" stroke="currentColor" strokeWidth="2.5" className="art-draw" />
    </Svg>
  );
}

/* myMiami: a phone, the languages it speaks, and the one thing it will not
   do without a source. */
function MiamiArt() {
  const langs = ["Español", "Kreyòl ayisyen", "Português"];
  return (
    <Svg label="A phone showing Spanish, Haitian Creole, and Portuguese among 10 languages, with a verified-source badge">
      {[170, 240, 310].map((r, i) => (
        <circle key={r} cx="400" cy="250" r={r} stroke="currentColor" strokeOpacity={0.3 - i * 0.09} />
      ))}
      <rect x="260" y="14" width="280" height="472" rx="48" fill="var(--color-surface)" stroke={INK} strokeOpacity="0.3" strokeWidth="1.5" />
      <rect x="360" y="32" width="80" height="20" rx="10" fill={INK} fillOpacity="0.16" />
      {langs.map((l, i) => (
        <g key={l}>
          <rect x="284" y={84 + i * 70} width="232" height="56" rx="28" fill={INK} fillOpacity="0.08" />
          <text x="400" y={119 + i * 70} fontSize="21" textAnchor="middle" fill={INK} fontFamily="var(--font-sans)" fontWeight="600">
            {l}
          </text>
        </g>
      ))}
      <text x="400" y="326" fontSize="18" textAnchor="middle" fill={MUTED}>+ 7 more languages</text>
      <rect x="284" y="384" width="232" height="64" rx="24" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M312 416 l9 9 l16 -18" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="350" y="423" fontSize="20" fill="currentColor" fontFamily="var(--font-sans)" fontWeight="600">verified info</text>
    </Svg>
  );
}

/* COVID-HELP: fifty sources in, one live answer out. */
function CovidArt() {
  const rows = ["ICU beds", "Oxygen"];
  return (
    <Svg label="Fifty source dots flow into one live node, which feeds live ICU-bed and oxygen listings">
      {Array.from({ length: 50 }, (_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        return <circle key={i} cx={70 + col * 30} cy={88 + row * 36} r="5.5" fill="currentColor" fillOpacity={0.35 + col * 0.14} />;
      })}
      {Array.from({ length: 10 }, (_, r) => (
        <path key={r} d={`M202 ${88 + r * 36} C290 ${88 + r * 36} 290 250 366 250`} stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" className="art-flow" />
      ))}
      <circle cx="400" cy="250" r="34" fill="currentColor" fillOpacity="0.16" stroke="currentColor" strokeWidth="1.5" />
      <text x="400" y="257" fontSize="19" textAnchor="middle" fill="currentColor" fontWeight="600">live</text>
      <text x="130" y="466" fontSize="19" textAnchor="middle" fill={MUTED}>50+ sources</text>
      {rows.map((r, i) => (
        <g key={r}>
          <path d={`M434 250 C480 250 480 ${196 + i * 108} 524 ${196 + i * 108}`} stroke="currentColor" strokeWidth="2" className="art-draw" style={{ "--len": 160 } as React.CSSProperties} />
          <rect x="524" y={164 + i * 108} width="216" height="64" rx="20" fill={INK} fillOpacity="0.07" stroke={INK} strokeOpacity="0.16" />
          <circle cx="552" cy={196 + i * 108} r="5" fill="currentColor" />
          <text x="570" y={203 + i * 108} fontSize="21" fill={INK} fontFamily="var(--font-sans)" fontWeight="600">
            {r}
          </text>
          <text x="722" y={202 + i * 108} fontSize="16" textAnchor="end" fill="currentColor">live</text>
        </g>
      ))}
    </Svg>
  );
}

/* streammm: one screen goes up once, the edge copies it to every viewer. */
function StreamArt() {
  const viewers = [70, 160, 250, 340, 430];
  return (
    <Svg label="One computer screen sends video to a Cloudflare node, which copies it to five browser windows">
      <rect x="50" y="170" width="200" height="130" rx="14" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.5" />
      <rect x="120" y="300" width="60" height="16" fill="currentColor" fillOpacity="0.5" />
      <rect x="90" y="316" width="120" height="8" rx="4" fill="currentColor" fillOpacity="0.5" />
      <text x="150" y="243" fontSize="19" textAnchor="middle" fill="currentColor" fontWeight="600">my screen</text>
      <path d="M250 235 H352" stroke="currentColor" strokeWidth="2.5" className="art-flow" />
      <circle cx="400" cy="235" r="48" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.5" />
      <text x="400" y="230" fontSize="15" textAnchor="middle" fill="currentColor" fontWeight="600">Cloudflare</text>
      <text x="400" y="250" fontSize="13" textAnchor="middle" fill={MUTED}>one copy in</text>
      {viewers.map((y) => (
        <g key={y}>
          <path d={`M448 235 C520 235 520 ${y + 30} 590 ${y + 30}`} stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" className="art-flow" />
          <rect x="590" y={y} width="150" height="60" rx="10" fill={INK} fillOpacity="0.07" stroke={INK} strokeOpacity="0.2" />
          <circle cx="604" cy={y + 13} r="3" fill={INK} fillOpacity="0.35" />
          <rect x="604" y={y + 26} width="122" height="22" rx="4" fill="currentColor" fillOpacity={0.3} />
        </g>
      ))}
      <text x="150" y="140" fontSize="17" textAnchor="middle" fill={MUTED}>sent once</text>
      <text x="665" y="50" fontSize="17" textAnchor="middle" fill={MUTED}>any number of viewers</text>
    </Svg>
  );
}

/* showonce: one clip becomes five steps; the camera checks you against them. */
function ShowonceArt() {
  return (
    <Svg label="One video turns into five steps, and a camera checks you against the current step every 2.5 seconds">
      <rect x="60" y="70" width="190" height="120" rx="14" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M140 105 L140 155 L182 130 Z" fill="currentColor" />
      <text x="155" y="220" fontSize="17" textAnchor="middle" fill={MUTED}>one expert video</text>
      <path d="M250 130 C330 130 300 330 110 330" stroke="currentColor" strokeWidth="2" className="art-draw" style={{ "--len": 500 } as React.CSSProperties} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          {i > 0 && <line x1={110 + (i - 1) * 145 + 30} y1="330" x2={110 + i * 145 - 30} y2="330" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />}
          <circle cx={110 + i * 145} cy="330" r="30" fill="currentColor" fillOpacity={i === 2 ? 0.9 : 0.14} stroke="currentColor" strokeWidth="1.5" />
          <text x={110 + i * 145} y="337" fontSize="20" textAnchor="middle" fill={i === 2 ? "#000" : "currentColor"} fontWeight="700">
            {i + 1}
          </text>
        </g>
      ))}
      <text x="400" y="408" fontSize="17" textAnchor="middle" fill={MUTED}>the skill, as 5 steps</text>
      <path d="M400 300 V190" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 6" />
      <rect x="500" y="80" width="230" height="100" rx="14" fill={INK} fillOpacity="0.07" stroke={INK} strokeOpacity="0.2" />
      <circle cx="545" cy="130" r="20" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="545" cy="130" r="7" fill="currentColor" />
      <text x="580" y="124" fontSize="17" fill={INK} fontFamily="var(--font-sans)" fontWeight="600">your camera</text>
      <text x="580" y="148" fontSize="15" fill="currentColor">every 2.5 s</text>
      <path d="M500 130 H420 V190" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 6" />
    </Svg>
  );
}

/* perfectable: an app window, the things it flags, and the score. */
function PerfectableArt() {
  const marks = [
    [150, 150, true],
    [150, 215, false],
    [150, 280, true],
    [150, 345, false],
  ] as const;
  return (
    <Svg label="An app window with some parts passing and some flagged, next to a score out of 68 from 17 rules">
      <rect x="60" y="60" width="430" height="380" rx="18" fill={INK} fillOpacity="0.05" stroke={INK} strokeOpacity="0.25" strokeWidth="1.5" />
      <line x1="60" y1="104" x2="490" y2="104" stroke={INK} strokeOpacity="0.2" />
      {[84, 106, 128].map((x) => (
        <circle key={x} cx={x} cy="82" r="6" fill={INK} fillOpacity="0.25" />
      ))}
      {marks.map(([x, y, ok]) => (
        <g key={y}>
          <rect x={x - 60} y={y - 22} width="370" height="44" rx="10" fill={ok ? INK : "currentColor"} fillOpacity={ok ? 0.07 : 0.16} stroke={ok ? "none" : "currentColor"} strokeWidth="1.5" />
          {ok ? (
            <path d={`M${x + 268} ${y} l8 8 l14 -16`} stroke={INK} strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d={`M${x + 270} ${y - 9} l18 18 M${x + 288} ${y - 9} l-18 18`} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          )}
          <rect x={x - 44} y={y - 6} width={ok ? 190 : 140} height="12" rx="6" fill={ok ? INK : "currentColor"} fillOpacity={ok ? 0.2 : 0.6} />
        </g>
      ))}
      <circle cx="640" cy="230" r="86" stroke={INK} strokeOpacity="0.15" strokeWidth="14" />
      <path d="M640 144 A86 86 0 1 1 566 274" stroke="currentColor" strokeWidth="14" strokeLinecap="round" className="art-draw" style={{ "--len": 420 } as React.CSSProperties} />
      <text x="640" y="226" fontSize="20" textAnchor="middle" fill="currentColor" fontWeight="700">scored</text>
      <text x="640" y="252" fontSize="20" textAnchor="middle" fill="currentColor" fontWeight="700">out of 68</text>
      <text x="640" y="368" fontSize="17" textAnchor="middle" fill={MUTED}>17 rules</text>
    </Svg>
  );
}

const ART: Record<string, () => React.ReactElement> = {
  "shield-nrf52840": ShieldArt,
  "aicc-tutor": AiccArt,
  automix: AutomixArt,
  mymiami: MiamiArt,
  "covid-help": CovidArt,
  streammm: StreamArt,
  showonce: ShowonceArt,
  perfectable: PerfectableArt,
};

export function ProjectArt({ p, className = "" }: { p: Flagship; className?: string }) {
  if (p.video) {
    return (
      <video
        src={p.video}
        poster={p.image}
        aria-label={p.imageLabel ?? p.name}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  if (p.image && p.imageCover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={p.image} alt={p.imageLabel ?? p.name} loading="lazy" className={`h-full w-full object-cover ${className}`} />
    );
  }
  if (p.image) {
    // a real screenshot, framed as the window it was taken from
    return (
      <div className={`flex h-full w-full items-end justify-center px-5 pt-5 sm:px-8 ${className}`}>
        <div className="w-full overflow-hidden rounded-t-[14px] border border-b-0 border-line bg-[#0c0c0e] shadow-[0_-18px_60px_-20px_color-mix(in_oklab,var(--hue)_45%,transparent)]">
          <div className="flex h-7 items-center gap-1.5 px-3">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.imageLabel ?? p.name} loading="lazy" className="block w-full" />
        </div>
      </div>
    );
  }
  const Art = ART[p.slug];
  return Art ? (
    <div className={`h-full w-full p-3 sm:p-4 ${className}`}>
      <Art />
    </div>
  ) : null;
}
