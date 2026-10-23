import type { StoryProps } from "../cartoon/story/StoryVideo";

// Mealler Diyanet mealine göre kısaltılmıştır — yayından önce kuran.diyanet.gov.tr ile karşılaştır.
// Rahmân 55:19-20 · Mü'minûn 23:99-100 · Bakara 2:154 · Mü'min 40:46
export const berzahHikaye: StoryProps = {
  music: "audio/paper-ambient.mp3",
  scenes: [
    {
      kind: "room",
      duration: 210,
      poster: { kind: "title", top: "Eğer…", big: ["BU GECE", "ÖLSEYDİN?"], hand: "kıyamete kadar neredesin?" },
      subtitle: ["Eğer bu gece ölseydin…", "kıyamete kadar nerede olurdun?"],
    },
    { kind: "bedroom", duration: 180, time: "03.12", subtitle: ["Saat gece üçü on iki geçiyor.", "Ev sessiz. Herkes uyuyor."] },
    { kind: "card", duration: 120, title: "BERZAH", sub: "ölüm ile kıyamet arası", subtitle: ["Kur'an bu âleme bir isim verir: Berzah."] },
    {
      kind: "seas",
      duration: 210,
      reference: "Rahmân 55:19-20",
      subtitle: ["Berzah; iki şey arasındaki perde, engel demektir.", "Kur'an bu kelimeyi birbirine karışmayan iki deniz için de kullanır."],
    },
    { kind: "veil", duration: 210, subtitle: ["Ölümle birlikte bu perdenin öbür tarafına geçeriz.", "Ve geri dönüş yoktur."] },
    {
      kind: "ayah",
      duration: 270,
      reference: "MÜ'MİNÛN SURESİ · 99-100",
      arabic: "وَمِنْ وَرَائِهِمْ بَرْزَخٌ إِلَىٰ يَوْمِ يُبْعَثُونَ",
      meal: "Onların önünde, tekrar diriltilecekleri güne kadar bir berzah vardır.",
      subtitle: ["Ölen kişi 'Rabbim, beni geri gönder' der.", "Ama önlerinde, diriltilecekleri güne kadar bir berzah vardır."],
    },
    { kind: "hourglass", duration: 150, note: "kıyamete kadar…", subtitle: ["Kıyamete kadar sürecek bir bekleyiş başlar."] },
    {
      kind: "doors",
      duration: 300,
      left: { label: "NİMET", reference: "Bakara 2:154", text: "Onlar diridirler", at: 20 },
      right: { label: "AZAP", reference: "Mü'min 40:46", text: "Sabah akşam ateşe sunulurlar", at: 190 },
      subtitle: [
        "Bu bekleyiş herkes için aynı değildir.",
        "Allah yolunda canını verenler için Kur'an 'onlar diridir' der.",
        "Firavun ailesi ise sabah akşam ateşe sunulur.",
      ],
    },
    {
      kind: "room",
      duration: 210,
      poster: { kind: "title", top: "Unutma:", big: ["BERZAH", "BİR BEKLEME", "ODASI"], hand: "Kaydet · Paylaş · Takip et" },
      subtitle: ["Berzah bir bekleme odasıdır.", "Nasıl bekleyeceğimizi ise bugün seçiyoruz."],
    },
  ],
};
