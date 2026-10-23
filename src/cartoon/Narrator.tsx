import { useCurrentFrame } from "remotion";

const OUT = "#2a1a10";

// Cartoon look of the narrator (drawn from the channel owner's photo).
export const LOOK = {
  skin: "#eab48b",
  skinShade: "#d0956c",
  hairDark: "#5e3d24",
  hairLight: "#b48352",
  beard: "#4a2f1d",
  brow: "#3a2414",
  iris: "#7a5530",
  irisDark: "#4a321b",
  lipUpper: "#a85a4c",
  lipLower: "#c27463",
  shirt: "#fbfaf6",
  shirtShade: "#e2ddd2",
};

// Narrator bust. `mouth` 0 (closed) .. 1 (wide open).
export const Narrator: React.FC<{ mouth: number; talking: boolean }> = ({ mouth, talking }) => {
  const frame = useCurrentFrame();
  const blink = frame % 120 < 4 ? 0.12 : 1;
  const bob = Math.sin(frame / 14) * (talking ? 5 : 2);
  const tilt = Math.sin(frame / 45) * (talking ? 2 : 0.8);
  const brow = talking ? Math.max(0, Math.sin(frame / 9)) * 5 : 0;
  const L = LOOK;
  const cx = 790;
  const cy = 1540;
  const open = mouth > 0.12 ? mouth : 0;

  const face = `M ${cx - 122} ${cy - 60} C ${cx - 128} ${cy - 150} ${cx - 80} ${cy - 185} ${cx} ${cy - 185} C ${cx + 80} ${cy - 185} ${cx + 128} ${cy - 150} ${cx + 122} ${cy - 60} C ${cx + 128} ${cy + 20} ${cx + 122} ${cy + 90} ${cx + 108} ${cy + 130} C ${cx + 90} ${cy + 175} ${cx + 45} ${cy + 205} ${cx} ${cy + 207} C ${cx - 45} ${cy + 205} ${cx - 90} ${cy + 175} ${cx - 108} ${cy + 130} C ${cx - 122} ${cy + 90} ${cx - 128} ${cy + 20} ${cx - 122} ${cy - 60} Z`;

  const beard = `M ${cx - 124} ${cy - 15} C ${cx - 126} ${cy + 60} ${cx - 120} ${cy + 100} ${cx - 108} ${cy + 130} C ${cx - 90} ${cy + 175} ${cx - 45} ${cy + 205} ${cx} ${cy + 207} C ${cx + 45} ${cy + 205} ${cx + 90} ${cy + 175} ${cx + 108} ${cy + 130} C ${cx + 120} ${cy + 100} ${cx + 126} ${cy + 60} ${cx + 124} ${cy - 15} C ${cx + 112} ${cy + 25} ${cx + 100} ${cy + 55} ${cx + 72} ${cy + 80} C ${cx + 60} ${cy + 88} ${cx + 50} ${cy + 95} ${cx + 44} ${cy + 100} L ${cx - 44} ${cy + 100} C ${cx - 50} ${cy + 95} ${cx - 60} ${cy + 88} ${cx - 72} ${cy + 80} C ${cx - 100} ${cy + 55} ${cx - 112} ${cy + 25} ${cx - 124} ${cy - 15} Z`;

  const hair = `M ${cx - 126} ${cy - 40} C ${cx - 142} ${cy - 140} ${cx - 122} ${cy - 215} ${cx - 62} ${cy - 252} C ${cx - 20} ${cy - 292} ${cx + 72} ${cy - 302} ${cx + 122} ${cy - 255} C ${cx + 152} ${cy - 225} ${cx + 146} ${cy - 150} ${cx + 127} ${cy - 40} C ${cx + 120} ${cy - 110} ${cx + 102} ${cy - 142} ${cx + 60} ${cy - 152} C ${cx + 20} ${cy - 160} ${cx - 30} ${cy - 152} ${cx - 70} ${cy - 138} C ${cx - 100} ${cy - 124} ${cx - 117} ${cy - 92} ${cx - 126} ${cy - 40} Z`;

  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="nHair" x1="0" y1="1" x2="0.3" y2="0">
          <stop offset="0%" stopColor={L.hairDark} />
          <stop offset="100%" stopColor={L.hairLight} />
        </linearGradient>
        <linearGradient id="nBeard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={L.beard} stopOpacity={0.55} />
          <stop offset="35%" stopColor={L.beard} stopOpacity={0.95} />
          <stop offset="100%" stopColor={L.beard} />
        </linearGradient>
        <radialGradient id="nIris" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#a9804f" />
          <stop offset="70%" stopColor={L.iris} />
          <stop offset="100%" stopColor={L.irisDark} />
        </radialGradient>
        <linearGradient id="nShirt" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={L.shirtShade} />
          <stop offset="30%" stopColor={L.shirt} />
          <stop offset="75%" stopColor={L.shirt} />
          <stop offset="100%" stopColor={L.shirtShade} />
        </linearGradient>
        <clipPath id="nFaceClip">
          <path d={face} />
        </clipPath>
      </defs>

      {/* neck */}
      <g transform={`translate(0 ${bob * 0.6})`}>
        <path d={`M ${cx - 58} ${cy + 140} L ${cx - 62} ${cy + 230} L ${cx + 62} ${cy + 230} L ${cx + 58} ${cy + 140} Z`} fill={L.skin} stroke={OUT} strokeWidth={6} />
        <path d={`M ${cx - 58} ${cy + 175} Q ${cx} ${cy + 215} ${cx + 58} ${cy + 175} L ${cx + 58} ${cy + 150} L ${cx - 58} ${cy + 150} Z`} fill={L.skinShade} opacity={0.7} />
      </g>

      {/* white shirt, open collar */}
      <g transform={`translate(0 ${bob * 0.4})`}>
        <path d={`M ${cx - 330} 1960 Q ${cx - 320} 1785 ${cx - 115} 1752 L ${cx + 115} 1752 Q ${cx + 320} 1785 ${cx + 340} 1960 Z`} fill="url(#nShirt)" stroke={OUT} strokeWidth={6} />
        <path d={`M ${cx - 62} 1752 L ${cx} 1850 L ${cx + 62} 1752 Z`} fill={L.skin} />
        <path d={`M ${cx - 22} 1790 Q ${cx} 1806 ${cx + 22} 1790`} stroke={L.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={`M ${cx - 120} 1750 L ${cx - 62} 1750 L ${cx} 1858 L ${cx - 98} 1828 Z`} fill={L.shirt} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M ${cx + 120} 1750 L ${cx + 62} 1750 L ${cx} 1858 L ${cx + 98} 1828 Z`} fill={L.shirt} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M ${cx + 6} 1858 L ${cx + 6} 1960`} stroke={L.shirtShade} strokeWidth={5} />
        <circle cx={cx + 20} cy={1905} r={6} fill={L.shirt} stroke={OUT} strokeWidth={3} />
        <path d={`M ${cx - 230} 1880 Q ${cx - 200} 1840 ${cx - 150} 1830`} stroke={L.shirtShade} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d={`M ${cx + 230} 1880 Q ${cx + 200} 1840 ${cx + 150} 1830`} stroke={L.shirtShade} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>

      {/* head */}
      <g transform={`translate(0 ${bob}) rotate(${tilt} ${cx} ${cy + 140})`}>
        {/* ears */}
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={`M ${cx + s * 118} ${cy - 40} C ${cx + s * 150} ${cy - 50} ${cx + s * 152} ${cy + 30} ${cx + s * 120} ${cy + 40}`} fill={L.skin} stroke={OUT} strokeWidth={6} />
            <path d={`M ${cx + s * 124} ${cy - 22} C ${cx + s * 140} ${cy - 20} ${cx + s * 138} ${cy + 15} ${cx + s * 124} ${cy + 18}`} stroke={L.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />
          </g>
        ))}
        {/* face */}
        <path d={face} fill={L.skin} />
        <g clipPath="url(#nFaceClip)">
          {/* soft shading: temples, nose side */}
          <ellipse cx={cx - 125} cy={cy - 40} rx={40} ry={110} fill={L.skinShade} opacity={0.45} />
          <ellipse cx={cx + 125} cy={cy - 40} rx={40} ry={110} fill={L.skinShade} opacity={0.45} />
          <path d={`M ${cx + 14} ${cy - 40} Q ${cx + 22} ${cy + 10} ${cx + 24} ${cy + 36}`} stroke={L.skinShade} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.6} />
          {/* beard */}
          <path d={beard} fill="url(#nBeard)" />
          {/* faded short sides */}
          <path d={`M ${cx - 130} ${cy - 120} L ${cx - 112} ${cy - 120} L ${cx - 116} ${cy - 15} L ${cx - 130} ${cy - 15} Z`} fill={L.hairDark} opacity={0.85} />
          <path d={`M ${cx + 130} ${cy - 120} L ${cx + 112} ${cy - 120} L ${cx + 116} ${cy - 15} L ${cx + 130} ${cy - 15} Z`} fill={L.hairDark} opacity={0.85} />
        </g>
        <path d={face} fill="none" stroke={OUT} strokeWidth={6} />

        {/* hair: voluminous top swept up and to the side */}
        <path d={hair} fill="url(#nHair)" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
        {[
          `M ${cx - 95} ${cy - 130} C ${cx - 95} ${cy - 200} ${cx - 50} ${cy - 250} ${cx + 10} ${cy - 268}`,
          `M ${cx - 45} ${cy - 145} C ${cx - 40} ${cy - 215} ${cx + 10} ${cy - 262} ${cx + 70} ${cy - 270}`,
          `M ${cx + 10} ${cy - 152} C ${cx + 20} ${cy - 210} ${cx + 60} ${cy - 245} ${cx + 115} ${cy - 240}`,
          `M ${cx + 65} ${cy - 150} C ${cx + 85} ${cy - 185} ${cx + 110} ${cy - 205} ${cx + 135} ${cy - 200}`,
        ].map((d, i) => (
          <path key={i} d={d} stroke={i % 2 ? "#c99766" : L.hairDark} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
        ))}

        {/* brows: thick, tapered, slight arch */}
        <path d={`M ${cx - 104} ${cy - 62 - brow} Q ${cx - 70} ${cy - 84 - brow} ${cx - 20} ${cy - 76 - brow} L ${cx - 20} ${cy - 60 - brow} Q ${cx - 68} ${cy - 66 - brow} ${cx - 104} ${cy - 56 - brow} Z`} fill={L.brow} stroke={L.brow} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M ${cx + 104} ${cy - 62 - brow} Q ${cx + 70} ${cy - 84 - brow} ${cx + 20} ${cy - 76 - brow} L ${cx + 20} ${cy - 60 - brow} Q ${cx + 68} ${cy - 66 - brow} ${cx + 104} ${cy - 56 - brow} Z`} fill={L.brow} stroke={L.brow} strokeWidth={4} strokeLinejoin="round" />

        {/* almond eyes */}
        {[-1, 1].map((s) => (
          <g key={s} transform={`translate(${cx + s * 56} ${cy - 25}) scale(1 ${blink})`}>
            <path d="M -32 2 Q -2 -22 32 0 Q 2 18 -32 2 Z" fill="white" />
            <circle cx={1} cy={1} r={14} fill="url(#nIris)" />
            <circle cx={1} cy={1} r={6} fill="#1c120a" />
            <circle cx={6} cy={-4} r={4} fill="white" />
            <circle cx={-4} cy={6} r={2} fill="white" opacity={0.8} />
            <path d="M -36 4 Q -2 -26 36 0" stroke={OUT} strokeWidth={7} fill="none" strokeLinecap="round" />
            <path d="M -26 8 Q 2 18 28 4" stroke={L.skinShade} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d="M -30 -14 Q 0 -32 30 -12" stroke={L.skinShade} strokeWidth={3} fill="none" opacity={0.8} />
          </g>
        ))}

        {/* straight nose */}
        <path d={`M ${cx - 4} ${cy - 30} Q ${cx - 8} ${cy + 10} ${cx - 18} ${cy + 38}`} stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={`M ${cx - 24} ${cy + 44} Q ${cx - 10} ${cy + 56} ${cx} ${cy + 50} Q ${cx + 10} ${cy + 56} ${cx + 24} ${cy + 44}`} stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />

        {/* mustache */}
        <path d={`M ${cx - 58} ${cy + 96} C ${cx - 40} ${cy + 70} ${cx - 12} ${cy + 66} ${cx} ${cy + 74} C ${cx + 12} ${cy + 66} ${cx + 40} ${cy + 70} ${cx + 58} ${cy + 96} C ${cx + 30} ${cy + 86} ${cx + 12} ${cy + 86} ${cx} ${cy + 90} C ${cx - 12} ${cy + 86} ${cx - 30} ${cy + 86} ${cx - 58} ${cy + 96} Z`} fill={L.beard} />

        {/* lips / open mouth */}
        {open > 0 ? (
          <g>
            <path d={`M ${cx - 34} ${cy + 100} Q ${cx} ${cy + 94} ${cx + 34} ${cy + 100} Q ${cx + 30} ${cy + 104 + open * 30} ${cx} ${cy + 108 + open * 32} Q ${cx - 30} ${cy + 104 + open * 30} ${cx - 34} ${cy + 100} Z`} fill="#5c1717" stroke={OUT} strokeWidth={4} />
            <path d={`M ${cx - 24} ${cy + 101} Q ${cx} ${cy + 97} ${cx + 24} ${cy + 101} L ${cx + 22} ${cy + 108} Q ${cx} ${cy + 106} ${cx - 22} ${cy + 108} Z`} fill="white" />
            <path d={`M ${cx - 26} ${cy + 106 + open * 30} Q ${cx} ${cy + 118 + open * 32} ${cx + 26} ${cy + 106 + open * 30}`} stroke={L.lipLower} strokeWidth={8} fill="none" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <path d={`M ${cx - 34} ${cy + 100} Q ${cx - 14} ${cy + 92} ${cx} ${cy + 97} Q ${cx + 14} ${cy + 92} ${cx + 34} ${cy + 100} Q ${cx} ${cy + 104} ${cx - 34} ${cy + 100} Z`} fill={L.lipUpper} />
            <path d={`M ${cx - 30} ${cy + 101} Q ${cx} ${cy + 124} ${cx + 30} ${cy + 101} Q ${cx} ${cy + 106} ${cx - 30} ${cy + 101} Z`} fill={L.lipLower} />
            <path d={`M ${cx - 34} ${cy + 100} Q ${cx} ${cy + 106} ${cx + 34} ${cy + 100}`} stroke={OUT} strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
};
