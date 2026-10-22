import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";

const STAR = (() => {
  // 8-pointed star (Rub el Hizb) made of two rotated squares
  const sq = (rot: number) =>
    [0, 1, 2, 3]
      .map((i) => {
        const a = ((i * 90 + 45 + rot) * Math.PI) / 180;
        return `${50 + 50 * Math.cos(a)},${50 + 50 * Math.sin(a)}`;
      })
      .join(" ");
  return [sq(0), sq(45)];
})();

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / 30;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% ${35 + Math.sin(t / 4) * 5}%, #1d3a5f 0%, #0b1a2e 45%, #050b14 100%)`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        style={{
          position: "absolute",
          width: width * 1.3,
          left: -width * 0.15,
          top: height * 0.5 - width * 0.65,
          opacity: 0.07,
          transform: `rotate(${t * 3}deg)`,
        }}
      >
        {STAR.map((p, i) => (
          <polygon key={i} points={p} fill="none" stroke="#e8c77a" strokeWidth={0.25} />
        ))}
        <circle cx={50} cy={50} r={20} fill="none" stroke="#e8c77a" strokeWidth={0.2} />
      </svg>
      {new Array(60).fill(0).map((_, i) => {
        const x = random(`x${i}`) * width;
        const speed = 0.3 + random(`s${i}`) * 0.8;
        const y = (((random(`y${i}`) * height - frame * speed) % height) + height) % height;
        const size = 2 + random(`r${i}`) * 4;
        const twinkle = interpolate(Math.sin(t * 2 + i), [-1, 1], [0.15, 0.7]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "#f5dfa6",
              opacity: twinkle,
              boxShadow: `0 0 ${size * 3}px #f5dfa6`,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{ background: "linear-gradient(transparent 70%, rgba(0,0,0,0.55))" }}
      />
    </AbsoluteFill>
  );
};
