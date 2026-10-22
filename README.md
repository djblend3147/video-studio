# Video Studio — Remotion ile kodla animasyon → MP4

## Komutlar
| Komut | Ne yapar |
|---|---|
| `npm run studio` | Tarayıcıda canlı önizleme (Remotion Studio, port 3000) |
| `npm run render` | `HelloWorld` animasyonunu `out/hello.mp4` olarak çıkarır (1920×1080, 30fps) |
| `npm run render:captions` | `public/input.mp4` + `public/input.json` → altyazılı dikey video `out/captioned.mp4` |
| `npm run download -- <url> [isim]` | yt-dlp ile videoyu `public/<isim>.mp4` olarak indirir |
| `npm run setup:whisper` | whisper.cpp'yi derler ve modeli indirir (`WHISPER_MODEL=small` varsayılan) |
| `npm run transcribe -- public/input.mp4 [tr]` | Whisper ile kelime zamanlı altyazı → `public/input.json` |

Herhangi bir kompozisyon: `npx remotion render <Id> out/dosya.mp4 --props='{"title":"Selam"}'`

## Yapı
- `src/Root.tsx` – kompozisyonların listesi (yeni animasyonları buraya ekle)
- `src/HelloWorld.tsx` – örnek animasyon (spring, interpolate, renk geçişi)
- `src/CaptionedVideo.tsx` – TikTok tarzı, kelime vurgulu altyazı
- `scripts/` – whisper kurulumu, transkripsiyon, indirme
- `public/` – girdi medyası (`staticFile()` ile erişilir), `out/` – çıktılar

## Araçlar
- Remotion 4.0.538 (npm), ffmpeg 6.1 (sistem), yt-dlp (`.venv/`), whisper.cpp (`whisper.cpp/`)
- `remotion.config.ts`, varsa yerel Chromium'u kullanır; başka bir tarayıcı için `REMOTION_BROWSER=/yol`.
