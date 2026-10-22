import { Composition, staticFile } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { CaptionedVideo, calculateCaptionedMetadata } from "./CaptionedVideo";
import { DiniShort, shortDuration } from "./shorts/DiniShort";
import { insirah56 } from "./videos/insirah-5-6";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ title: "Kodla Animasyon", subtitle: "Remotion ile MP4" }}
      />
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ src: staticFile("input.mp4") }}
        calculateMetadata={calculateCaptionedMetadata}
      />
      <Composition
        id="Insirah-5-6"
        component={DiniShort}
        durationInFrames={shortDuration(insirah56.scenes)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={insirah56}
      />
    </>
  );
};
