export type HadisScene =
  | { type: "hook"; durationInFrames: number; lines: string[]; highlight?: string[] }
  | { type: "story"; durationInFrames: number; text: string; highlight?: string[]; focus?: "both" | "left" | "right" | "branch" }
  | { type: "reveal"; durationInFrames: number; title: string; items: { label: string; detail: string }[] }
  | { type: "quote"; durationInFrames: number; text: string; speaker: string; focus?: "branch" }
  | { type: "outro"; durationInFrames: number; lesson: string; source: string; cta: string };

export type HadisReelProps = {
  title: string;
  scenes: HadisScene[];
  music?: string;
  handle?: string;
};
