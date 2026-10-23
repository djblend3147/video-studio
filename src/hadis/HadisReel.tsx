import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../shorts/fonts";
import { FONT_SANS, FONT_SERIF } from "../shorts/fonts";
import { Cemetery, useBranchProgress } from "./Cemetery";
import type { HadisReelProps, HadisScene } from "./types";

const GOLD = "#f2c14e";
const RED = "#ff5a3c";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const reelDuration = (scenes: HadisScene[]) => scenes.reduce((s, x) => s + x.durationInFrames, 0);

const isHighlighted = (word: string, highlight?: string[]) =>
  highlight?.some((h) => word.toLocaleLowerCase("tr").includes(h.toLocaleLowerCase("tr")));

const useFade = (duration: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, 8, duration - 8, duration], [0, 1, 1, 0], clamp);
};

const useRise = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return { opacity: s, transform: `translateY(${(1 - s) * 40}px)` };
};

const stroke: React.CSSProperties = { WebkitTextStroke: "10px rgba(0,0,0,0.85)", paintOrder: "stroke" };

// Text sits in the upper-middle band: clear of Instagram's top bar, bottom caption and right-side buttons.
const TextZone: React.FC<{ children: React.ReactNode; opacity: number; top?: number }> = ({ children, opacity, top = 380 }) => (
  <AbsoluteFill style={{ top, bottom: "auto", height: 820, padding: "0 110px 0 80px", justifyContent: "center", alignItems: "center", textAlign: "center", opacity }}>
    {children}
  </AbsoluteFill>
);

const Hook: React.FC<Extract<HadisScene, { type: "hook" }>> = ({ lines, highlight, durationInFrames }) => {
  const opacity = useFade(durationInFrames);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <TextZone opacity={opacity}>
      {lines.map((line, i) => {
        const s = spring({ frame: frame - i * 22, fps, config: { damping: 14 } });
        return (
          <div key={i} style={{ ...stroke, fontFamily: FONT_SANS, fontWeight: 800, fontSize: i === 0 ? 104 : 72, lineHeight: 1.15, color: "white", transform: `scale(${s})`, opacity: s, marginBottom: 24 }}>
            {line.split(" ").map((w, j) => (
              <span key={j} style={{ color: isHighlighted(w, highlight) ? RED : "white" }}>{w} </span>
            ))}
          </div>
        );
      })}
    </TextZone>
  );
};

const Story: React.FC<Extract<HadisScene, { type: "story" }>> = ({ text, highlight, durationInFrames }) => {
  const opacity = useFade(durationInFrames);
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const per = (durationInFrames - 25) / words.length;
  const current = Math.floor(frame / per);
  return (
    <TextZone opacity={opacity}>
      <div style={{ ...stroke, fontFamily: FONT_SANS, fontWeight: 800, fontSize: 76, lineHeight: 1.25, color: "white" }}>
        {words.map((w, i) => {
          const shown = i <= current;
          const active = i === current;
          return (
            <span
              key={i}
              style={{
                opacity: shown ? 1 : 0.18,
                color: active ? GOLD : isHighlighted(w, highlight) ? RED : "white",
                display: "inline-block",
                transform: `scale(${active ? 1.08 : 1})`,
                marginRight: 24,
                transformOrigin: "50% 60%",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </TextZone>
  );
};

const Reveal: React.FC<Extract<HadisScene, { type: "reveal" }>> = ({ title, items, durationInFrames }) => {
  const opacity = useFade(durationInFrames);
  const head = useRise(0);
  return (
    <TextZone opacity={opacity}>
      <div style={{ ...head, ...stroke, fontFamily: FONT_SANS, fontWeight: 800, fontSize: 72, color: "white", marginBottom: 50 }}>{title}</div>
      {items.map((it, i) => (
        <RevealCard key={i} index={i + 1} {...it} delay={25 + i * 55} />
      ))}
    </TextZone>
  );
};

const RevealCard: React.FC<{ index: number; label: string; detail: string; delay: number }> = ({ index, label, detail, delay }) => {
  const style = useRise(delay);
  return (
    <div style={{ ...style, width: "100%", display: "flex", alignItems: "center", gap: 34, padding: "30px 40px", marginBottom: 30, borderRadius: 28, background: "rgba(10,8,8,0.72)", border: `3px solid ${RED}`, textAlign: "left" }}>
      <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 90, color: RED, minWidth: 70 }}>{index}</div>
      <div>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 56, color: "white", lineHeight: 1.1 }}>{label}</div>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: 34, color: "#c9cfd8", marginTop: 8, lineHeight: 1.3 }}>{detail}</div>
      </div>
    </div>
  );
};

const Quote: React.FC<Extract<HadisScene, { type: "quote" }>> = ({ text, speaker, durationInFrames }) => {
  const opacity = useFade(durationInFrames);
  const q = useRise(5);
  const sp = useRise(35);
  return (
    <TextZone opacity={opacity}>
      <div style={{ ...q, fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: 70, color: "white", lineHeight: 1.3, textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}>
        <div style={{ color: GOLD, fontSize: 160, lineHeight: 0.6, fontStyle: "normal" }}>“</div>
        {text}
      </div>
      <div style={{ ...sp, fontFamily: FONT_SANS, fontWeight: 600, fontSize: 38, color: GOLD, marginTop: 40 }}>— {speaker}</div>
    </TextZone>
  );
};

const Outro: React.FC<Extract<HadisScene, { type: "outro" }>> = ({ lesson, source, cta, durationInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], clamp);
  const a = useRise(0);
  const b = useRise(30);
  const c = useRise(55);
  return (
    <>
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.55)", opacity: interpolate(frame, [0, 15], [0, 1], clamp) }} />
    <TextZone opacity={opacity}>
      <div style={{ ...a, ...stroke, fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 84, color: "white", lineHeight: 1.2 }}>{lesson}</div>
      <div style={{ ...b, fontFamily: FONT_SANS, fontWeight: 600, fontSize: 34, color: "#c9cfd8", marginTop: 50, lineHeight: 1.4, whiteSpace: "pre-line" }}>{source}</div>
      <div style={{ ...c, marginTop: 70, padding: "24px 56px", borderRadius: 999, background: GOLD, color: "#111", fontFamily: FONT_SANS, fontWeight: 800, fontSize: 44 }}>{cta}</div>
    </TextZone>
    </>
  );
};

const renderScene = (s: HadisScene) => {
  switch (s.type) {
    case "hook": return <Hook {...s} />;
    case "story": return <Story {...s} />;
    case "reveal": return <Reveal {...s} />;
    case "quote": return <Quote {...s} />;
    case "outro": return <Outro {...s} durationInFrames={s.durationInFrames} />;
  }
};

export const HadisReel: React.FC<HadisReelProps> = ({ title, scenes, music, handle }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const starts: number[] = [];
  scenes.reduce((acc, s) => (starts.push(acc), acc + s.durationInFrames), 0);
  const idx = Math.max(0, starts.findLastIndex((st) => st <= frame));
  const active = scenes[idx];
  const focus = "focus" in active ? active.focus : undefined;
  const glow = focus === "left" || focus === "right" || focus === "both" ? focus : focus === "branch" ? "both" : idx === 0 ? "both" : "none";
  const branchStart = starts[scenes.findIndex((s) => "focus" in s && s.focus === "branch")] ?? 1e9;
  const branch = useBranchProgress(branchStart + 10);
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.15]);
  const tag = useRise(5);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Cemetery glow={glow} branch={branch} zoom={zoom} />
      <div style={{ ...tag, position: "absolute", top: 250, width: "100%", textAlign: "center" }}>
        <span style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: "#111", background: GOLD, padding: "12px 28px", borderRadius: 12 }}>
          {title.toLocaleUpperCase("tr")}
        </span>
      </div>
      {scenes.map((s, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={s.durationInFrames}>
          {renderScene(s)}
        </Sequence>
      ))}
      <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${(frame / durationInFrames) * 100}%`, background: RED }} />
      {handle ? (
        <div style={{ position: "absolute", top: 1230, width: "100%", textAlign: "center", fontFamily: FONT_SANS, fontWeight: 600, fontSize: 30, color: "rgba(255,255,255,0.5)" }}>{handle}</div>
      ) : null}
      {music ? (
        <Audio
          src={staticFile(music)}
          volume={(f) => interpolate(f, [0, 20, durationInFrames - 30, durationInFrames], [0, 0.7, 0.7, 0], clamp)}
        />
      ) : null}
    </AbsoluteFill>
  );
};
