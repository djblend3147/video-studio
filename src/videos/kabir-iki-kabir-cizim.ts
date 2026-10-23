import type { WhiteboardProps } from "../whiteboard/types";
import {
  arrow,
  circleAround,
  dashedPath,
  drop,
  grass,
  grave,
  palmBranch,
  roundedBox,
  scissorsCut,
  speechBubble,
  underline,
} from "../whiteboard/shapes";

// Kaynak: Buhârî, Vudû 55-56 (216, 218); Müslim, Tahâret 111 (292). Râvi: İbn Abbas (r.a.)
// Hz. Peygamber (s.a.v.) çizilmez; sadece mekân, nesne ve sade ikonlar.
const RED = "#c62828";
const GREEN = "#2e7d32";
const GREY = "#555";

export const ikiKabirCizim: WhiteboardProps = {
  music: "audio/paper-ambient.mp3",
  scratch: "audio/pencil-scratch.mp3",
  scenes: [
    {
      hold: 30,
      elements: [
        { kind: "text", x: 540, y: 420, lines: ["KABİR HADİSLERİ · 1"], size: 56, color: RED },
        { kind: "path", d: underline(320, 760, 450), color: RED, width: 6 },
        { kind: "text", x: 540, y: 660, lines: ["Kabirde azap gören", "iki kişi…"], size: 112 },
        { kind: "text", x: 540, y: 980, lines: ["Sebebi: herkesin küçük", "gördüğü iki günah."], size: 74, color: GREY, weight: 500 },
      ],
    },
    {
      elements: [
        { kind: "text", x: 540, y: 470, lines: ["Peygamberimiz (s.a.v.)", "iki kabrin yanından", "geçiyordu…"], size: 84 },
        { kind: "path", d: grave(320, 1250, 280) },
        { kind: "path", d: grave(740, 1250, 280) },
        { kind: "path", d: grass(150, 1250) + grass(520, 1250) + grass(900, 1250), width: 5 },
        { kind: "path", d: dashedPath(80, 1420, 1000, 1400), color: GREY, width: 5 },
      ],
    },
    {
      elements: [
        { kind: "path", d: roundedBox(90, 520, 900, 640) },
        { kind: "text", x: 175, y: 680, lines: ["“"], size: 220, color: RED, anchor: "start" },
        { kind: "text", x: 540, y: 740, lines: ["Bu ikisi azap görüyor.", "Ama büyük bir şeyden", "dolayı azap", "görmüyorlar."], size: 82 },
        { kind: "text", x: 540, y: 1270, lines: ["— Hz. Muhammed (s.a.v.)"], size: 58, color: GREY, weight: 500 },
      ],
    },
    {
      hold: 55,
      elements: [
        { kind: "text", x: 540, y: 470, lines: ["Peki sebep neydi?"], size: 100 },
        { kind: "text", x: 150, y: 735, lines: ["1"], size: 104, color: RED },
        { kind: "path", d: circleAround(150, 700, 62), color: RED, width: 6 },
        { kind: "path", d: drop(320, 690, 70) },
        { kind: "text", x: 450, y: 690, lines: ["İdrardan", "sakınmamak"], size: 76, anchor: "start" },
        { kind: "text", x: 450, y: 860, lines: ["(temizliğe dikkat etmemek)"], size: 44, color: GREY, weight: 500, anchor: "start" },
        { kind: "text", x: 150, y: 1125, lines: ["2"], size: 104, color: RED },
        { kind: "path", d: circleAround(150, 1090, 62), color: RED, width: 6 },
        { kind: "path", d: speechBubble(250, 1010, 160, 100) + " M 280 1060 l 20 -12 l 20 12 l 20 -12 l 20 12 l 20 -12 l 20 12" },
        { kind: "text", x: 450, y: 1080, lines: ["Laf taşımak"], size: 76, anchor: "start" },
        { kind: "text", x: 450, y: 1160, lines: ["(koğuculuk yapmak)"], size: 44, color: GREY, weight: 500, anchor: "start" },
      ],
    },
    {
      elements: [
        { kind: "text", x: 540, y: 420, lines: ["Yaş bir hurma dalını", "ikiye böldü ve her", "kabrin üzerine birini dikti."], size: 72 },
        { kind: "path", d: palmBranch(540, 1010, 330), color: GREEN },
        { kind: "path", d: scissorsCut(560, 690, 1000), color: RED, width: 5 },
        { kind: "path", d: arrow(500, 1040, 380, 1150, -10), color: GREY, width: 5 },
        { kind: "path", d: arrow(580, 1040, 700, 1150, -10), color: GREY, width: 5 },
        { kind: "path", d: grave(330, 1420, 240) },
        { kind: "path", d: grave(750, 1420, 240) },
        { kind: "path", d: palmBranch(410, 1400, 190), color: GREEN, width: 6 },
        { kind: "path", d: palmBranch(830, 1400, 190), color: GREEN, width: 6 },
      ],
    },
    {
      elements: [
        { kind: "path", d: roundedBox(90, 560, 900, 540) },
        { kind: "text", x: 175, y: 720, lines: ["“"], size: 220, color: RED, anchor: "start" },
        { kind: "text", x: 540, y: 780, lines: ["Bunlar kurumadıkça,", "umulur ki azapları", "hafifletilir."], size: 86 },
        { kind: "text", x: 540, y: 1210, lines: ["— Hz. Muhammed (s.a.v.)"], size: 58, color: GREY, weight: 500 },
      ],
    },
    {
      hold: 75,
      elements: [
        { kind: "text", x: 540, y: 600, lines: ["Küçük gördüğün günah,", "kabirde büyük", "olabilir."], size: 100 },
        { kind: "highlight", x1: 250, x2: 830, y: 690, height: 70 },
        { kind: "text", x: 540, y: 1010, lines: ["Buhârî, Vudû 55-56 (216, 218)", "Müslim, Tahâret 111 (292)"], size: 52, color: GREY, weight: 500 },
        { kind: "path", d: roundedBox(290, 1160, 500, 130, 40), color: RED, width: 6 },
        { kind: "text", x: 540, y: 1250, lines: ["Kaydet · Paylaş"], size: 72, color: RED },
      ],
    },
  ],
};
