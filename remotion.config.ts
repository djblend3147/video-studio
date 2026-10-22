import fs from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setCodec("h264");

// Use a local Chromium when one exists (skips Remotion's own browser download).
const localBrowser =
  process.env.REMOTION_BROWSER ??
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (fs.existsSync(localBrowser)) {
  Config.setBrowserExecutable(localBrowser);
}
