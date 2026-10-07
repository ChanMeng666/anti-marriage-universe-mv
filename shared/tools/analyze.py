"""Song analysis for the MVs: word-level transcription (faster-whisper) and a beat grid (librosa).

usage: python analyze.py <song.mp3> <out_dir> [--model large-v3]
writes <out_dir>/<name>.words.json  (segments with word timestamps, as heard)
       <out_dir>/<name>.beats.json  (tempo, beat times, downbeat guess, RMS envelope at 10 Hz)
"""
import json
import sys
from pathlib import Path

import numpy as np


def beats(src, out):
    import librosa
    y, sr = librosa.load(src, sr=22050, mono=True)
    tempo, frames = librosa.beat.beat_track(y=y, sr=sr, units='frames')
    times = librosa.frames_to_time(frames, sr=sr)
    onset = librosa.onset.onset_strength(y=y, sr=sr)
    # downbeat guess: the phase (0..3) whose beats carry the most low-band energy
    S = np.abs(librosa.stft(y, n_fft=2048, hop_length=512))
    low = S[:12].sum(axis=0)
    phase = int(np.argmax([low[frames[p::4]].mean() for p in range(4)]))
    hop = sr // 10
    rms = [float(np.sqrt(np.mean(y[i:i + hop] ** 2))) for i in range(0, len(y) - hop, hop)]
    json.dump({
        'dur': round(len(y) / sr, 3),
        'tempo': round(float(np.atleast_1d(tempo)[0]), 2),
        'beats': [round(float(t), 3) for t in times],
        'downbeat_phase': phase,
        'onset_at_beats': [round(float(onset[f]), 2) for f in frames],
        'rms10': [round(v, 4) for v in rms],
    }, open(out, 'w', encoding='utf-8'), ensure_ascii=False)
    print('beats', out, 'tempo', tempo, 'n', len(times))


def words(src, out, model_name, prompt):
    from faster_whisper import WhisperModel
    model = WhisperModel(model_name, device='cpu', compute_type='int8', cpu_threads=10)
    import librosa
    audio, _ = librosa.load(src, sr=16000, mono=True)   # decode here: faster-whisper's PyAV call breaks on new PyAV
    segs, info = model.transcribe(audio, language='zh', word_timestamps=True, vad_filter=False,
                                  initial_prompt=prompt, condition_on_previous_text=False, beam_size=5)
    res = []
    for s in segs:
        res.append({'t0': round(s.start, 2), 't1': round(s.end, 2), 'text': s.text.strip(),
                    'words': [{'t0': round(w.start, 2), 't1': round(w.end, 2), 'w': w.word} for w in (s.words or [])]})
        print(f'{s.start:7.2f} {s.end:7.2f} {s.text.strip()}', flush=True)
        json.dump(res, open(str(out) + '.partial', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)   # survives a crash
    json.dump(res, open(out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    src, out_dir = sys.argv[1], Path(sys.argv[2])
    model_name = sys.argv[sys.argv.index('--model') + 1] if '--model' in sys.argv else 'large-v3'
    prompt = open(sys.argv[sys.argv.index('--prompt') + 1], encoding='utf-8').read() if '--prompt' in sys.argv else None
    name = Path(src).stem
    out_dir.mkdir(parents=True, exist_ok=True)
    if not (out_dir / f'{name}.beats.json').exists():
        beats(src, out_dir / f'{name}.beats.json')
    words(src, out_dir / f'{name}.words.json', model_name, prompt)
