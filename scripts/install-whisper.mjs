import { downloadWhisperModel, installWhisperCpp } from "@remotion/install-whisper-cpp";
import { WHISPER_MODEL, WHISPER_PATH, WHISPER_VERSION } from "./whisper-config.mjs";

await installWhisperCpp({ to: WHISPER_PATH, version: WHISPER_VERSION });
await downloadWhisperModel({ folder: WHISPER_PATH, model: WHISPER_MODEL });
console.log(`whisper.cpp + model "${WHISPER_MODEL}" ready in ${WHISPER_PATH}`);
