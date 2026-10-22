import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_ARABIC, FONT_SANS, FONT_SERIF } from "./fonts";
import type { Scene } from "./types";

const GOLD = "#e8c77a";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useSceneFade = (duration: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, 8, duration - 8, duration], [0, 1, 1, 0], clamp);
};

const useRise = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return { opacity: s, transform: `translateY(${(1 - s) * 40}px)` };
};

const Center: React.FC<{ children: React.ReactNode; opacity: number }> = ({ children, opacity }) => (
  <AbsoluteFill
    style={{ justifyContent: "center", alignItems: "center", padding: "0 90px", opacity, textAlign: "center" }}
  >
    {children}
  </AbsoluteFill>
);

export const HookScene: React.FC<Extract<Scene, { type: "hook" }>> = ({ text, highlight, durationInFrames }) => {
  const opacity = useSceneFade(durationInFrames);
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <Center opacity={opacity}>
      <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 92, lineHeight: 1.2, color: "white" }}>
        {words.map((w, i) => {
          const o = interpolate(frame, [i * 4, i * 4 + 8], [0, 1], clamp);
          const isHi = highlight && w.toLocaleLowerCase("tr").includes(highlight.toLocaleLowerCase("tr"));
          return (
            <span key={i} style={{ opacity: o, color: isHi ? GOLD : "white" }}>
              {w}{" "}
            </span>
          );
        })}
      </div>
    </Center>
  );
};

export const AyahScene: React.FC<Extract<Scene, { type: "ayah" }>> = ({
  arabic,
  meal,
  reference,
  durationInFrames,
}) => {
  const opacity = useSceneFade(durationInFrames);
  const per = Math.floor((durationInFrames - 30) / arabic.length);
  const ref = useRise(10);
  return (
    <Center opacity={opacity}>
      <div style={{ ...ref, fontFamily: FONT_SANS, fontWeight: 600, fontSize: 34, letterSpacing: 6, color: GOLD, marginBottom: 70 }}>
        {reference.toLocaleUpperCase("tr")}
      </div>
      {arabic.map((a, i) => (
        <AyahLine key={i} arabic={a} meal={meal[i]} delay={15 + i * per} />
      ))}
    </Center>
  );
};

const AyahLine: React.FC<{ arabic: string; meal: string; delay: number }> = ({ arabic, meal, delay }) => {
  const ar = useRise(delay);
  const tr = useRise(delay + 25);
  return (
    <div style={{ marginBottom: 70 }}>
      <div dir="rtl" style={{ ...ar, fontFamily: FONT_ARABIC, fontWeight: 700, fontSize: 104, color: "white", lineHeight: 1.6, textShadow: `0 0 40px rgba(232,199,122,0.35)` }}>
        {arabic}
      </div>
      <div style={{ ...tr, fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: 52, color: "#d8e2f0", lineHeight: 1.35, marginTop: 10 }}>
        “{meal}”
      </div>
    </div>
  );
};

export const CompareScene: React.FC<Extract<Scene, { type: "compare" }>> = ({
  title,
  items,
  note,
  durationInFrames,
}) => {
  const opacity = useSceneFade(durationInFrames);
  const head = useRise(0);
  const foot = useRise(20 + items.length * 35);
  return (
    <Center opacity={opacity}>
      <div style={{ ...head, fontFamily: FONT_SANS, fontWeight: 800, fontSize: 80, color: "white", marginBottom: 70 }}>
        {title}
      </div>
      {items.map((it, i) => (
        <CompareCard key={i} {...it} delay={20 + i * 35} />
      ))}
      {note ? (
        <div style={{ ...foot, fontFamily: FONT_SANS, fontSize: 34, color: "#9fb0c8", marginTop: 30, lineHeight: 1.4 }}>
          {note}
        </div>
      ) : null}
    </Center>
  );
};

const CompareCard: React.FC<{ arabic: string; label: string; meaning: string; delay: number }> = ({
  arabic,
  label,
  meaning,
  delay,
}) => {
  const style = useRise(delay);
  return (
    <div
      style={{
        ...style,
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 40,
        padding: "34px 44px",
        marginBottom: 34,
        borderRadius: 32,
        background: "rgba(255,255,255,0.06)",
        border: `2px solid rgba(232,199,122,0.35)`,
        textAlign: "left",
      }}
    >
      <div dir="rtl" style={{ fontFamily: FONT_ARABIC, fontWeight: 700, fontSize: 96, color: GOLD, minWidth: 260, textAlign: "center" }}>
        {arabic}
      </div>
      <div>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 36, color: "#9fb0c8" }}>{label}</div>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 800, fontSize: 52, color: "white", lineHeight: 1.2, marginTop: 6 }}>
          {meaning}
        </div>
      </div>
    </div>
  );
};

export const OutroScene: React.FC<Extract<Scene, { type: "outro" }>> = ({
  text,
  reference,
  cta,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 8, durationInFrames - 4, durationInFrames], [0, 1, 1, 1], clamp);
  const pop = spring({ frame, fps, config: { damping: 12 } });
  const ref = useRise(25);
  const btn = useRise(45);
  return (
    <Center opacity={opacity}>
      <div style={{ fontFamily: FONT_SERIF, fontWeight: 700, fontSize: 100, color: "white", lineHeight: 1.2, transform: `scale(${pop})` }}>
        {text}
      </div>
      <div style={{ ...ref, fontFamily: FONT_SANS, fontWeight: 600, fontSize: 40, color: GOLD, marginTop: 50 }}>
        {reference}
      </div>
      <div
        style={{
          ...btn,
          marginTop: 110,
          padding: "26px 60px",
          borderRadius: 999,
          background: GOLD,
          color: "#0b1a2e",
          fontFamily: FONT_SANS,
          fontWeight: 800,
          fontSize: 46,
        }}
      >
        {cta}
      </div>
    </Center>
  );
};
