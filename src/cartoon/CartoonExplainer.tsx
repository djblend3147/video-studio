import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import "@fontsource/inter/800.css";
import { Room } from "./Room";
import { Narrator } from "./Narrator";
import { OUT, PosterBody } from "./Poster";
import type { CartoonProps, CartoonScene } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LEAD_IN = 8;
const TAIL = 14;

export const cartoonDuration = (scenes: CartoonScene[]) => scenes.reduce((s, x) => s + x.durationInFrames, 0);

// Each sentence gets screen time proportional to its word count.
const sentenceTimes = (scene: CartoonScene) => {
  const words = scene.narration.map((s) => s.split(" ").length);
  const total = words.reduce((a, b) => a + b, 0);
  const span = scene.durationInFrames - LEAD_IN - TAIL;
  let t = LEAD_IN;
  return scene.narration.map((text, i) => {
    const dur = (span * words[i]) / total;
    const item = { text, start: t, dur };
    t += dur;
    return item;
  });
};

const locate = (scenes: CartoonScene[], frame: number) => {
  let offset = 0;
  for (const s of scenes) {
    if (frame < offset + s.durationInFrames) return { scene: s, local: frame - offset };
    offset += s.durationInFrames;
  }
  return null;
};

// Without a voice track, fake lip movement from the subtitle timing.
const syntheticMouth = (scenes: CartoonScene[], frame: number) => {
  const at = locate(scenes, frame);
  if (!at) return 0;
  const sentence = sentenceTimes(at.scene).find((s) => at.local >= s.start && at.local < s.start + s.dur - 6);
  if (!sentence) return 0;
  const words = sentence.text.split(" ");
  const per = (sentence.dur - 6) / words.length;
  const wi = Math.floor((at.local - sentence.start) / per);
  const within = ((at.local - sentence.start) % per) / per;
  return Math.pow(Math.sin(within * Math.PI), 0.7) * (0.55 + random(`w${wi}${frame >> 3}`) * 0.45);
};

const VoiceNarrator: React.FC<{ voice: string }> = ({ voice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audio = useAudioData(staticFile(voice));
  let level = 0;
  if (audio) {
    const bins = visualizeAudio({ fps, frame, audioData: audio, numberOfSamples: 32 });
    level = Math.min(1, (bins.slice(1, 10).reduce((a, b) => a + b, 0) / 9) * 6);
  }
  return <Narrator mouth={level} talking={level > 0.08} />;
};

const Subtitle: React.FC<{ scene: CartoonScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const s = sentenceTimes(scene).find((x) => frame >= x.start && frame < x.start + x.dur);
  if (!s) return null;
  const words = s.text.split(" ");
  const per = s.dur / words.length;
  const current = Math.floor((frame - s.start) / per);
  const o = interpolate(frame, [s.start, s.start + 4], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 1035, left: 60, right: 60, textAlign: "center", opacity: o }}>
      <span style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 58, lineHeight: 1.25, WebkitTextStroke: "12px #1b120c", paintOrder: "stroke" }}>
        {words.map((w, i) => (
          <span key={i} style={{ color: i === current ? "#ffd23f" : i < current ? "white" : "rgba(255,255,255,0.75)" }}>
            {w}{" "}
          </span>
        ))}
      </span>
    </div>
  );
};

const SceneLayer: React.FC<{ scene: CartoonScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame, fps, config: { damping: 13 } });
  const out = interpolate(frame, [scene.durationInFrames - 8, scene.durationInFrames], [0, 1], clamp);
  return (
    <AbsoluteFill>
      {/* paper poster pinned to the wall; swapped each scene */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 255,
          width: 860,
          height: 740,
          background: "#f4ead3",
          border: `8px solid ${OUT}`,
          boxShadow: "10px 12px 0 rgba(43,29,20,0.35)",
          transform: `translateY(${(1 - drop) * -900 + out * 40}px) rotate(${-1.2 + (1 - drop) * 6}deg)`,
          opacity: 1 - out,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "30px 50px",
          boxSizing: "border-box",
        }}
      >
        {[30, 790].map((x) => (
          <div key={x} style={{ position: "absolute", left: x, top: 14, width: 26, height: 26, borderRadius: 13, background: "#c0392b", border: `5px solid ${OUT}` }} />
        ))}
        <PosterBody content={scene.poster} />
      </div>
      <Subtitle scene={scene} />
    </AbsoluteFill>
  );
};

export const CartoonExplainer: React.FC<CartoonProps> = ({ scenes, music, voice }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const mouth = syntheticMouth(scenes, frame);
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "#2b1d14" }}>
      <Room />
      {scenes.map((scene, i) => {
        const start = from;
        from += scene.durationInFrames;
        return (
          <Sequence key={i} from={start} durationInFrames={scene.durationInFrames}>
            <SceneLayer scene={scene} />
          </Sequence>
        );
      })}
      {voice ? <VoiceNarrator voice={voice} /> : <Narrator mouth={mouth} talking={mouth > 0} />}
      {voice ? <Audio src={staticFile(voice)} /> : null}
      {music ? (
        <Audio
          src={staticFile(music)}
          loop
          volume={(f) => interpolate(f, [0, 20, durationInFrames - 30, durationInFrames], [0, voice ? 0.12 : 0.4, voice ? 0.12 : 0.4, 0], clamp)}
        />
      ) : null}
    </AbsoluteFill>
  );
};
