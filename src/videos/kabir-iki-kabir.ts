import type { HadisReelProps } from "../hadis/types";

// Kaynak: Buhârî, Vudû 55-56 (216, 218); Müslim, Tahâret 111 (292). Râvi: İbn Abbas (r.a.)
export const ikiKabir: HadisReelProps = {
  title: "Kabir Hadisleri · 1",
  music: "audio/dark-ambient.mp3",
  scenes: [
    {
      type: "hook",
      durationInFrames: 105,
      lines: ["Kabirde azap gören iki kişi…", "Sebebi ise herkesin küçük gördüğü iki günah."],
      highlight: ["azap", "küçük"],
    },
    {
      type: "story",
      durationInFrames: 150,
      text: "Bir gün Peygamberimiz (s.a.v.) Medine'de iki kabrin yanından geçiyordu.",
      focus: "both",
    },
    {
      type: "quote",
      durationInFrames: 165,
      text: "Bu ikisi azap görüyor. Ama büyük bir şeyden dolayı azap görmüyorlar.",
      speaker: "Hz. Muhammed (s.a.v.)",
    },
    {
      type: "reveal",
      durationInFrames: 210,
      title: "Peki sebep neydi?",
      items: [
        { label: "İdrardan sakınmamak", detail: "Temizliğine dikkat etmiyordu." },
        { label: "Laf taşımak", detail: "İnsanlar arasında koğuculuk yapıyordu." },
      ],
    },
    {
      type: "story",
      durationInFrames: 165,
      text: "Sonra yaş bir hurma dalı istedi. Onu ikiye böldü ve her kabrin üzerine birini dikti.",
      highlight: ["hurma", "dalı"],
      focus: "branch",
    },
    {
      type: "quote",
      durationInFrames: 150,
      text: "Bunlar kurumadıkça, umulur ki azapları hafifletilir.",
      speaker: "Hz. Muhammed (s.a.v.)",
      focus: "branch",
    },
    {
      type: "outro",
      durationInFrames: 165,
      lesson: "Küçük gördüğün günah, kabirde büyük olabilir.",
      source: "Buhârî, Vudû 55-56 (216, 218)\nMüslim, Tahâret 111 (292)",
      cta: "Kaydet · Paylaş",
    },
  ],
};
