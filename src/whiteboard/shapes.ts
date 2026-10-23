// Hand-drawable shapes as SVG path strings (1080×1920 canvas).
export const grave = (cx: number, base: number, w = 300) => {
  const h = w * 0.32;
  return [
    `M ${cx - w / 2 - 30} ${base} L ${cx + w / 2 + 30} ${base}`,
    `M ${cx - w / 2} ${base} Q ${cx} ${base - h * 2} ${cx + w / 2} ${base}`,
    `M ${cx - 26} ${base - h + 10} L ${cx - 26} ${base - h - 120} Q ${cx} ${base - h - 160} ${cx + 26} ${base - h - 120} L ${cx + 26} ${base - h + 10}`,
  ].join(" ");
};

export const grass = (x: number, y: number) =>
  `M ${x} ${y} l -8 -26 M ${x + 10} ${y} l 2 -32 M ${x + 20} ${y} l 10 -24`;

export const dashedPath = (x1: number, y1: number, x2: number, y2: number, dashes = 9) => {
  let d = "";
  for (let i = 0; i < dashes; i++) {
    const a = i / dashes;
    const b = (i + 0.55) / dashes;
    const bend = (t: number) => Math.sin(t * Math.PI) * 40;
    d += `M ${x1 + (x2 - x1) * a} ${y1 + (y2 - y1) * a + bend(a)} L ${x1 + (x2 - x1) * b} ${y1 + (y2 - y1) * b + bend(b)} `;
  }
  return d;
};

export const roundedBox = (x: number, y: number, w: number, h: number, r = 30) =>
  `M ${x + r} ${y} L ${x + w - r} ${y + 3} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w - 3} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} L ${x + r} ${y + h - 2} Q ${x} ${y + h} ${x} ${y + h - r} L ${x + 2} ${y + r} Q ${x} ${y} ${x + r + 8} ${y - 2}`;

export const circleAround = (cx: number, cy: number, rx: number, ry = rx) =>
  `M ${cx + rx} ${cy - ry * 0.15} C ${cx + rx} ${cy + ry * 1.1} ${cx - rx * 1.1} ${cy + ry} ${cx - rx} ${cy} C ${cx - rx} ${cy - ry * 1.1} ${cx + rx * 0.9} ${cy - ry * 1.15} ${cx + rx * 1.12} ${cy - ry * 0.05}`;

export const underline = (x1: number, x2: number, y: number) =>
  `M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + 14} ${x2} ${y - 6}`;

export const drop = (cx: number, cy: number, s = 60) =>
  `M ${cx} ${cy - s} Q ${cx + s * 0.95} ${cy + s * 0.15} ${cx} ${cy + s * 0.65} Q ${cx - s * 0.95} ${cy + s * 0.15} ${cx} ${cy - s} M ${cx - s * 0.3} ${cy + s * 0.15} q 0 ${s * 0.25} ${s * 0.25} ${s * 0.3}`;

export const person = (cx: number, cy: number, s = 60) =>
  `M ${cx + s * 0.5} ${cy} A ${s * 0.5} ${s * 0.5} 0 1 0 ${cx + s * 0.5} ${cy + 0.1} M ${cx - s} ${cy + s * 1.9} Q ${cx - s} ${cy + s * 0.75} ${cx} ${cy + s * 0.75} Q ${cx + s} ${cy + s * 0.75} ${cx + s} ${cy + s * 1.9}`;

export const arrow = (x1: number, y1: number, x2: number, y2: number, bend = -60) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + bend;
  const ang = Math.atan2(y2 - my, x2 - mx);
  const a1 = ang + Math.PI * 0.82;
  const a2 = ang - Math.PI * 0.82;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2} M ${x2 + Math.cos(a1) * 30} ${y2 + Math.sin(a1) * 30} L ${x2} ${y2} L ${x2 + Math.cos(a2) * 30} ${y2 + Math.sin(a2) * 30}`;
};

export const speechBubble = (x: number, y: number, w: number, h: number) =>
  `M ${x + 20} ${y} L ${x + w - 20} ${y} Q ${x + w} ${y} ${x + w} ${y + 20} L ${x + w} ${y + h - 20} Q ${x + w} ${y + h} ${x + w - 20} ${y + h} L ${x + w * 0.4} ${y + h} L ${x + w * 0.2} ${y + h + 30} L ${x + w * 0.25} ${y + h} L ${x + 20} ${y + h} Q ${x} ${y + h} ${x} ${y + h - 20} L ${x} ${y + 20} Q ${x} ${y} ${x + 20} ${y}`;

export const palmBranch = (x: number, y: number, len = 360) => {
  let d = `M ${x} ${y} Q ${x - 14} ${y - len * 0.5} ${x + 8} ${y - len}`;
  for (let i = 0; i < 8; i++) {
    const py = y - len * 0.25 - i * len * 0.09;
    const px = x - 6 + i * 1.5;
    const side = i % 2 === 0 ? 1 : -1;
    d += ` M ${px} ${py} q ${side * 55} ${-20} ${side * 95} ${10}`;
  }
  return d;
};

export const scissorsCut = (x: number, y1: number, y2: number) => dashedPathVertical(x, y1, y2);
const dashedPathVertical = (x: number, y1: number, y2: number) => {
  let d = "";
  for (let y = y1; y < y2; y += 36) d += `M ${x} ${y} L ${x} ${Math.min(y2, y + 20)} `;
  return d;
};
