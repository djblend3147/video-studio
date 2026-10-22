import { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  OffthreadVideo,
  Sequence,
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import { parseMedia } from "@remotion/media-parser";

type Props = { src: string };

const FPS = 30;

export const calculateCaptionedMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  const { durationInSeconds } = await parseMedia({
    src: props.src,
    fields: { durationInSeconds: true },
    acknowledgeRemotionLicense: true,
  });
  return { fps: FPS, durationInFrames: Math.ceil((durationInSeconds ?? 10) * FPS) };
};

// Reads public/<video>.json produced by `npm run transcribe`
export const CaptionedVideo: React.FC<Props> = ({ src }) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const [handle] = useState(() => delayRender("Loading captions"));
  const { fps } = useVideoConfig();

  useEffect(() => {
    const jsonUrl = src.replace(/\.[^.]+$/, ".json");
    fetch(jsonUrl)
      .then((r) => (r.ok ? r.json() : []))
      .then((c: Caption[]) => setCaptions(c))
      .catch(() => setCaptions([]))
      .finally(() => continueRender(handle));
  }, [src, handle]);

  const pages = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions: captions ?? [],
        combineTokensWithinMilliseconds: 1200,
      }).pages,
    [captions],
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo src={src} style={{ objectFit: "cover" }} />
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.floor((page.startMs / 1000) * fps);
        const endMs = next ? next.startMs : page.startMs + 2000;
        const duration = Math.max(1, Math.ceil(((endMs - page.startMs) / 1000) * fps));
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const CaptionPage: React.FC<{
  page: ReturnType<typeof createTikTokStyleCaptions>["pages"][number];
}> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 350 }}>
      <div
        style={{
          fontSize: 90,
          fontWeight: 900,
          fontFamily: "sans-serif",
          textAlign: "center",
          color: "white",
          WebkitTextStroke: "12px black",
          paintOrder: "stroke",
          padding: "0 60px",
          whiteSpace: "pre-wrap",
        }}
      >
        {page.tokens.map((t) => (
          <span
            key={t.fromMs}
            style={{ color: nowMs >= t.fromMs && nowMs < t.toMs ? "#FFE600" : "white" }}
          >
            {t.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

