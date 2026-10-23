import { AbsoluteFill, random, useCurrentFrame } from "remotion";

const OUT = "#2b1d14";
const WALL = "#b0703a";
const WALL_DARK = "#8a5228";
const FLOOR = "#5b3219";

export const LAMP = { x: 540, y: 170 };

export const lampSwing = (frame: number) => Math.sin(frame / 38) * 3;

export const Room: React.FC = () => {
  const frame = useCurrentFrame();
  const swing = lampSwing(frame);
  const flicker = 0.92 + Math.sin(frame * 0.9) * 0.03 + Math.sin(frame * 2.3) * 0.02;

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="lampLight" cx={LAMP.x} cy={LAMP.y + 40} r={900} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffd98a" stopOpacity={0.55 * flicker} />
            <stop offset="45%" stopColor="#ffb85c" stopOpacity={0.18 * flicker} />
            <stop offset="100%" stopColor="#000" stopOpacity={0.35} />
          </radialGradient>
        </defs>
        {/* wall planks */}
        <rect x={0} y={0} width={1080} height={1310} fill={WALL} />
        {new Array(12).fill(0).map((_, i) => (
          <g key={i}>
            <line x1={i * 96 + 20} y1={0} x2={i * 96 + 20} y2={1310} stroke={WALL_DARK} strokeWidth={5} />
            {[0, 1].map((k) => (
              <circle
                key={k}
                cx={i * 96 + 50 + random(`kx${i}${k}`) * 30}
                cy={150 + random(`ky${i}${k}`) * 1050}
                r={7}
                fill={WALL_DARK}
                opacity={0.8}
              />
            ))}
          </g>
        ))}
        {/* door on the left edge */}
        <g>
          <rect x={-40} y={640} width={200} height={670} fill="#6e4222" stroke={OUT} strokeWidth={8} />
          <rect x={-10} y={690} width={130} height={250} fill="#5d371c" stroke={OUT} strokeWidth={6} />
          <rect x={-10} y={980} width={130} height={280} fill="#5d371c" stroke={OUT} strokeWidth={6} />
          <circle cx={140} cy={990} r={13} fill="#e3a83b" stroke={OUT} strokeWidth={4} />
        </g>
        {/* floor */}
        <rect x={0} y={1300} width={1080} height={620} fill={FLOOR} />
        <line x1={0} y1={1306} x2={1080} y2={1306} stroke={OUT} strokeWidth={10} />
        {[-500, -250, 0, 250, 500, 750, 1000, 1250, 1500].map((x, i) => (
          <line key={i} x1={540 + (x - 540) * 0.45} y1={1310} x2={x} y2={1920} stroke="#47260f" strokeWidth={5} />
        ))}
        {/* plant */}
        <g transform={`translate(110 1170)`}>
          {[-28, -12, 4, 20, 34].map((a, i) => (
            <path
              key={i}
              d={`M 0 0 Q ${a * 2} -120 ${a * 4} -230`}
              stroke="#3f7d3a"
              strokeWidth={16}
              strokeLinecap="round"
              fill="none"
              transform={`rotate(${Math.sin(frame / 30 + i) * 2})`}
            />
          ))}
          <path d="M -70 0 L 70 0 L 55 140 L -55 140 Z" fill="#b8392b" stroke={OUT} strokeWidth={7} />
        </g>
        {/* shelf with books + hourglass (waiting) */}
        <g>
          <rect x={720} y={1180} width={340} height={20} fill="#6e4222" stroke={OUT} strokeWidth={6} />
          {["#c0392b", "#2e6fa7", "#e1b23a", "#4f8a43"].map((c, i) => (
            <rect key={i} x={740 + i * 42} y={1060} width={36} height={120} fill={c} stroke={OUT} strokeWidth={5} />
          ))}
          <g transform="translate(960 1110)">
            <path d="M -35 -60 L 35 -60 L 0 0 L 35 60 L -35 60 L 0 0 Z" fill="#f3ead6" stroke={OUT} strokeWidth={6} />
            <path d={`M -18 ${-40 + (frame % 300) / 15} L 18 ${-40 + (frame % 300) / 15} L 0 -6 Z`} fill="#e1b23a" />
            <path d={`M 0 60 L ${-6 - (frame % 300) / 12} 56 L ${6 + (frame % 300) / 12} 56 Z`} fill="#e1b23a" />
            <rect x={-42} y={-70} width={84} height={12} fill="#6e4222" stroke={OUT} strokeWidth={4} />
            <rect x={-42} y={58} width={84} height={12} fill="#6e4222" stroke={OUT} strokeWidth={4} />
          </g>
        </g>
        {/* warm light + vignette */}
        <rect x={0} y={0} width={1080} height={1920} fill="url(#lampLight)" />
        {/* hanging lamp */}
        <g transform={`rotate(${swing} ${LAMP.x} 0)`}>
          <line x1={LAMP.x} y1={0} x2={LAMP.x} y2={LAMP.y - 50} stroke={OUT} strokeWidth={6} />
          <path d={`M ${LAMP.x - 38} ${LAMP.y - 50} L ${LAMP.x + 38} ${LAMP.y - 50} L ${LAMP.x + 50} ${LAMP.y} L ${LAMP.x - 50} ${LAMP.y} Z`} fill="#3a2a20" stroke={OUT} strokeWidth={6} />
          <circle cx={LAMP.x} cy={LAMP.y + 22} r={30} fill="#ffd54f" stroke={OUT} strokeWidth={6} />
          <circle cx={LAMP.x} cy={LAMP.y + 22} r={70} fill="#ffe08a" opacity={0.25 * flicker} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
