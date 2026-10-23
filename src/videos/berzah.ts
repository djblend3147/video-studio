import type { CartoonProps } from "../cartoon/types";

// Mealler Diyanet mealine göre kısaltılmıştır — yayından önce kuran.diyanet.gov.tr ile karşılaştır.
// Rahmân 55:19-20 · Mü'minûn 23:99-100 · Bakara 2:154 · Mü'min 40:46
export const berzah: CartoonProps = {
  music: "audio/paper-ambient.mp3",
  scenes: [
    {
      durationInFrames: 200,
      poster: { kind: "title", top: "Öldükten sonra…", big: ["KIYAMETE", "KADAR", "NEREDEYİZ?"], hand: "Cevap: Berzah" },
      narration: ["Öldükten sonra, kıyamet kopana kadar neredeyiz?", "Kur'an bu âleme bir isim verir: Berzah."],
    },
    {
      durationInFrames: 250,
      poster: { kind: "seas", word: "BERZAH", meaning: "= perde, engel", reference: "Rahmân Suresi 19-20" },
      narration: [
        "Berzah; iki şey arasındaki perde, engel demektir.",
        "Kur'an bu kelimeyi birbirine karışmayan iki deniz için de kullanır.",
      ],
    },
    {
      durationInFrames: 270,
      poster: { kind: "timeline", stations: ["DÜNYA", "BERZAH", "KIYAMET", "AHİRET"], active: 1, note: "ölümden kıyamete kadar" },
      narration: [
        "Dünya ile ahiret arasında da böyle bir perde var.",
        "Ölümle başlar, kıyametle biter.",
        "İşte bu bekleme âlemine berzah denir.",
      ],
    },
    {
      durationInFrames: 310,
      poster: {
        kind: "ayah",
        reference: "MÜ'MİNÛN SURESİ · 99-100",
        arabic: "وَمِنْ وَرَائِهِمْ بَرْزَخٌ إِلَىٰ يَوْمِ يُبْعَثُونَ",
        meal: "Onların önünde, tekrar diriltilecekleri güne kadar bir berzah vardır.",
      },
      narration: [
        "Ölüm gelen kişi: 'Rabbim, beni geri gönder de salih amel işleyeyim' der.",
        "Cevap ise açıktır:",
        "Önlerinde, diriltilecekleri güne kadar bir berzah vardır.",
      ],
    },
    {
      durationInFrames: 330,
      poster: {
        kind: "split",
        title: "BERZAH NASILDIR?",
        left: { label: "NİMET", reference: "Bakara 2:154", text: "Onlar diridirler, ama siz farkında olamazsınız." },
        right: { label: "AZAP", reference: "Mü'min 40:46", text: "Sabah akşam ateşe sunulurlar." },
      },
      narration: [
        "Peki berzah nasıldır? Herkes için aynı değildir.",
        "Allah yolunda canını verenler için Kur'an 'onlar diridir' der.",
        "Firavun ailesi ise sabah akşam ateşe sunulur.",
      ],
    },
    {
      durationInFrames: 180,
      poster: { kind: "title", top: "Unutma:", big: ["BERZAH", "BİR BEKLEME", "ODASI"], hand: "Kaydet · Paylaş · Takip et" },
      narration: ["Berzah bir bekleme odasıdır.", "Nasıl bekleyeceğimizi ise bugün seçiyoruz."],
    },
  ],
};
