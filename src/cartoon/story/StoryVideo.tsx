import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import type { PosterContent } from "../types";
import { AyahScene, BedroomScene, CardScene, DoorsScene, HourglassScene, RoomScene, SeasScene, VeilScene } from "./Scenes";
import { SceneVoice, SceneVoiceContext, VOICE_LEAD, clamp } from "./common";

type Door = { label: string; reference: string; text: string; at: number };

export type StoryScene = { duration: number; subtitle: string[]; voice?: SceneVoice } & (
  | { kind: "room"; poster: PosterContent }
  | { kind: "bedroom"; time: string }
  | { kind: "card"; title: string; sub?: string }
  | { kind: "seas"; reference: string }
  | { kind: "veil" }
  | { kind: "ayah"; reference: string; arabic: string; meal: string }
  | { kind: "hourglass"; note: string }
  | { kind: "doors"; left: Door; right: Door }
);

export type StoryProps = { scenes: StoryScene[]; music?: string; voiced?: boolean };

export const storyDuration = (scenes: StoryScene[]) => scenes.reduce((s, x) => s + x.duration, 0);

const render = (s: StoryScene) => {
  switch (s.kind) {
    case "room": return <RoomScene {...s} />;
    case "bedroom": return <BedroomScene {...s} />;
    case "card": return <CardScene {...s} />;
    case "seas": return <SeasScene {...s} />;
    case "veil": return <VeilScene {...s} />;
    case "ayah": return <AyahScene {...s} />;
    case "hourglass": return <HourglassScene {...s} />;
    case "doors": return <DoorsScene {...s} />;
  }
};

export const StoryVideo: React.FC<StoryProps> = ({ scenes, music, voiced }) => {
  const { durationInFrames } = useVideoConfig();
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {scenes.map((s, i) => {
        const start = from;
        from += s.duration;
        return (
          <Sequence key={i} from={start} durationInFrames={s.duration}>
            <SceneVoiceContext.Provider value={s.voice ?? null}>
              {render(s)}
              {s.voice ? (
                <Sequence from={VOICE_LEAD}>
                  <Audio src={staticFile(s.voice.file)} />
                </Sequence>
              ) : null}
            </SceneVoiceContext.Provider>
          </Sequence>
        );
      })}
            {music ? (
        <Audio src={staticFile(music)} loop volume={(f) => interpolate(f, [0, 20, durationInFrames - 30, durationInFrames], [0, voiced ? 0.13 : 0.4, voiced ? 0.13 : 0.4, 0], clamp)} />
      ) : null}
    </AbsoluteFill>
  );
};

// Fit each scene to its recorded voice (lead-in + speech + tail), never shorter than `min`.
export const withVoice = (scenes: StoryScene[], voices: SceneVoice[], fps = 30, min = 75): StoryScene[] =>
  scenes.map((s, i) => {
    const v = voices[i];
    if (!v) return s;
    const duration = Math.max(min, Math.ceil(VOICE_LEAD + v.duration * fps + 22));
    return { ...s, voice: v, duration };
  });
