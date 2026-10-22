import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { FONT_SANS } from "./fonts";
import { Background } from "./Background";
import { AyahScene, CompareScene, HookScene, OutroScene } from "./Scenes";
import type { Scene, ShortProps } from "./types";

export const shortDuration = (scenes: Scene[]) =>
  scenes.reduce((sum, s) => sum + s.durationInFrames, 0);

const renderScene = (scene: Scene) => {
  switch (scene.type) {
    case "hook":
      return <HookScene {...scene} />;
    case "ayah":
      return <AyahScene {...scene} />;
    case "compare":
      return <CompareScene {...scene} />;
    case "outro":
      return <OutroScene {...scene} />;
  }
};

export const DiniShort: React.FC<ShortProps> = ({ scenes, music, handle }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  let from = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050b14" }}>
      <Background />
      {scenes.map((scene, i) => {
        const start = from;
        from += scene.durationInFrames;
        return (
          <Sequence key={i} from={start} durationInFrames={scene.durationInFrames}>
            {renderScene(scene)}
          </Sequence>
        );
      })}
      {/* progress bar keeps viewers watching to the end */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 10,
          width: `${(frame / durationInFrames) * 100}%`,
          background: "#e8c77a",
        }}
      />
      {handle ? (
        <div
          style={{
            position: "absolute",
            bottom: 140,
            width: "100%",
            textAlign: "center",
            fontFamily: FONT_SANS,
            fontWeight: 600,
            fontSize: 30,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {handle}
        </div>
      ) : null}
      {music ? (
        <Audio
          src={staticFile(music)}
          volume={(f) =>
            interpolate(f, [0, 20, durationInFrames - 30, durationInFrames], [0, 0.6, 0.6, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
    </AbsoluteFill>
  );
};
