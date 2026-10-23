import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import "@fontsource/rubik/500.css";
import "@fontsource/rubik/800.css";
import "@fontsource/caveat/700.css";
import "@fontsource/amiri/700.css";
import type { PosterContent } from "./types";

export const OUT = "#2b1d14";
export const RED = "#b8322a";
const HEAD = "Rubik";
const HAND = "Caveat";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useIn = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  return { opacity: Math.min(1, s * 1.5), transform: `scale(${0.85 + s * 0.15})` };
};

const Title: React.FC<Extract<PosterContent, { kind: "title" }>> = ({ top, big, hand }) => {
  const a = useIn(4);
  const b = useIn(14);
  const c = useIn(30);
  return (
    <>
      {top ? <div style={{ ...a, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: OUT }}>{top}</div> : null}
      <div style={{ ...b, fontFamily: HEAD, fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: RED, margin: "20px 0" }}>
        {big.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      {hand ? <div style={{ ...c, fontFamily: HAND, fontWeight: 700, fontSize: 66, color: OUT }}>{hand}</div> : null}
    </>
  );
};

const Seas: React.FC<Extract<PosterContent, { kind: "seas" }>> = ({ word, meaning, reference }) => {
  const frame = useCurrentFrame();
  const a = useIn(2);
  const b = useIn(14);
  const wall = interpolate(frame, [30, 55], [0, 1], clamp);
  const wave = (offset: number) =>
    new Array(7)
      .fill(0)
      .map((_, i) => `M 0 ${40 + i * 34} q 30 ${-14 + Math.sin(frame / 10 + i + offset) * 4} 60 0 t 60 0 t 60 0 t 60 0 t 60 0`)
      .join(" ");
  return (
    <>
      <div style={{ ...a, fontFamily: HEAD, fontWeight: 800, fontSize: 130, color: RED, lineHeight: 1 }}>{word}</div>
      <div style={{ ...b, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: OUT, marginBottom: 20 }}>{meaning}</div>
      <svg viewBox="0 0 640 280" style={{ width: 640, ...useIn(24) }}>
        <clipPath id="seaL"><rect x={0} y={0} width={316} height={280} rx={20} /></clipPath>
        <clipPath id="seaR"><rect x={324} y={0} width={316} height={280} rx={20} /></clipPath>
        <g clipPath="url(#seaL)">
          <rect width={320} height={280} fill="#2f6aa3" />
          <path d={wave(0)} stroke="#8fc1ec" strokeWidth={5} fill="none" />
        </g>
        <g clipPath="url(#seaR)">
          <rect x={320} width={320} height={280} fill="#2f9b8f" />
          <path d={wave(2)} stroke="#a5e6d9" strokeWidth={5} fill="none" transform="translate(320 0)" />
        </g>
        <rect x={314} y={280 * (1 - wall)} width={12} height={280 * wall} fill="#fff7d6" />
        <rect x={304} y={280 * (1 - wall)} width={32} height={280 * wall} fill="#fff7d6" opacity={0.35} />
        <rect x={2} y={2} width={636} height={276} rx={20} fill="none" stroke={OUT} strokeWidth={7} />
      </svg>
      <div style={{ ...useIn(40), fontFamily: HEAD, fontWeight: 500, fontSize: 40, color: OUT, marginTop: 18 }}>{reference}</div>
    </>
  );
};

const Timeline: React.FC<Extract<PosterContent, { kind: "timeline" }>> = ({ stations, active, note }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gap = 150;
  const top = 40;
  const travel = spring({ frame: frame - 40, fps, config: { damping: 30 }, durationInFrames: 50 });
  const dotY = top + gap * active * travel;
  const icons = ["🌍", "🚪", "📯", "⚖️"];
  return (
    <>
      <div style={{ position: "relative", width: 640, height: top * 2 + gap * (stations.length - 1) }}>
        <div style={{ position: "absolute", left: 96, top, width: 10, height: gap * (stations.length - 1), background: OUT, borderRadius: 5 }} />
        {stations.map((s, i) => {
          const st = { opacity: interpolate(frame, [i * 8, i * 8 + 10], [0, 1], clamp) };
          const isActive = i === active && travel > 0.95;
          return (
            <div key={s} style={{ ...st, position: "absolute", left: 0, top: top + i * gap - 45, display: "flex", alignItems: "center", gap: 34 }}>
              <div style={{ width: 90, height: 90, borderRadius: 45, background: isActive ? "#ffd54f" : "#f3ead6", border: `7px solid ${OUT}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, marginLeft: 56 }}>
                {icons[i] ?? "•"}
              </div>
              <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: isActive ? 84 : 64, color: isActive ? RED : OUT }}>{s}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 82, top: dotY - 19, width: 38, height: 38, borderRadius: 19, background: "#fff7d6", boxShadow: "0 0 30px 12px rgba(255,230,150,0.9)" }} />
      </div>
      {note ? <div style={{ ...useIn(95), fontFamily: HAND, fontWeight: 700, fontSize: 60, color: OUT, marginTop: 10 }}>{note}</div> : null}
    </>
  );
};

const Ayah: React.FC<Extract<PosterContent, { kind: "ayah" }>> = ({ reference, arabic, meal }) => {
  const a = useIn(2);
  const b = useIn(14);
  const c = useIn(30);
  return (
    <>
      <div style={{ ...a, fontFamily: HEAD, fontWeight: 800, fontSize: 46, letterSpacing: 3, color: RED }}>{reference}</div>
      {arabic ? (
        <div dir="rtl" style={{ ...b, fontFamily: "Amiri", fontWeight: 700, fontSize: 60, color: OUT, lineHeight: 1.7, whiteSpace: "nowrap", margin: "16px 0" }}>{arabic}</div>
      ) : null}
      <div style={{ ...c, fontFamily: HEAD, fontWeight: 500, fontSize: 48, color: OUT, lineHeight: 1.35 }}>“{meal}”</div>
    </>
  );
};

const Panel: React.FC<{ dark: boolean; label: string; reference: string; text: string; delay: number }> = ({ dark, label, reference, text, delay }) => {
  const frame = useCurrentFrame();
  const st = useIn(delay);
  return (
    <div style={{ ...st, flex: 1, borderRadius: 24, border: `7px solid ${OUT}`, overflow: "hidden", background: dark ? "#2a1a1a" : "#fff3c4" }}>
      <svg viewBox="0 30 300 150" style={{ width: "100%", display: "block", borderBottom: `7px solid ${OUT}` }}>
        {dark ? (
          <>
            <rect width={300} height={200} fill="#1d1212" />
            {[40, 100, 160, 220, 270].map((x, i) => (
              <path key={i} d={`M ${x - 30} 200 Q ${x - 20} ${120 + Math.sin(frame / 5 + i) * 15} ${x} ${80 + Math.sin(frame / 4 + i) * 20} Q ${x + 20} ${130} ${x + 30} 200 Z`} fill={i % 2 ? "#e2572b" : "#f5a623"} opacity={0.9} />
            ))}
          </>
        ) : (
          <>
            <rect width={300} height={200} fill="#9fd6f2" />
            <circle cx={230} cy={60} r={32 + Math.sin(frame / 12) * 3} fill="#ffd54f" />
            <path d="M 0 150 Q 80 100 160 140 T 300 120 V 200 H 0 Z" fill="#6bb35a" />
            <path d="M 0 175 Q 120 140 300 170 V 200 H 0 Z" fill="#4f9a46" />
          </>
        )}
      </svg>
      <div style={{ padding: "10px 16px 16px" }}>
        <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 46, color: dark ? "#ff8a5c" : RED }}>{label}</div>
        <div style={{ fontFamily: HEAD, fontWeight: 500, fontSize: 30, color: dark ? "#e8d6c9" : OUT, marginBottom: 8 }}>{reference}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, lineHeight: 1.1, color: dark ? "#fff3e8" : OUT }}>“{text}”</div>
      </div>
    </div>
  );
};

const Split: React.FC<Extract<PosterContent, { kind: "split" }>> = ({ title, left, right }) => {
  const a = useIn(2);
  return (
    <>
      <div style={{ ...a, fontFamily: HEAD, fontWeight: 800, fontSize: 70, color: RED, lineHeight: 1, marginBottom: 24, whiteSpace: "nowrap" }}>{title}</div>
      <div style={{ display: "flex", gap: 24, width: "100%" }}>
        <Panel dark={false} {...left} delay={40} />
        <Panel dark {...right} delay={215} />
      </div>
    </>
  );
};

export const PosterBody: React.FC<{ content: PosterContent }> = ({ content }) => {
  switch (content.kind) {
    case "title": return <Title {...content} />;
    case "seas": return <Seas {...content} />;
    case "timeline": return <Timeline {...content} />;
    case "ayah": return <Ayah {...content} />;
    case "split": return <Split {...content} />;
  }
};
