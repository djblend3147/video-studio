export type Scene =
  | { type: "hook"; durationInFrames: number; text: string; highlight?: string }
  | { type: "ayah"; durationInFrames: number; arabic: string[]; meal: string[]; reference: string }
  | {
      type: "compare";
      durationInFrames: number;
      title: string;
      items: { arabic: string; label: string; meaning: string }[];
      note?: string;
    }
  | { type: "outro"; durationInFrames: number; text: string; reference: string; cta: string };

export type ShortProps = {
  scenes: Scene[];
  music?: string;
  handle?: string;
};
