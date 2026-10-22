import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const HelloWorld: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const hue = interpolate(frame, [0, durationInFrames], [220, 300]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, hsl(${hue},70%,20%), hsl(${hue + 40},70%,40%))`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        color: "white",
        opacity: fadeOut,
      }}
    >
      <div style={{ fontSize: 140, fontWeight: 800, transform: `scale(${scale})` }}>
        {title}
      </div>
      <div style={{ fontSize: 60, opacity: subtitleOpacity, marginTop: 20 }}>
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};
