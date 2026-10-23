import { useCurrentFrame } from "remotion";

const OUT = "#2b1d14";
const SKIN = "#f1c29b";
const HAIR = "#5a3820";
const BEARD = "#6d4527";

// Bearded narrator bust. `mouth` 0 (closed) .. 1 (wide open).
export const Narrator: React.FC<{ mouth: number; talking: boolean }> = ({ mouth, talking }) => {
  const frame = useCurrentFrame();
  const blink = frame % 110 < 5 ? 0.1 : 1;
  const bob = Math.sin(frame / 14) * (talking ? 6 : 2);
  const tilt = Math.sin(frame / 45) * (talking ? 2.5 : 1);
  const brow = talking ? Math.sin(frame / 9) * 4 : 0;
  const cx = 790;
  const cy = 1560;

  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {/* body */}
      <g transform={`translate(0 ${bob * 0.4})`}>
        <path d={`M ${cx - 330} 1960 Q ${cx - 320} 1760 ${cx - 120} 1730 L ${cx + 120} 1730 Q ${cx + 320} 1760 ${cx + 340} 1960 Z`} fill="#efe1c4" stroke={OUT} strokeWidth={8} />
        <path d={`M ${cx - 60} 1700 L ${cx + 60} 1700 L ${cx + 60} 1760 Q ${cx} 1790 ${cx - 60} 1760 Z`} fill={SKIN} stroke={OUT} strokeWidth={7} />
        <path d={`M ${cx - 110} 1740 L ${cx} 1800 L ${cx - 50} 1850 Z`} fill="#f7ecd6" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
        <path d={`M ${cx + 110} 1740 L ${cx} 1800 L ${cx + 50} 1850 Z`} fill="#f7ecd6" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
        {[1840, 1900].map((y) => (
          <circle key={y} cx={cx} cy={y} r={8} fill="#f7ecd6" stroke={OUT} strokeWidth={4} />
        ))}
      </g>
      {/* head */}
      <g transform={`translate(0 ${bob}) rotate(${tilt} ${cx} ${cy + 120})`}>
        <ellipse cx={cx - 148} cy={cy + 10} rx={28} ry={42} fill={SKIN} stroke={OUT} strokeWidth={7} />
        <ellipse cx={cx + 148} cy={cy + 10} rx={28} ry={42} fill={SKIN} stroke={OUT} strokeWidth={7} />
        <ellipse cx={cx} cy={cy} rx={150} ry={175} fill={SKIN} stroke={OUT} strokeWidth={8} />
        {/* beard */}
        <path
          d={`M ${cx - 150} ${cy - 10} Q ${cx - 150} ${cy + 190} ${cx} ${cy + 200} Q ${cx + 150} ${cy + 190} ${cx + 150} ${cy - 10} Q ${cx + 120} ${cy + 60} ${cx + 60} ${cy + 70} Q ${cx} ${cy + 40} ${cx - 60} ${cy + 70} Q ${cx - 120} ${cy + 60} ${cx - 150} ${cy - 10} Z`}
          fill={BEARD}
          stroke={OUT}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        {/* hair */}
        <path
          d={`M ${cx - 152} ${cy - 30} Q ${cx - 170} ${cy - 200} ${cx} ${cy - 190} Q ${cx + 170} ${cy - 200} ${cx + 152} ${cy - 30} Q ${cx + 140} ${cy - 110} ${cx + 60} ${cy - 120} Q ${cx - 60} ${cy - 140} ${cx - 152} ${cy - 30} Z`}
          fill={HAIR}
          stroke={OUT}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        {/* brows */}
        <path d={`M ${cx - 95} ${cy - 75 - brow} q 40 -22 75 -2`} stroke={OUT} strokeWidth={12} strokeLinecap="round" fill="none" />
        <path d={`M ${cx + 20} ${cy - 77 - brow} q 40 -20 75 2`} stroke={OUT} strokeWidth={12} strokeLinecap="round" fill="none" />
        {/* eyes */}
        {[-57, 57].map((dx) => (
          <g key={dx} transform={`translate(${cx + dx} ${cy - 25}) scale(1 ${blink})`}>
            <ellipse rx={34} ry={38} fill="white" stroke={OUT} strokeWidth={7} />
            <circle cx={4} cy={4} r={15} fill={OUT} />
            <circle cx={9} cy={-2} r={5} fill="white" />
          </g>
        ))}
        {/* nose */}
        <path d={`M ${cx - 4} ${cy - 5} q -26 55 4 62 q 18 2 26 -10`} stroke={OUT} strokeWidth={7} fill="none" strokeLinecap="round" />
        {/* mouth */}
        <ellipse cx={cx} cy={cy + 115} rx={42 + mouth * 6} ry={8 + mouth * 32} fill="#7a1f1f" stroke={OUT} strokeWidth={7} />
        {mouth > 0.25 ? <rect x={cx - 28} y={cy + 115 - (8 + mouth * 32) + 4} width={56} height={10} rx={4} fill="white" /> : null}
        {/* mustache */}
        <path d={`M ${cx - 75} ${cy + 100} Q ${cx - 40} ${cy + 62} ${cx} ${cy + 88} Q ${cx + 40} ${cy + 62} ${cx + 75} ${cy + 100} Q ${cx + 40} ${cy + 86} ${cx} ${cy + 100} Q ${cx - 40} ${cy + 86} ${cx - 75} ${cy + 100} Z`} fill={BEARD} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
      </g>
    </svg>
  );
};
