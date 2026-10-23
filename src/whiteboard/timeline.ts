import { getLength } from "@remotion/paths";
import type { WbElement, WbScene } from "./types";

export const PAN_IN = 14;
export const PAN_OUT = 12;
export const GAP = 6;
export const DEFAULT_HOLD = 45;
const FRAMES_PER_CHAR = 1.4;
const PX_PER_FRAME = 28;

export const elementDuration = (el: WbElement): number => {
  if (el.dur !== undefined) return el.dur;
  switch (el.kind) {
    case "path":
      return Math.round(Math.min(50, Math.max(10, getLength(el.d) / PX_PER_FRAME)));
    case "text":
      return Math.round(Math.max(12, el.lines.join("").length * FRAMES_PER_CHAR));
    case "highlight":
      return 14;
    case "wait":
      return el.dur;
  }
};

export type TimedElement = { el: WbElement; start: number; dur: number };

export const sceneTimeline = (scene: WbScene) => {
  let t = PAN_IN;
  const items: TimedElement[] = scene.elements.map((el) => {
    const dur = elementDuration(el);
    const item = { el, start: t, dur };
    t += dur + GAP;
    return item;
  });
  const drawEnd = t;
  const duration = drawEnd + (scene.hold ?? DEFAULT_HOLD) + PAN_OUT;
  return { items, drawEnd, duration };
};

export const whiteboardDuration = (scenes: WbScene[]) =>
  scenes.reduce((sum, s) => sum + sceneTimeline(s).duration, 0);

// Is the pencil touching paper at this absolute frame? (drives the scratch sound)
export const isDrawingAt = (scenes: WbScene[], frame: number) => {
  let offset = 0;
  for (const s of scenes) {
    const { items, duration } = sceneTimeline(s);
    if (frame < offset + duration) {
      const local = frame - offset;
      return items.some((it) => it.el.kind !== "wait" && local >= it.start && local < it.start + it.dur);
    }
    offset += duration;
  }
  return false;
};
