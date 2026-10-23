"""Clean per-scene voice recordings and detect sentence timings from pauses.

Usage:
  python3 scripts/prepare-voice.py <name> <words-per-sentence> <file1> <file2> ...
  words-per-sentence: scenes separated by ",", sentences inside a scene by "+", e.g. 4+4,7,7+10

Writes public/voice/<name>/<n>.mp3 and src/videos/<name>-voice.json:
  [{ "file": "voice/<name>/1.mp3", "duration": 4.1, "sentences": [[start, end], ...] }, ...]
"""
import json
import os
import re
import subprocess
import sys

PAD_START = 0.12
PAD_END = 0.3


def silences(path, noise_db, min_dur):
    out = subprocess.run(
        ["ffmpeg", "-i", path, "-af", f"silencedetect=n={noise_db}dB:d={min_dur}", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    starts = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", out)]
    ends = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", out)]
    return list(zip(starts, ends + [None] * (len(starts) - len(ends))))


def duration(path):
    return float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
        capture_output=True, text=True,
    ).stdout)


def analyse(path, words):
    total = duration(path)
    sil = silences(path, -38, 0.3)
    speech_start = next((e for s, e in sil if s < 0.05 and e), 0.0)
    trailing = [s for s, e in sil if s > speech_start and (e is None or e >= total - 0.5)]
    speech_end = trailing[0] if trailing else total
    # Candidate pauses (fine detection); for each sentence break pick the pause
    # closest to where the word counts say it should be.
    n_sentences = len(words)
    candidates = [
        (s, e) for s, e in silences(path, -33, 0.1)
        if e is not None and s > speech_start + 0.2 and e < speech_end - 0.2
    ]
    total_words = sum(words)
    span = speech_end - speech_start
    pauses = []
    for k in range(1, n_sentences):
        expected = speech_start + span * sum(words[:k]) / total_words
        free = [p for p in candidates if p not in pauses and (not pauses or p[0] > pauses[-1][1])]
        if free:
            best = min(free, key=lambda p: abs((p[0] + p[1]) / 2 - expected))
            pauses.append(best)
        else:
            pauses.append((expected, expected))
    bounds = [speech_start] + [x for p in pauses for x in p] + [speech_end]
    sentences = [(bounds[i * 2], bounds[i * 2 + 1]) for i in range(n_sentences)]
    return speech_start, speech_end, sentences


def main():
    name = sys.argv[1]
    counts = [[int(w) for w in scene.split("+")] for scene in sys.argv[2].split(",")]
    files = sys.argv[3:]
    assert len(counts) == len(files), "one sentence count per file"
    out_dir = os.path.join("public", "voice", name)
    os.makedirs(out_dir, exist_ok=True)
    result = []
    for i, (path, n) in enumerate(zip(files, counts), start=1):
        start, end, sentences = analyse(path, n)
        cut_from = max(0.0, start - PAD_START)
        cut_to = end + PAD_END
        target = os.path.join(out_dir, f"{i}.mp3")
        subprocess.run(
            ["ffmpeg", "-v", "error", "-y", "-ss", f"{cut_from:.3f}", "-to", f"{cut_to:.3f}", "-i", path,
             "-af", "highpass=f=80,afftdn=nf=-30,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,"
                    "loudnorm=I=-16:TP=-1.5:LRA=7,afade=t=in:d=0.05",
             "-ar", "44100", "-ac", "1", "-b:a", "160k", target],
            check=True,
        )
        result.append({
            "file": f"voice/{name}/{i}.mp3",
            "duration": round(duration(target), 3),
            "sentences": [[round(s - cut_from, 3), round(e - cut_from, 3)] for s, e in sentences],
        })
        print(f"{i}: {result[-1]['duration']}s sentences={result[-1]['sentences']}")
    with open(os.path.join("src", "videos", f"{name}-voice.json"), "w") as f:
        json.dump(result, f, indent=2)


if __name__ == "__main__":
    main()
