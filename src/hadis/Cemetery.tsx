import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Night cemetery drawn in SVG. `branch` 0..1 animates the palm branch being planted.
export const Cemetery: React.FC<{ glow: "none" | "both" | "left" | "right"; branch: number; zoom: number }> = ({
  glow,
  branch,
  zoom,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / 30;
  const flicker = 0.75 + Math.sin(t * 7) * 0.08 + Math.sin(t * 13) * 0.05;
  const glowL = glow === "both" || glow === "left" ? flicker : 0;
  const glowR = glow === "both" || glow === "right" ? flicker : 0;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#04060b 0%, #0b1220 45%, #141a24 70%, #07090d 100%)" }}>
      {/* stars */}
      {new Array(80).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: random(`sx${i}`) * width,
            top: random(`sy${i}`) * height * 0.5,
            width: 2 + random(`ss${i}`) * 2,
            height: 2 + random(`ss${i}`) * 2,
            borderRadius: "50%",
            background: "white",
            opacity: interpolate(Math.sin(t * 1.5 + i), [-1, 1], [0.1, 0.6]),
          }}
        />
      ))}
      {/* moon */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 1060,
          width: 170,
          height: 170,
          borderRadius: "50%",
          background: "#e9e4d2",
          boxShadow: "0 0 120px 30px rgba(233,228,210,0.25)",
          opacity: 0.9,
        }}
      />
      <svg
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoom})`,
          transformOrigin: "50% 78%",
        }}
      >
        <defs>
          <radialGradient id="fire" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6a2a" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#a3200b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a3200b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mist" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#9fb0c8" stopOpacity="0" />
            <stop offset="100%" stopColor="#9fb0c8" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        {/* distant hills + palms */}
        <path d="M0 1270 Q 270 1180 540 1240 T 1080 1210 V 1920 H 0 Z" fill="#0d131c" />
        {[120, 900, 980].map((x, i) => (
          <g key={i} transform={`translate(${x} ${1230 - i * 10})`} fill="#080b10">
            <path d="M-6 0 Q 0 -150 8 -260 L 14 -260 Q 8 -150 10 0 Z" />
            {[-60, -25, 15, 50, 85].map((a, j) => (
              <path key={j} d="M10 -258 q 60 -20 110 30 q -60 -10 -110 -22 Z" transform={`rotate(${a + Math.sin(t + j) * 3} 10 -258)`} />
            ))}
          </g>
        ))}
        {/* ground */}
        <path d="M0 1400 Q 540 1340 1080 1400 V 1920 H 0 Z" fill="#0a0d12" />
        {/* glow under the two graves (punishment) */}
        <ellipse cx={330} cy={1470} rx={260} ry={90} fill="url(#fire)" opacity={glowL} />
        <ellipse cx={750} cy={1470} rx={260} ry={90} fill="url(#fire)" opacity={glowR} />
        {/* two grave mounds with headstones */}
        {[330, 750].map((x, i) => (
          <g key={i}>
            <path d={`M${x - 210} 1500 Q ${x} 1380 ${x + 210} 1500 Z`} fill="#15110e" stroke="#2a221b" strokeWidth={4} />
            <rect x={x - 22} y={1330} width={44} height={120} rx={10} fill="#1c1916" stroke="#2f2a24" strokeWidth={3} />
          </g>
        ))}
        {/* palm branch halves */}
        {[330, 750].map((x, i) => {
          const p = Math.max(0, Math.min(1, branch * 2 - i * 0.6));
          const drop = interpolate(p, [0, 1], [-500, 0]);
          return (
            <g key={`b${i}`} transform={`translate(${x + 40} ${1440 + drop})`} opacity={p > 0 ? 1 : 0}>
              <path d="M0 0 Q -8 -120 6 -230" stroke="#3e8e3a" strokeWidth={8} fill="none" strokeLinecap="round" />
              {new Array(9).fill(0).map((_, j) => {
                const y = -50 - j * 20;
                const side = j % 2 === 0 ? 1 : -1;
                return (
                  <path
                    key={j}
                    d={`M${2 + j * 0.4} ${y} q ${side * 50} ${-12} ${side * 80} ${8}`}
                    stroke="#58b04f"
                    strokeWidth={5}
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          );
        })}
        {/* drifting mist */}
        <rect x={-200 + Math.sin(t / 3) * 60} y={1380} width={1480} height={260} fill="url(#mist)" />
      </svg>
      {/* vignette for text contrast */}
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.75) 100%)" }}
      />
    </AbsoluteFill>
  );
};

export const useBranchProgress = (start: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping: 18 }, durationInFrames: 50 });
};
