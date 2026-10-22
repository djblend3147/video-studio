import path from "node:path";

export const WHISPER_PATH = path.resolve("whisper.cpp");
export const WHISPER_VERSION = "1.7.6";
// Options: tiny, base, small, medium, large-v3-turbo (and *.en variants)
export const WHISPER_MODEL = process.env.WHISPER_MODEL ?? "small";
