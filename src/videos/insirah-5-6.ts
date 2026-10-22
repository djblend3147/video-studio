import type { ShortProps } from "../shorts/types";

// İnşirah Suresi 94:5-6 — meal: Diyanet İşleri Başkanlığı
export const insirah56: ShortProps = {
  music: "audio/ambient.mp3",
  scenes: [
    {
      type: "hook",
      durationInFrames: 90,
      text: "Zor bir dönemden mi geçiyorsun?",
      highlight: "zor",
    },
    {
      type: "hook",
      durationInFrames: 105,
      text: "Kur'an buna bir cümleyle cevap verir… ve onu iki kez tekrarlar.",
      highlight: "iki",
    },
    {
      type: "ayah",
      durationInFrames: 300,
      reference: "İnşirah Suresi · 5-6",
      arabic: ["فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", "إِنَّ مَعَ الْعُسْرِ يُسْرًا"],
      meal: [
        "Şüphesiz güçlükle beraber bir kolaylık vardır.",
        "Gerçekten, güçlükle beraber bir kolaylık vardır.",
      ],
    },
    {
      type: "compare",
      durationInFrames: 240,
      title: "Peki neden iki kez?",
      items: [
        { arabic: "الْعُسْر", label: "el-usr · belirli (el-takılı)", meaning: "İki ayette de AYNI güçlük" },
        { arabic: "يُسْرًا", label: "yusran · belirsiz", meaning: "Her ayette YENİ bir kolaylık" },
      ],
      note: "Arapçada belirli isim tekrar edilince aynı şeyi, belirsiz isim tekrar edilince farklı bir şeyi gösterir. (Zemahşerî, İbn Kesîr tefsirleri)",
    },
    {
      type: "outro",
      durationInFrames: 150,
      text: "Bir güçlüğe karşı iki kolaylık.",
      reference: "İnşirah Suresi 94:5-6",
      cta: "Takip et · devamı gelecek",
    },
  ],
};
