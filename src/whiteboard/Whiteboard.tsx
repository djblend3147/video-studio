import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getLength, getPointAtLength } from "@remotion/paths";
import "@fontsource/caveat/500.css";
import "@fontsource/caveat/700.css";
import { Pencil } from "./Pencil";
import { GAP, PAN_IN, PAN_OUT, TimedElement, isDrawingAt, sceneTimeline, whiteboardDuration } from "./timeline";
import type { WbElement, WbScene, WhiteboardProps } from "./types";

export { whiteboardDuration };

const FONT = "Caveat";
const INK = "#262626";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type TextEl = Extract<WbElement, { kind: "text" }>;
const fontOf = (el: TextEl) => `${el.weight ?? 700} ${el.size ?? 72}px "${FONT}"`;
const lineHeight = (el: TextEl) => (el.size ?? 72) * 1.12;

// Measure every text line once the handwriting font is loaded.
const useTextWidths = (scene: WbScene) => {
  const [widths, setWidths] = useState<Record<string, number> | null>(null);
  const [handle] = useState(() => delayRender("Measuring handwriting"));
  useEffect(() => {
    const texts = scene.elements.filter((e): e is TextEl => e.kind === "text");
    Promise.all(texts.map((t) => document.fonts.load(fontOf(t), "ğüşıİöç"))).then(() => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      const out: Record<string, number> = {};
      for (const t of texts) {
        ctx.font = fontOf(t);
        for (const line of t.lines) out[`${fontOf(t)}|${line}`] = ctx.measureText(line).width;
      }
      setWidths(out);
      continueRender(handle);
    });
  }, [scene, handle]);
  return widths;
};

type LineLayout = { text: string; left: number; y: number; width: number; from: number; to: number };

const layoutText = (el: TextEl, widths: Record<string, number>): LineLayout[] => {
  const total = el.lines.join("").length || 1;
  let acc = 0;
  return el.lines.map((text, i) => {
    const width = widths[`${fontOf(el)}|${text}`] ?? 0;
    const left = (el.anchor ?? "middle") === "middle" ? el.x - width / 2 : el.x;
    const from = acc / total;
    acc += text.length;
    return { text, left, y: el.y + i * lineHeight(el), width, from, to: acc / total };
  });
};

const tipOf = (it: TimedElement, p: number, widths: Record<string, number>, frame: number) => {
  const el = it.el;
  if (el.kind === "path") {
    const len = getLength(el.d);
    return getPointAtLength(el.d, Math.max(0.01, len * p));
  }
  if (el.kind === "highlight") return { x: el.x1 + (el.x2 - el.x1) * p, y: el.y };
  if (el.kind === "text") {
    const lines = layoutText(el, widths);
    const line = lines.find((l) => p <= l.to) ?? lines[lines.length - 1];
    const lp = (p - line.from) / Math.max(0.0001, line.to - line.from);
    const size = el.size ?? 72;
    return { x: line.left + line.width * lp, y: line.y - size * 0.3 + Math.sin(frame * 1.7) * size * 0.18 };
  }
  return null;
};

const ElementView: React.FC<{ it: TimedElement; frame: number; widths: Record<string, number>; id: string }> = ({
  it,
  frame,
  widths,
  id,
}) => {
  const p = interpolate(frame, [it.start, it.start + it.dur], [0, 1], clamp);
  if (p <= 0) return null;
  const el = it.el;
  if (el.kind === "path") {
    const len = getLength(el.d);
    return (
      <path
        d={el.d}
        fill={p >= 1 && el.fill ? el.fill : "none"}
        stroke={el.color ?? INK}
        strokeWidth={el.width ?? 7}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
        filter="url(#sketch)"
      />
    );
  }
  if (el.kind === "highlight") {
    return (
      <line
        x1={el.x1}
        x2={el.x1 + (el.x2 - el.x1) * p}
        y1={el.y}
        y2={el.y}
        stroke={el.color ?? "#ffe14d"}
        strokeWidth={el.height ?? 60}
        strokeLinecap="round"
        opacity={0.75}
        style={{ mixBlendMode: "multiply" }}
      />
    );
  }
  if (el.kind === "text") {
    const lines = layoutText(el, widths);
    const size = el.size ?? 72;
    return (
      <g>
        {lines.map((l, i) => {
          const lp = interpolate(p, [l.from, l.to], [0, 1], clamp);
          if (lp <= 0) return null;
          const clipId = `${id}-l${i}`;
          return (
            <g key={i}>
              <clipPath id={clipId}>
                <rect x={l.left - 20} y={l.y - size * 1.1} width={lp >= 1 ? l.width + 200 : l.width * lp + 20} height={size * 1.6} />
              </clipPath>
              <text
                x={l.left}
                y={l.y}
                fontFamily={FONT}
                fontWeight={el.weight ?? 700}
                fontSize={size}
                fill={el.color ?? INK}
                clipPath={`url(#${clipId})`}
              >
                {l.text}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
  return null;
};

const SceneView: React.FC<{ scene: WbScene; index: number }> = ({ scene, index }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const widths = useTextWidths(scene);
  const { items, drawEnd, duration } = sceneTimeline(scene);
  if (!widths) return null;

  // camera pans along the paper between scenes
  const panX =
    interpolate(frame, [0, PAN_IN], [width, 0], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) }) +
    interpolate(frame, [duration - PAN_OUT, duration], [0, -width], { ...clamp, easing: (t) => t * t });

  // pencil position: on the active stroke, gliding between strokes, parked off-paper otherwise
  const drawable = items.filter((it) => it.el.kind !== "wait");
  const park = { x: 1150, y: 1750 };
  let pen = park;
  let penOpacity = 1;
  const active = drawable.find((it) => frame >= it.start && frame < it.start + it.dur);
  if (active) {
    pen = tipOf(active, (frame - active.start) / active.dur, widths, frame) ?? park;
  } else {
    const prev = [...drawable].reverse().find((it) => frame >= it.start + it.dur);
    const next = drawable.find((it) => frame < it.start);
    const a = prev ? tipOf(prev, 1, widths, frame)! : park;
    const b = next ? tipOf(next, 0, widths, frame)! : park;
    const from = prev ? prev.start + prev.dur : 0;
    const to = next ? next.start : drawEnd + 20;
    const t = interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], { ...clamp, easing: (x) => x * x * (3 - 2 * x) });
    pen = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t - Math.sin(t * Math.PI) * 60 };
    if (!next) penOpacity = interpolate(frame, [from, to], [1, 0], clamp);
  }

  return (
    <AbsoluteFill style={{ transform: `translateX(${panX}px)` }}>
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="sketch">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={index + 3} />
            <feDisplacementMap in="SourceGraphic" scale={4} />
          </filter>
        </defs>
        {items.map((it, i) => (
          <ElementView key={i} it={it} frame={frame} widths={widths} id={`s${index}e${i}`} />
        ))}
        <Pencil x={pen.x} y={pen.y} opacity={penOpacity} />
      </svg>
    </AbsoluteFill>
  );
};

const Paper: React.FC = () => (
  <AbsoluteFill style={{ background: "#fbfaf6" }}>
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.09 }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={7} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 60%, rgba(120,100,70,0.16) 100%)" }} />
  </AbsoluteFill>
);

export const Whiteboard: React.FC<WhiteboardProps> = ({ scenes, music, scratch }) => {
  const { durationInFrames } = useVideoConfig();
  let from = 0;
  return (
    <AbsoluteFill>
      <Paper />
      {scenes.map((scene, i) => {
        const start = from;
        const { duration } = sceneTimeline(scene);
        from += duration;
        return (
          <Sequence key={i} from={start} durationInFrames={duration}>
            <SceneView scene={scene} index={i} />
          </Sequence>
        );
      })}
      {music ? (
        <Audio
          src={staticFile(music)}
          loop
          volume={(f) => interpolate(f, [0, 20, durationInFrames - 30, durationInFrames], [0, 0.35, 0.35, 0], clamp)}
        />
      ) : null}
      {scratch ? (
        <Audio src={staticFile(scratch)} loop volume={(f) => (isDrawingAt(scenes, f) ? 0.55 : 0)} />
      ) : null}
    </AbsoluteFill>
  );
};

export { GAP };
