import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import type { PosterContent } from "../types";
import { AyahScene, BedroomScene, CardScene, DoorsScene, HourglassScene, RoomScene, SeasScene, VeilScene } from "./Scenes";
import { clamp } from "./common";

type Door = { label: string; reference: string; text: string; at: number };

export type StoryScene = { duration: number; subtitle: string[] } & (
  | { kind: "room"; poster: PosterContent }
  | { kind: "bedroom"; time: string }
  | { kind: "card"; title: string; sub?: string }
  | { kind: "seas"; reference: string }
  | { kind: "veil" }
  | { kind: "ayah"; reference: string; arabic: string; meal: string }
  | { kind: "hourglass"; note: string }
  | { kind: "doors"; left: Door; right: Door }
);

export type StoryProps = { scenes: StoryScene[]; music?: string; voice?: string };

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

export const StoryVideo: React.FC<StoryProps> = ({ scenes, music, voice }) => {
  const { durationInFrames } = useVideoConfig();
  let from = 0;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {scenes.map((s, i) => {
        const start = from;
        from += s.duration;
        return (
          <Sequence key={i} from={start} durationInFrames={s.duration}>
            {render(s)}
          </Sequence>
        );
      })}
      {voice ? <Audio src={staticFile(voice)} /> : null}
      {music ? (
        <Audio src={staticFile(music)} loop volume={(f) => interpolate(f, [0, 20, durationInFrames - 30, durationInFrames], [0, voice ? 0.12 : 0.4, voice ? 0.12 : 0.4, 0], clamp)} />
      ) : null}
    </AbsoluteFill>
  );
};
