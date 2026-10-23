import { useCurrentFrame } from "remotion";

const OUT = "#2b1d14";

// Cartoon look of the narrator (drawn from the channel owner's photo).
export const LOOK = {
  skin: "#e6b088",
  skinShade: "#d39a72",
  hair: "#7b5233",
  hairLight: "#a8774c",
  beard: "#4b3020",
  brow: "#3a2516",
  iris: "#6e4b2a",
  lips: "#b9675b",
  shirt: "#f8f6f1",
  shirtShade: "#e3ded3",
};

// Narrator bust. `mouth` 0 (closed) .. 1 (wide open).
export const Narrator: React.FC<{ mouth: number; talking: boolean }> = ({ mouth, talking }) => {
  const frame = useCurrentFrame();
  const blink = frame % 110 < 5 ? 0.1 : 1;
  const bob = Math.sin(frame / 14) * (talking ? 6 : 2);
  const tilt = Math.sin(frame / 45) * (talking ? 2.5 : 1);
  const brow = talking ? Math.sin(frame / 9) * 4 : 0;
  const L = LOOK;
  const cx = 790;
  const cy = 1560;
  const mouthRy = 6 + mouth * 26;

  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {/* neck */}
      <rect x={cx - 62} y={cy + 120} width={124} height={130} fill={LOOK.skin} stroke={OUT} strokeWidth={7} transform={`translate(0 ${bob * 0.7})`} />
      {/* body: white shirt, open collar */}
      <g transform={`translate(0 ${bob * 0.4})`}>
        <path d={`M ${cx - 340} 1960 Q ${cx - 330} 1770 ${cx - 120} 1735 L ${cx + 120} 1735 Q ${cx + 330} 1770 ${cx + 350} 1960 Z`} fill={L.shirt} stroke={OUT} strokeWidth={8} />
        <path d={`M ${cx - 55} 1690 L ${cx + 55} 1690 L ${cx + 60} 1745 L ${cx} 1840 L ${cx - 60} 1745 Z`} fill={L.skin} stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
        <path d={`M ${cx - 30} 1760 Q ${cx} 1800 ${cx + 30} 1760`} stroke={L.skinShade} strokeWidth={6} fill="none" />
        <path d={`M ${cx - 125} 1735 L ${cx - 62} 1740 L ${cx} 1850 L ${cx - 95} 1815 Z`} fill={L.shirt} stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
        <path d={`M ${cx + 125} 1735 L ${cx + 62} 1740 L ${cx} 1850 L ${cx + 95} 1815 Z`} fill={L.shirt} stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
        <path d={`M ${cx} 1850 L ${cx} 1960`} stroke={L.shirtShade} strokeWidth={6} />
        {[1890, 1945].map((y) => (
          <circle key={y} cx={cx + 14} cy={y} r={7} fill={L.shirt} stroke={OUT} strokeWidth={4} />
        ))}
      </g>
      {/* head */}
      <g transform={`translate(0 ${bob}) rotate(${tilt} ${cx} ${cy + 120})`}>
        {/* ears */}
        <ellipse cx={cx - 140} cy={cy + 5} rx={26} ry={42} fill={L.skin} stroke={OUT} strokeWidth={7} />
        <ellipse cx={cx + 140} cy={cy + 5} rx={26} ry={42} fill={L.skin} stroke={OUT} strokeWidth={7} />
        {/* face: oval with a firm jaw */}
        <path
          d={`M ${cx - 138} ${cy - 40} Q ${cx - 145} ${cy - 185} ${cx} ${cy - 185} Q ${cx + 145} ${cy - 185} ${cx + 138} ${cy - 40} L ${cx + 128} ${cy + 90} Q ${cx + 100} ${cy + 185} ${cx} ${cy + 195} Q ${cx - 100} ${cy + 185} ${cx - 128} ${cy + 90} Z`}
          fill={L.skin}
          stroke={OUT}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        {/* short trimmed beard along the jaw */}
        <path
          d={`M ${cx - 136} ${cy - 10} L ${cx - 128} ${cy + 90} Q ${cx - 100} ${cy + 185} ${cx} ${cy + 195} Q ${cx + 100} ${cy + 185} ${cx + 128} ${cy + 90} L ${cx + 136} ${cy - 10} Q ${cx + 118} ${cy + 30} ${cx + 112} ${cy + 95} Q ${cx + 80} ${cy + 160} ${cx} ${cy + 165} Q ${cx - 80} ${cy + 160} ${cx - 112} ${cy + 95} Q ${cx - 118} ${cy + 30} ${cx - 136} ${cy - 10} Z`}
          fill={L.beard}
          stroke={OUT}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        {/* stubble hint on cheeks */}
        <path d={`M ${cx - 112} ${cy + 20} Q ${cx - 90} ${cy + 70} ${cx - 60} ${cy + 75}`} stroke={L.beard} strokeWidth={10} opacity={0.35} fill="none" />
        <path d={`M ${cx + 112} ${cy + 20} Q ${cx + 90} ${cy + 70} ${cx + 60} ${cy + 75}`} stroke={L.beard} strokeWidth={10} opacity={0.35} fill="none" />
        {/* hair: short sides, voluminous top swept up and back */}
        <path
          d={`M ${cx - 140} ${cy - 30} Q ${cx - 150} ${cy - 120} ${cx - 120} ${cy - 175} Q ${cx - 120} ${cy - 255} ${cx - 20} ${cy - 265} Q ${cx + 80} ${cy - 285} ${cx + 135} ${cy - 220} Q ${cx + 160} ${cy - 160} ${cx + 140} ${cy - 30} Q ${cx + 128} ${cy - 110} ${cx + 105} ${cy - 135} Q ${cx + 20} ${cy - 155} ${cx - 60} ${cy - 140} Q ${cx - 110} ${cy - 130} ${cx - 140} ${cy - 30} Z`}
          fill={L.hair}
          stroke={OUT}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        {[-70, -20, 30, 80].map((x, i) => (
          <path key={i} d={`M ${cx + x - 30} ${cy - 150} Q ${cx + x - 10} ${cy - 235} ${cx + x + 40} ${cy - 250 + i * 6}`} stroke={L.hairLight} strokeWidth={7} strokeLinecap="round" fill="none" />
        ))}
        {/* thick straight brows */}
        <path d={`M ${cx - 105} ${cy - 62 - brow} L ${cx - 28} ${cy - 68 - brow}`} stroke={L.brow} strokeWidth={18} strokeLinecap="round" />
        <path d={`M ${cx + 28} ${cy - 68 - brow} L ${cx + 105} ${cy - 62 - brow}`} stroke={L.brow} strokeWidth={18} strokeLinecap="round" />
        {/* relaxed, slightly hooded eyes */}
        {[-62, 62].map((dx) => (
          <g key={dx} transform={`translate(${cx + dx} ${cy - 22}) scale(1 ${blink})`}>
            <ellipse rx={30} ry={24} fill="white" stroke={OUT} strokeWidth={6} />
            <circle cx={2} cy={3} r={15} fill={L.iris} />
            <circle cx={2} cy={3} r={7} fill={OUT} />
            <circle cx={7} cy={-2} r={4} fill="white" />
            <path d="M -34 -6 Q 0 -30 34 -6" stroke={OUT} strokeWidth={9} fill="none" strokeLinecap="round" />
          </g>
        ))}
        {/* slim straight nose */}
        <path d={`M ${cx - 6} ${cy - 30} L ${cx - 14} ${cy + 40} Q ${cx - 4} ${cy + 52} ${cx + 16} ${cy + 44}`} stroke={OUT} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* mouth inside the beard */}
        <ellipse cx={cx} cy={cy + 112} rx={36 + mouth * 4} ry={mouthRy} fill="#6e1c1c" stroke={OUT} strokeWidth={6} />
        {mouth > 0.25 ? <rect x={cx - 24} y={cy + 112 - mouthRy + 3} width={48} height={9} rx={4} fill="white" /> : null}
        {mouth <= 0.25 ? <path d={`M ${cx - 30} ${cy + 116} Q ${cx} ${cy + 128} ${cx + 30} ${cy + 116}`} stroke={L.lips} strokeWidth={8} fill="none" strokeLinecap="round" /> : null}
        {/* trimmed mustache */}
        <path d={`M ${cx - 62} ${cy + 96} Q ${cx - 30} ${cy + 70} ${cx} ${cy + 82} Q ${cx + 30} ${cy + 70} ${cx + 62} ${cy + 96} Q ${cx + 30} ${cy + 88} ${cx} ${cy + 96} Q ${cx - 30} ${cy + 88} ${cx - 62} ${cy + 96} Z`} fill={L.beard} stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
      </g>
    </svg>
  );
};
