import { useContext } from "react";
import { AbsoluteFill, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import "@fontsource/amiri/700.css";
import "@fontsource/rubik/500.css";
import { Room } from "../Room";
import { Narrator } from "../Narrator";
import { PosterBody } from "../Poster";
import type { PosterContent } from "../types";
import { Camera, Figure, OUT, RefTag, SceneVoiceContext, Subtitle, TimeTag, VOICE_LEAD, clamp, sentenceTimes } from "./common";

type Base = { duration: number; subtitle: string[] };

const Stars: React.FC<{ count?: number; maxY?: number }> = ({ count = 60, maxY = 900 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(count).fill(0).map((_, i) => (
        <circle key={i} cx={random(`x${i}`) * 1080} cy={random(`y${i}`) * maxY} r={1.5 + random(`r${i}`) * 2.5} fill="white" opacity={interpolate(Math.sin(frame / 12 + i), [-1, 1], [0.2, 0.9])} />
      ))}
    </>
  );
};

// --- Room with narrator (intro / outro) -----------------------------------
const mouthAt = (sentences: string[], duration: number, frame: number) => {
  const s = sentenceTimes(sentences, duration).find((x) => frame >= x.start && frame < x.start + x.dur - 6);
  if (!s) return 0;
  const words = s.text.split(" ");
  const per = (s.dur - 6) / words.length;
  const wi = Math.floor((frame - s.start) / per);
  const within = ((frame - s.start) % per) / per;
  return Math.pow(Math.sin(within * Math.PI), 0.7) * (0.55 + random(`w${wi}${frame >> 3}`) * 0.45);
};

const VoiceNarrator: React.FC<{ file: string }> = ({ file }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audio = useAudioData(staticFile(file));
  let level = 0;
  if (audio && frame >= VOICE_LEAD) {
    const bins = visualizeAudio({ fps, frame: frame - VOICE_LEAD, audioData: audio, numberOfSamples: 32, smoothing: true });
    level = Math.min(1, (bins.slice(1, 12).reduce((a, b) => a + b, 0) / 11) * 7);
  }
  const mouth = level > 0.12 ? level : 0;
  return <Narrator mouth={mouth} talking={mouth > 0} />;
};

export const RoomScene: React.FC<Base & { poster: PosterContent }> = ({ duration, subtitle, poster }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const voice = useContext(SceneVoiceContext);
  const drop = spring({ frame: frame - 6, fps, config: { damping: 13 } });
  const mouth = mouthAt(subtitle, duration, frame);
  return (
    <Camera duration={duration} zoomTo={1.03} origin="50% 70%">
      <Room />
      <div style={{ position: "absolute", left: 110, top: 255, width: 860, height: 740, background: "#f4ead3", border: `8px solid ${OUT}`, boxShadow: "10px 12px 0 rgba(43,29,20,0.35)", transform: `translateY(${(1 - drop) * -900}px) rotate(${-1.2 + (1 - drop) * 6}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "30px 50px", boxSizing: "border-box" }}>
        <PosterBody content={poster} />
      </div>
      {voice ? <VoiceNarrator file={voice.file} /> : <Narrator mouth={mouth} talking={mouth > 0} />}
      <Subtitle sentences={subtitle} duration={duration} y={1060} />
    </Camera>
  );
};

// --- Dark bedroom at night ------------------------------------------------
export const BedroomScene: React.FC<Base & { time: string }> = ({ duration, subtitle, time }) => {
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame / 20) * 4;
  return (
    <Camera duration={duration} origin="45% 60%">
      <AbsoluteFill style={{ background: "#262d3c" }}>
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#f6e7b0" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#f6e7b0" stopOpacity={0} />
            </radialGradient>
            <clipPath id="win"><circle cx={760} cy={700} r={130} /></clipPath>
          </defs>
          <rect x={0} y={1320} width={1080} height={600} fill="#2f2622" />
          <line x1={0} y1={1322} x2={1080} y2={1322} stroke={OUT} strokeWidth={8} />
          {/* round window with moon */}
          <circle cx={760} cy={700} r={260} fill="url(#moonGlow)" />
          <g clipPath="url(#win)">
            <rect x={600} y={540} width={320} height={320} fill="#0f1a33" />
            {new Array(14).fill(0).map((_, i) => (
              <circle key={i} cx={640 + random(`w${i}`) * 240} cy={590 + random(`v${i}`) * 200} r={2} fill="white" opacity={0.8} />
            ))}
            <circle cx={800} cy={660} r={42} fill="#f3e6b8" />
            <circle cx={818} cy={648} r={40} fill="#0f1a33" />
          </g>
          <circle cx={760} cy={700} r={130} fill="none" stroke="#c9a25a" strokeWidth={18} />
          <circle cx={760} cy={700} r={130} fill="none" stroke={OUT} strokeWidth={5} />
          {/* bedside table + phone glow */}
          <rect x={110} y={1130} width={150} height={190} fill="#6b4a33" stroke={OUT} strokeWidth={6} />
          <rect x={150} y={1112} width={60} height={18} rx={4} fill="#9ab8ff" opacity={0.6 + Math.sin(frame / 6) * 0.2} />
          {/* bed */}
          <rect x={300} y={1040} width={40} height={280} fill="#6b4a33" stroke={OUT} strokeWidth={6} />
          <rect x={300} y={1180} width={680} height={110} fill="#6b4a33" stroke={OUT} strokeWidth={6} />
          <rect x={340} y={1100} width={150} height={70} rx={30} fill="#efe4c8" stroke={OUT} strokeWidth={6} />
          <circle cx={420} cy={1100 + breathe * 0.3} r={44} fill="#f3ead6" stroke={OUT} strokeWidth={6} />
          <path d={`M 400 ${1100 + breathe * 0.3} q 8 6 16 0 M 428 ${1100 + breathe * 0.3} q 8 6 16 0`} stroke={OUT} strokeWidth={4} fill="none" />
          <path d={`M 470 ${1120 - breathe} Q 700 ${1080 - breathe} 960 1130 L 960 1190 L 460 1190 Z`} fill="#4f7a6a" stroke={OUT} strokeWidth={6} strokeLinejoin="round" />
          {/* zzz */}
          {[0, 1, 2].map((i) => {
            const t = ((frame + i * 25) % 75) / 75;
            return (
              <text key={i} x={470 + t * 60} y={1030 - t * 140} fontFamily="Rubik" fontWeight={800} fontSize={34 + i * 6} fill="#efe4c8" opacity={1 - t}>z</text>
            );
          })}
        </svg>
        <TimeTag text={time} />
        <Subtitle sentences={subtitle} duration={duration} />
      </AbsoluteFill>
    </Camera>
  );
};

// --- Cream title card ---------------------------------------------------
export const CardScene: React.FC<Base & { title: string; sub?: string }> = ({ duration, subtitle, title, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 8, fps, config: { damping: 14 } });
  const subO = interpolate(frame, [30, 45], [0, 1], clamp);
  return (
    <Camera duration={duration} zoomTo={1.04}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #f4ead3 40%, #cdbf9f 100%)", justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `scale(${pop})`, border: `7px solid ${OUT}`, borderRadius: 12, padding: "14px 48px", background: "#f8f1df", boxShadow: "8px 8px 0 rgba(31,23,18,0.25)", fontFamily: "Rubik", fontWeight: 800, fontSize: 110, color: OUT }}>{title}</div>
        {sub ? <div style={{ opacity: subO, fontFamily: "Caveat", fontWeight: 700, fontSize: 70, color: OUT, marginTop: 30 }}>{sub}</div> : null}
        <Subtitle sentences={subtitle} duration={duration} />
      </AbsoluteFill>
    </Camera>
  );
};

// --- Two seas with a barrier -------------------------------------------------
export const SeasScene: React.FC<Base & { reference: string }> = ({ duration, subtitle, reference }) => {
  const frame = useCurrentFrame();
  const wall = interpolate(frame, [25, 60], [0, 1], clamp);
  const waves = (x0: number, color: string, off: number) =>
    new Array(12).fill(0).map((_, i) => (
      <path key={i} d={`M ${x0 - 40} ${880 + i * 70} q 45 ${-18 + Math.sin(frame / 10 + i + off) * 6} 90 0 t 90 0 t 90 0 t 90 0 t 90 0 t 90 0 t 90 0`} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
    ));
  return (
    <Camera duration={duration}>
      <AbsoluteFill style={{ background: "#16213a" }}>
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <Stars maxY={780} />
          <circle cx={820} cy={430} r={70} fill="#f3e6b8" />
          <clipPath id="seaL"><rect x={0} y={820} width={540} height={1100} /></clipPath>
          <clipPath id="seaR"><rect x={540} y={820} width={540} height={1100} /></clipPath>
          <g clipPath="url(#seaL)"><rect x={0} y={820} width={540} height={1100} fill="#2f6aa3" />{waves(0, "#7fb4e4", 0)}</g>
          <g clipPath="url(#seaR)"><rect x={540} y={820} width={540} height={1100} fill="#2f9b8f" />{waves(540, "#97e0d2", 2)}</g>
          <line x1={0} y1={820} x2={1080} y2={820} stroke={OUT} strokeWidth={6} />
          <rect x={526} y={820 + 1100 * (1 - wall)} width={28} height={1100 * wall} fill="#fff4cf" opacity={0.95} />
          <rect x={490} y={820 + 1100 * (1 - wall)} width={100} height={1100 * wall} fill="#fff4cf" opacity={0.25} />
        </svg>
        <RefTag text={reference} y={330} />
        <Subtitle sentences={subtitle} duration={duration} />
      </AbsoluteFill>
    </Camera>
  );
};

// --- A figure walks through the veil between this world and berzah ----------
export const VeilScene: React.FC<Base> = ({ duration, subtitle }) => {
  const frame = useCurrentFrame();
  const walkX = interpolate(frame, [20, duration - 50], [180, 540], clamp);
  const fadeFig = interpolate(walkX, [470, 540], [1, 0], clamp);
  const sway = Math.sin(frame / 18) * 6;
  const glow = 0.5 + Math.sin(frame / 8) * 0.15;
  return (
    <Camera duration={duration} origin="50% 55%">
      <AbsoluteFill style={{ background: "linear-gradient(90deg, #c98d4a 0%, #a8733f 49.9%, #1b2340 50.1%, #0e1428 100%)" }}>
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <rect x={540} y={0} width={540} height={1920} fill="#0e1428" opacity={0.3} />
          <g opacity={0.9}><Stars count={30} maxY={1200} /></g>
          <rect x={0} y={0} width={540} height={1920} fill="#c98d4a" opacity={0.0} />
          <rect x={0} y={1320} width={1080} height={600} fill="#2b2220" />
          <line x1={0} y1={1322} x2={1080} y2={1322} stroke={OUT} strokeWidth={8} />
          {/* light leaking from the gap */}
          <rect x={500} y={300} width={80} height={1022} fill="#fff4cf" opacity={glow * 0.5} />
          {/* curtain (perde) */}
          {[-1, 1].map((s) => (
            <path key={s} d={`M 540 260 L ${540 + s * 260} 260 Q ${540 + s * (230 + sway)} 800 ${540 + s * 250} 1322 L ${540 + s * 30} 1322 Q ${540 + s * (60 - sway)} 800 540 260 Z`} fill="#6b2e3a" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
          ))}
          {[-1, 1].map((s) => [80, 150, 210].map((d) => (
            <path key={`${s}${d}`} d={`M ${540 + s * d} 270 Q ${540 + s * (d - 20 + sway)} 800 ${540 + s * (d + 10)} 1315`} stroke="#4f1f2a" strokeWidth={6} fill="none" />
          )))}
          <rect x={250} y={236} width={580} height={30} rx={10} fill="#8a6a3a" stroke={OUT} strokeWidth={6} />
          <Figure x={walkX} y={1170} scale={1.1} walk={frame / 5} opacity={fadeFig} />
        </svg>
        <div style={{ position: "absolute", top: 1360, left: 0, width: 540, textAlign: "center", fontFamily: "Rubik", fontWeight: 800, fontSize: 52, color: "#f4ead3", opacity: 0.85 }}>DÜNYA</div>
        <div style={{ position: "absolute", top: 1360, left: 540, width: 540, textAlign: "center", fontFamily: "Rubik", fontWeight: 800, fontSize: 52, color: "#9fb3e8", opacity: 0.85 }}>BERZAH</div>
        <Subtitle sentences={subtitle} duration={duration} y={1480} />
      </AbsoluteFill>
    </Camera>
  );
};

// --- Ayah card -------------------------------------------------------------
export const AyahScene: React.FC<Base & { reference: string; arabic: string; meal: string }> = ({ duration, subtitle, reference, arabic, meal }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [8, 22], [0, 1], clamp);
  const b = interpolate(frame, [25, 40], [0, 1], clamp);
  const c = interpolate(frame, [45, 60], [0, 1], clamp);
  return (
    <Camera duration={duration} zoomTo={1.04}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #f4ead3 40%, #cdbf9f 100%)", justifyContent: "center", alignItems: "center", padding: "0 90px", textAlign: "center" }}>
        <div style={{ opacity: a, fontFamily: "Rubik", fontWeight: 800, fontSize: 46, letterSpacing: 3, color: "#a8322a" }}>{reference}</div>
        <div dir="rtl" style={{ opacity: b, fontFamily: "Amiri", fontWeight: 700, fontSize: 70, color: OUT, lineHeight: 1.8, margin: "24px 0" }}>{arabic}</div>
        <div style={{ opacity: c, fontFamily: "Rubik", fontWeight: 500, fontSize: 54, color: OUT, lineHeight: 1.35 }}>“{meal}”</div>
        <Subtitle sentences={subtitle} duration={duration} />
      </AbsoluteFill>
    </Camera>
  );
};

// --- Hourglass: the long wait -------------------------------------------------
export const HourglassScene: React.FC<Base & { note: string }> = ({ duration, subtitle, note }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duration], [0.15, 0.85]);
  const o = interpolate(frame, [30, 45], [0, 1], clamp);
  return (
    <Camera duration={duration} zoomTo={1.1}>
      <AbsoluteFill style={{ background: "#141a2c" }}>
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <Stars count={80} maxY={1920} />
          <g transform="translate(540 860)">
            <clipPath id="hgTop"><path d="M -150 -260 L 150 -260 L 10 -10 L -10 -10 Z" /></clipPath>
            <clipPath id="hgBot"><path d="M -10 10 L 10 10 L 150 260 L -150 260 Z" /></clipPath>
            <path d="M -170 -280 L 170 -280 L 0 0 L 170 280 L -170 280 L 0 0 Z" fill="#f4ead3" opacity={0.15} />
            <g clipPath="url(#hgTop)"><rect x={-160} y={-260 + 250 * p} width={320} height={260} fill="#e1b23a" /></g>
            <g clipPath="url(#hgBot)"><rect x={-160} y={260 - 250 * p} width={320} height={260} fill="#e1b23a" /></g>
            <line x1={0} y1={-10} x2={0} y2={260 - 250 * p} stroke="#e1b23a" strokeWidth={5} strokeDasharray="6 10" strokeDashoffset={-frame * 3} />
            <path d="M -170 -280 L 170 -280 L 0 0 L 170 280 L -170 280 L 0 0 Z" fill="none" stroke="#f4ead3" strokeWidth={9} strokeLinejoin="round" />
            <rect x={-200} y={-310} width={400} height={34} rx={10} fill="#8a6a3a" stroke={OUT} strokeWidth={6} />
            <rect x={-200} y={276} width={400} height={34} rx={10} fill="#8a6a3a" stroke={OUT} strokeWidth={6} />
          </g>
        </svg>
        <div style={{ position: "absolute", top: 1240, width: "100%", textAlign: "center", fontFamily: "Caveat", fontWeight: 700, fontSize: 76, color: "#f4ead3", opacity: o }}>{note}</div>
        <Subtitle sentences={subtitle} duration={duration} />
      </AbsoluteFill>
    </Camera>
  );
};

// --- Two doors: blessing and punishment ---------------------------------------
type DoorInfo = { label: string; reference: string; text: string; at: number };
export const DoorsScene: React.FC<Base & { left: DoorInfo; right: DoorInfo }> = ({ duration, subtitle, left, right }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const door = (cx: number, info: DoorInfo, warm: boolean) => {
    const open = spring({ frame: frame - info.at, fps, config: { damping: 20 }, durationInFrames: 40 });
    const flick = Math.sin(frame / 4) * 0.1;
    return (
      <g>
        <rect x={cx - 170} y={560} width={340} height={620} fill={warm ? "#fff1b8" : "#3a0d08"} />
        {warm ? (
          <>
            <rect x={cx - 170} y={560} width={340} height={620} fill="#a9dcf5" />
            <circle cx={cx + 70} cy={680} r={50} fill="#ffd54f" opacity={open} />
            <path d={`M ${cx - 170} 1000 Q ${cx - 60} 920 ${cx + 40} 980 T ${cx + 170} 960 V 1180 H ${cx - 170} Z`} fill="#6bb35a" />
            <path d={`M ${cx - 170} 1080 Q ${cx} 1030 ${cx + 170} 1070 V 1180 H ${cx - 170} Z`} fill="#4f9a46" />
          </>
        ) : (
          new Array(6).fill(0).map((_, i) => (
            <path key={i} d={`M ${cx - 170 + i * 62} 1180 Q ${cx - 150 + i * 62} ${1000 + Math.sin(frame / 5 + i) * 30} ${cx - 140 + i * 62} ${900 + Math.sin(frame / 4 + i) * 40} Q ${cx - 120 + i * 62} 1030 ${cx - 100 + i * 62} 1180 Z`} fill={i % 2 ? "#e2572b" : "#f5a623"} opacity={0.85 + flick} />
          ))
        )}
        {/* door leaf swinging open */}
        <path d={`M ${cx - 170} 560 L ${cx - 170 + 340 * (1 - open * 0.85)} ${560 + open * 40} L ${cx - 170 + 340 * (1 - open * 0.85)} ${1180 - open * 40} L ${cx - 170} 1180 Z`} fill="#6e4222" stroke={OUT} strokeWidth={7} strokeLinejoin="round" />
        <rect x={cx - 190} y={540} width={380} height={650} fill="none" stroke={OUT} strokeWidth={14} />
        <rect x={cx - 190} y={540} width={380} height={650} fill="none" stroke="#8a6a3a" strokeWidth={6} />
      </g>
    );
  };
  const label = (cx: number, info: DoorInfo, warm: boolean) => {
    const o = interpolate(frame, [info.at + 25, info.at + 40], [0, 1], clamp);
    return (
      <div style={{ position: "absolute", top: 1070, left: cx - 250, width: 500, textAlign: "center", opacity: o }}>
        <div style={{ fontFamily: "Rubik", fontWeight: 800, fontSize: 56, color: warm ? "#ffd54f" : "#ff7b4a" }}>{info.label}</div>
        <div style={{ fontFamily: "Rubik", fontWeight: 500, fontSize: 30, color: "#d9cfc0" }}>{info.reference}</div>
        <div style={{ fontFamily: "Caveat", fontWeight: 700, fontSize: 44, lineHeight: 1.1, color: "#f4ead3", marginTop: 8, padding: "0 30px" }}>“{info.text}”</div>
      </div>
    );
  };
  return (
    <Camera duration={duration} zoomTo={1.05}>
      <AbsoluteFill style={{ background: "#1c1a22" }}>
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
          <rect x={0} y={1045} width={1080} height={875} fill="#2b2522" />
          <line x1={0} y1={1047} x2={1080} y2={1047} stroke={OUT} strokeWidth={8} />
          <g transform="translate(270 0) scale(0.75) translate(-270 200)">{door(270, left, true)}</g>
          <g transform="translate(810 0) scale(0.75) translate(-810 200)">{door(810, right, false)}</g>
        </svg>
        {label(270, left, true)}
        {label(810, right, false)}
        <Subtitle sentences={subtitle} duration={duration} y={1470} />
      </AbsoluteFill>
    </Camera>
  );
};
