import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";
import { continueRender, delayRender } from "remotion";

export const FONT_ARABIC = "Amiri";
export const FONT_SERIF = "Playfair Display";
export const FONT_SANS = "Inter";

const handle = delayRender("Loading fonts");
Promise.all([
  document.fonts.load(`700 80px "${FONT_ARABIC}"`, "إِنَّ"),
  document.fonts.load(`700 80px "${FONT_SERIF}"`, "Şüphesiz"),
  document.fonts.load(`italic 400 80px "${FONT_SERIF}"`, "ğüşıöç"),
  document.fonts.load(`800 80px "${FONT_SANS}"`, "ĞÜŞİÖÇ"),
]).finally(() => continueRender(handle));
