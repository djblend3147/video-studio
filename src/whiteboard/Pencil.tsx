// Pencil whose graphite tip sits at (0,0); body extends up-right.
export const Pencil: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => (
  <g transform={`translate(${x} ${y}) rotate(-58)`} opacity={opacity}>
    <g transform="translate(14 18)" opacity={0.18}>
      <rect x={70} y={-17} width={300} height={34} rx={6} fill="#000" />
    </g>
    <path d="M0 0 L22 -6 L22 6 Z" fill="#2b2b2b" />
    <path d="M22 -6 L70 -17 L70 17 L22 6 Z" fill="#e8c9a0" />
    <rect x={70} y={-17} width={240} height={34} fill="#f4c430" />
    <rect x={70} y={-17} width={240} height={11} fill="#f8d65a" />
    <rect x={310} y={-18} width={34} height={36} fill="#b9b9b9" />
    <rect x={344} y={-17} width={36} height={34} rx={8} fill="#ef8fa0" />
  </g>
);
