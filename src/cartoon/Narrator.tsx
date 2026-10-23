import { useCurrentFrame } from "remotion";

const OUT = "#24160e";

// Cartoon look of the narrator (drawn from the channel owner's photo).
export const LOOK = {
  skin: "#f1c6a4",
  skinShade: "#dca582",
  blush: "#e9a08a",
  hair: "#3a2619",
  hairMid: "#523625",
  hairLight: "#7a5438",
  beard: "#2e1d13",
  brow: "#2c1b11",
  iris: "#5a3a22",
  lip: "#c9776a",
  shirt: "#1f1f24",
  shirtLight: "#34343c",
};

// A tapered, curved hair lock from root to tip.
const lock = (x0: number, y0: number, x1: number, y1: number, w: number, bend: number) => {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * bend;
  const cy = my + ny * bend;
  const r = w * 0.38;
  const hook = Math.sign(bend || 1) * w * 0.5;
  const tx = x1 + nx * hook;
  const ty = y1 + ny * hook;
  return `M ${x0 - nx * w} ${y0 - ny * w} Q ${cx - nx * w * 0.7} ${cy - ny * w * 0.7} ${tx - nx * r} ${ty - ny * r} A ${r} ${r} 0 0 ${bend > 0 ? 0 : 1} ${tx + nx * r} ${ty + ny * r} Q ${cx + nx * w * 0.5} ${cy + ny * w * 0.5} ${x0 + nx * w} ${y0 + ny * w} Z`;
};

// Narrator bust. `mouth` 0 (closed smile) .. 1 (wide open).
export const Narrator: React.FC<{ mouth: number; talking: boolean }> = ({ mouth, talking }) => {
  const frame = useCurrentFrame();
  const blink = frame % 120 < 4 ? 0.15 : 1;
  const bob = Math.sin(frame / 14) * (talking ? 5 : 2);
  const tilt = Math.sin(frame / 45) * (talking ? 2 : 0.8);
  const brow = talking ? Math.max(0, Math.sin(frame / 9)) * 5 : 0;
  const sway = Math.sin(frame / 20) * 2;
  const L = LOOK;
  const cx = 790;
  const cy = 1540;
  const open = mouth > 0.1 ? mouth : 0;

  const face = `M ${cx - 126} ${cy - 60} C ${cx - 132} ${cy - 150} ${cx - 82} ${cy - 185} ${cx} ${cy - 185} C ${cx + 82} ${cy - 185} ${cx + 132} ${cy - 150} ${cx + 126} ${cy - 60} C ${cx + 132} ${cy + 20} ${cx + 128} ${cy + 95} ${cx + 110} ${cy + 135} C ${cx + 90} ${cy + 178} ${cx + 48} ${cy + 202} ${cx} ${cy + 204} C ${cx - 48} ${cy + 202} ${cx - 90} ${cy + 178} ${cx - 110} ${cy + 135} C ${cx - 128} ${cy + 95} ${cx - 132} ${cy + 20} ${cx - 126} ${cy - 60} Z`;

  // Beard area: jaw, chin and upper lip; edges are feathered by a mask.
  const beard = `M ${cx - 130} ${cy - 10} C ${cx - 134} ${cy + 80} ${cx - 120} ${cy + 130} ${cx - 100} ${cy + 160} C ${cx - 70} ${cy + 200} ${cx - 30} ${cy + 212} ${cx} ${cy + 212} C ${cx + 30} ${cy + 212} ${cx + 70} ${cy + 200} ${cx + 100} ${cy + 160} C ${cx + 120} ${cy + 130} ${cx + 134} ${cy + 80} ${cx + 130} ${cy - 10} C ${cx + 115} ${cy + 30} ${cx + 100} ${cy + 55} ${cx + 82} ${cy + 72} C ${cx + 66} ${cy + 66} ${cx + 52} ${cy + 64} ${cx + 30} ${cy + 66} C ${cx + 14} ${cy + 60} ${cx - 14} ${cy + 60} ${cx - 30} ${cy + 66} C ${cx - 52} ${cy + 64} ${cx - 66} ${cy + 66} ${cx - 82} ${cy + 72} C ${cx - 100} ${cy + 55} ${cx - 115} ${cy + 30} ${cx - 130} ${cy - 10} Z`;

  const mouthTop = cy + 94;
  const mouthBottom = cy + 136 + open * 26;
  const mouthPath = `M ${cx - 60} ${mouthTop - 4} Q ${cx} ${mouthTop + 8} ${cx + 60} ${mouthTop - 4} Q ${cx + 50} ${mouthBottom - 10} ${cx} ${mouthBottom} Q ${cx - 50} ${mouthBottom - 10} ${cx - 60} ${mouthTop - 4} Z`;

  const backHair = `M ${cx - 160} ${cy + 20} C ${cx - 190} ${cy - 80} ${cx - 175} ${cy - 210} ${cx - 90} ${cy - 262} C ${cx - 20} ${cy - 300} ${cx + 90} ${cy - 296} ${cx + 150} ${cy - 235} C ${cx + 200} ${cy - 180} ${cx + 195} ${cy - 60} ${cx + 165} ${cy + 25} C ${cx + 150} ${cy - 20} ${cx + 140} ${cy - 60} ${cx + 128} ${cy - 90} L ${cx - 128} ${cy - 90} C ${cx - 140} ${cy - 50} ${cx - 150} ${cy - 15} ${cx - 160} ${cy + 20} Z`;

  // Wavy locks: [rootX, rootY, tipX, tipY, width, bend, shade]
  const locks: [number, number, number, number, number, number, string][] = [
    [-150, -150, -175, 30, 28, -30, L.hair],
    [-130, -190, -150, -10, 26, 25, L.hairMid],
    [150, -150, 178, 35, 28, 30, L.hair],
    [130, -190, 152, -5, 26, -25, L.hairMid],
    [-100, -250, -150, -95, 34, -20, L.hairMid],
    [-40, -275, -120, -100, 36, 30, L.hair],
    [20, -285, -60, -110, 38, -35, L.hairMid],
    [70, -275, 10, -118, 34, 30, L.hair],
    [120, -245, 70, -125, 32, -25, L.hairMid],
    [150, -200, 120, -105, 26, 20, L.hair],
    [-10, -290, -100, -150, 18, 22, L.hairLight],
    [60, -282, 0, -150, 14, -18, L.hairLight],
    [-120, -215, -165, -60, 12, -14, L.hairLight],
  ];

  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <pattern id="nStubble" width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
          <rect x={1} y={0.5} width={1.1} height={2.6} rx={0.5} fill={L.beard} />
          <rect x={4} y={2.5} width={1.1} height={2.6} rx={0.5} fill={L.beard} transform="rotate(-15 4.5 3.8)" />
          <circle cx={2.5} cy={4.6} r={0.9} fill={L.beard} />
        </pattern>
        <filter id="nSoft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
        {/* sparse on the cheeks, dense on jaw and chin */}
        <linearGradient id="nBeardFade" gradientUnits="userSpaceOnUse" x1={0} y1={cy - 10} x2={0} y2={cy + 150}>
          <stop offset="0%" stopColor="white" stopOpacity={0.3} />
          <stop offset="55%" stopColor="white" stopOpacity={0.75} />
          <stop offset="100%" stopColor="white" stopOpacity={0.95} />
        </linearGradient>
        <mask id="nBeardMask" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
          <path d={beard} fill="url(#nBeardFade)" filter="url(#nSoft)" />
        </mask>
        <clipPath id="nFaceClip">
          <path d={face} />
        </clipPath>
        <clipPath id="nMouthClip">
          <path d={mouthPath} />
        </clipPath>
        {[-1, 1].map((s) => (
          <clipPath key={s} id={`nEye${s}`}>
            <path d="M -31 4 Q -2 -20 31 0 Q 2 9 -31 4 Z" />
          </clipPath>
        ))}
        <radialGradient id="nShirt" cx="50%" cy="0%" r="90%">
          <stop offset="0%" stopColor={L.shirtLight} />
          <stop offset="100%" stopColor={L.shirt} />
        </radialGradient>
      </defs>

      {/* hair behind the head */}
      <g transform={`translate(0 ${bob}) rotate(${tilt} ${cx} ${cy + 140})`}>
        <path d={backHair} fill={L.hair} stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
      </g>

      {/* neck */}
      <g transform={`translate(0 ${bob * 0.6})`}>
        <path d={`M ${cx - 60} ${cy + 140} L ${cx - 64} ${cy + 235} L ${cx + 64} ${cy + 235} L ${cx + 60} ${cy + 140} Z`} fill={L.skin} stroke={OUT} strokeWidth={6} />
        <path d={`M ${cx - 60} ${cy + 180} Q ${cx} ${cy + 220} ${cx + 60} ${cy + 180} L ${cx + 60} ${cy + 150} L ${cx - 60} ${cy + 150} Z`} fill={L.skinShade} opacity={0.75} />
      </g>

      {/* black crew-neck t-shirt */}
      <g transform={`translate(0 ${bob * 0.4})`}>
        <path d={`M ${cx - 340} 1960 Q ${cx - 330} 1790 ${cx - 110} 1758 Q ${cx} 1800 ${cx + 110} 1758 Q ${cx + 330} 1790 ${cx + 350} 1960 Z`} fill="url(#nShirt)" stroke={OUT} strokeWidth={6} />
        <path d={`M ${cx - 104} 1762 Q ${cx} 1820 ${cx + 104} 1762`} stroke={L.shirtLight} strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d={`M ${cx - 220} 1900 Q ${cx - 190} 1850 ${cx - 140} 1840`} stroke={L.shirtLight} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>

      {/* head */}
      <g transform={`translate(0 ${bob}) rotate(${tilt} ${cx} ${cy + 140})`}>
        {/* ears */}
        {[-1, 1].map((s) => (
          <path key={s} d={`M ${cx + s * 122} ${cy - 30} C ${cx + s * 154} ${cy - 40} ${cx + s * 156} ${cy + 40} ${cx + s * 124} ${cy + 48}`} fill={L.skin} stroke={OUT} strokeWidth={6} />
        ))}
        {/* face */}
        <path d={face} fill={L.skin} />
        <g clipPath="url(#nFaceClip)">
          <ellipse cx={cx - 128} cy={cy - 30} rx={40} ry={120} fill={L.skinShade} opacity={0.4} />
          <ellipse cx={cx + 128} cy={cy - 30} rx={40} ry={120} fill={L.skinShade} opacity={0.4} />
          {/* raised smiling cheeks */}
          <ellipse cx={cx - 72} cy={cy + 28} rx={34} ry={20} fill={L.blush} opacity={0.35} />
          <ellipse cx={cx + 72} cy={cy + 28} rx={34} ry={20} fill={L.blush} opacity={0.35} />
          <path d={`M ${cx + 12} ${cy - 35} Q ${cx + 20} ${cy + 10} ${cx + 22} ${cy + 34}`} stroke={L.skinShade} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.55} />
          {/* beard: soft base tone + stubble texture, feathered edges */}
          <g mask="url(#nBeardMask)">
            <rect x={cx - 160} y={cy - 40} width={320} height={270} fill={L.beard} opacity={0.62} />
            <rect x={cx - 160} y={cy - 40} width={320} height={270} fill="url(#nStubble)" />
          </g>
        </g>
        <path d={face} fill="none" stroke={OUT} strokeWidth={6} />

        {/* brows: dark, thick, lifted by the smile */}
        <path d={`M ${cx - 108} ${cy - 66 - brow} Q ${cx - 70} ${cy - 92 - brow} ${cx - 22} ${cy - 82 - brow} L ${cx - 22} ${cy - 66 - brow} Q ${cx - 68} ${cy - 74 - brow} ${cx - 108} ${cy - 60 - brow} Z`} fill={L.brow} stroke={L.brow} strokeWidth={4} strokeLinejoin="round" />
        <path d={`M ${cx + 108} ${cy - 66 - brow} Q ${cx + 70} ${cy - 92 - brow} ${cx + 22} ${cy - 82 - brow} L ${cx + 22} ${cy - 66 - brow} Q ${cx + 68} ${cy - 74 - brow} ${cx + 108} ${cy - 60 - brow} Z`} fill={L.brow} stroke={L.brow} strokeWidth={4} strokeLinejoin="round" />

        {/* smiling eyes: lower lid pushed up by the cheeks */}
        {[-1, 1].map((s) => (
          <g key={s} transform={`translate(${cx + s * 56} ${cy - 24}) scale(1 ${blink})`}>
            <path d="M -31 4 Q -2 -20 31 0 Q 2 9 -31 4 Z" fill="white" />
            <g clipPath={`url(#nEye${s})`}>
              <circle cx={1} cy={-1} r={14} fill={L.iris} />
              <circle cx={1} cy={-1} r={6.5} fill="#140c07" />
              <circle cx={6} cy={-6} r={4} fill="white" />
            </g>
            <path d="M -35 5 Q -2 -25 35 0" stroke={OUT} strokeWidth={7} fill="none" strokeLinecap="round" />
            <path d="M -28 12 Q 0 22 28 8" stroke={L.skinShade} strokeWidth={4} fill="none" strokeLinecap="round" />
            <path d={`M ${s * 34} 2 l ${s * 12} -4 M ${s * 34} 8 l ${s * 12} 4`} stroke={L.skinShade} strokeWidth={3} strokeLinecap="round" />
          </g>
        ))}

        {/* nose */}
        <path d={`M ${cx - 4} ${cy - 30} Q ${cx - 8} ${cy + 10} ${cx - 18} ${cy + 36}`} stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={`M ${cx - 26} ${cy + 42} Q ${cx - 12} ${cy + 56} ${cx} ${cy + 49} Q ${cx + 12} ${cy + 56} ${cx + 26} ${cy + 42}`} stroke={OUT} strokeWidth={5} fill="none" strokeLinecap="round" />

        {/* big open smile with teeth */}
        <path d={mouthPath} fill="#5a1414" />
        <g clipPath="url(#nMouthClip)">
          <rect x={cx - 70} y={mouthTop - 10} width={140} height={22 + open * 4} fill="white" />
          <path d={`M ${cx - 20} ${mouthTop} L ${cx - 20} ${mouthTop + 14} M ${cx + 20} ${mouthTop} L ${cx + 20} ${mouthTop + 14}`} stroke="#e8e2da" strokeWidth={2} />
          <ellipse cx={cx} cy={mouthBottom + 2} rx={34} ry={14 + open * 6} fill="#c25a5a" />
        </g>
        <path d={mouthPath} fill="none" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M ${cx - 36} ${mouthBottom + 8} Q ${cx} ${mouthBottom + 20} ${cx + 36} ${mouthBottom + 8}`} stroke={L.lip} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
        {/* smile lines */}
        <path d={`M ${cx - 66} ${mouthTop - 26} Q ${cx - 80} ${mouthTop} ${cx - 66} ${mouthTop + 18}`} stroke={L.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={`M ${cx + 66} ${mouthTop - 26} Q ${cx + 80} ${mouthTop} ${cx + 66} ${mouthTop + 18}`} stroke={L.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />

        {/* wavy, messy hair over the forehead and sides */}
        <g transform={`rotate(${sway * 0.3} ${cx} ${cy - 200})`}>
          {locks.map(([x0, y0, x1, y1, w, b, c], i) => (
            <path key={i} d={lock(cx + x0, cy + y0, cx + x1, cy + y1 + (i % 2 ? sway : -sway), w, b)} fill={c} stroke={OUT} strokeWidth={i >= 10 ? 0 : 5} strokeLinejoin="round" />
          ))}
        </g>
      </g>
    </svg>
  );
};
