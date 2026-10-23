export type WbElement =
  | { kind: "path"; d: string; color?: string; width?: number; dur?: number; fill?: string }
  | {
      kind: "text";
      x: number;
      y: number;
      lines: string[];
      size?: number;
      color?: string;
      weight?: 500 | 700;
      anchor?: "start" | "middle";
      dur?: number;
    }
  | { kind: "highlight"; x1: number; x2: number; y: number; height?: number; color?: string; dur?: number }
  | { kind: "wait"; dur: number };

export type WbScene = { elements: WbElement[]; hold?: number };

export type WhiteboardProps = {
  scenes: WbScene[];
  music?: string;
  scratch?: string;
};
