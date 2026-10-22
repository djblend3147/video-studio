// Usage: npm run transcribe -- public/input.mp4 [language]
// Writes public/input.json (Remotion Caption[]) next to the video.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { toCaptions, transcribe } from "@remotion/install-whisper-cpp";
import { WHISPER_MODEL, WHISPER_PATH, WHISPER_VERSION } from "./whisper-config.mjs";

const input = process.argv[2];
const language = process.argv[3] ?? "auto";
if (!input) {
  console.error("Usage: npm run transcribe -- <video-or-audio> [language]");
  process.exit(1);
}

const wav = path.join(path.dirname(input), `.${path.parse(input).name}.wav`);
execFileSync("ffmpeg", ["-y", "-i", input, "-ar", "16000", "-ac", "1", wav], { stdio: "ignore" });

const output = await transcribe({
  inputPath: wav,
  whisperPath: WHISPER_PATH,
  whisperCppVersion: WHISPER_VERSION,
  model: WHISPER_MODEL,
  tokenLevelTimestamps: true,
  language,
});
fs.rmSync(wav);

const { captions } = toCaptions({ whisperCppOutput: output });
const outPath = input.replace(/\.[^.]+$/, ".json");
fs.writeFileSync(outPath, JSON.stringify(captions, null, 2));
console.log(`Wrote ${captions.length} captions -> ${outPath}`);
