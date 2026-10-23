import { createContext, useContext } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import "@fontsource/inter/600.css";
import "@fontsource/rubik/800.css";
import "@fontsource/caveat/700.css";

export const OUT = "#1f1712";
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const LEAD_IN = 10;
export const TAIL = 14;

export type SceneVoice = { file: string; duration: number; sentences: [number, number][] };
export const VOICE_LEAD = 12;
export const VOICE_TAIL = 22;
export const SceneVoiceContext = createContext<SceneVoice | null>(null);

// Sentence timings: from the recorded voice when present, otherwise estimated.
export const useSentenceTimes = (sentences: string[], duration: number) => {
  const voice = useContext(SceneVoiceContext);
  const { fps } = useVideoConfig();
  if (voice && voice.sentences.length === sentences.length) {
    return sentences.map((text, i) => {
      const [a, b] = voice.sentences[i];
      const next = voice.sentences[i + 1];
      const end = next ? next[0] : b + 0.25;
      return { text, start: VOICE_LEAD + a * fps, dur: (end - a) * fps };
    });
  }
  return sentenceTimes(sentences, duration);
};

// Each sentence gets screen time proportional to its word count.
export const sentenceTimes = (sentences: string[], duration: number) => {
  const words = sentences.map((s) => s.split(" ").length);
  const total = words.reduce((a, b) => a + b, 0) || 1;
  const span = duration - LEAD_IN - TAIL;
  let t = LEAD_IN;
  return sentences.map((text, i) => {
    const dur = (span * words[i]) / total;
    const item = { text, start: t, dur };
    t += dur;
    return item;
  });
};

// Small dark pill subtitle, like the reference video.
export const Subtitle: React.FC<{ sentences: string[]; duration: number; y?: number }> = ({ sentences, duration, y = 1430 }) => {
  const frame = useCurrentFrame();
  const s = useSentenceTimes(sentences, duration).find((x) => frame >= x.start && frame < x.start + x.dur);
  if (!s) return null;
  const o = interpolate(frame, [s.start, s.start + 4, s.start + s.dur - 2, s.start + s.dur], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: y, left: 70, right: 70, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ background: "rgba(18,16,20,0.74)", borderRadius: 18, padding: "16px 30px", fontFamily: "Inter", fontWeight: 600, fontSize: 44, lineHeight: 1.3, color: "white", textAlign: "center" }}>
        {s.text}
      </div>
    </div>
  );
};

// Slow push-in + fade from/to black, applied to every full-screen scene.
export const Camera: React.FC<{ duration: number; children: React.ReactNode; zoomTo?: number; origin?: string }> = ({ duration, children, zoomTo = 1.07, origin = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1, zoomTo]);
  const fade = interpolate(frame, [0, 10, duration - 10, duration], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: origin, opacity: fade }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TimeTag: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const [h, m] = text.split(".");
  return (
    <div style={{ position: "absolute", top: 300, left: 80, background: "#efe4c8", border: `5px solid ${OUT}`, borderRadius: 10, padding: "6px 20px", fontFamily: "Rubik", fontWeight: 800, fontSize: 46, color: OUT }}>
      {h}
      <span style={{ opacity: Math.floor(frame / 15) % 2 ? 0.2 : 1 }}>.</span>
      {m}
    </div>
  );
};

export const RefTag: React.FC<{ text: string; y?: number }> = ({ text, y = 1300 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [20, 32], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ background: "#efe4c8", border: `5px solid ${OUT}`, borderRadius: 12, padding: "6px 22px", fontFamily: "Rubik", fontWeight: 800, fontSize: 36, color: "#a8322a" }}>{text}</div>
    </div>
  );
};

// Simple figure like the reference: round pale head, dot eyes.
export const Figure: React.FC<{ x: number; y: number; scale?: number; walk?: number; opacity?: number }> = ({ x, y, scale = 1, walk = 0, opacity = 1 }) => {
  const step = Math.sin(walk) * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <path d={`M -12 60 L ${-14 + step} 130`} stroke={OUT} strokeWidth={12} strokeLinecap="round" />
      <path d={`M 12 60 L ${14 - step} 130`} stroke={OUT} strokeWidth={12} strokeLinecap="round" />
      <rect x={-34} y={-10} width={68} height={86} rx={22} fill="#5d6a7a" stroke={OUT} strokeWidth={6} />
      <circle cx={0} cy={-42} r={38} fill="#f3ead6" stroke={OUT} strokeWidth={6} />
      <circle cx={-12} cy={-44} r={4.5} fill={OUT} />
      <circle cx={12} cy={-44} r={4.5} fill={OUT} />
    </g>
  );
};
