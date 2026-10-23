export type PosterContent =
  | { kind: "title"; top?: string; big: string[]; hand?: string }
  | { kind: "seas"; word: string; meaning: string; reference: string }
  | { kind: "timeline"; stations: string[]; active: number; note?: string }
  | { kind: "ayah"; reference: string; arabic?: string; meal: string }
  | {
      kind: "split";
      title: string;
      left: { label: string; reference: string; text: string };
      right: { label: string; reference: string; text: string };
    };

export type CartoonScene = {
  durationInFrames: number;
  poster: PosterContent;
  narration: string[];
};

export type CartoonProps = {
  scenes: CartoonScene[];
  music?: string;
  voice?: string;
};
