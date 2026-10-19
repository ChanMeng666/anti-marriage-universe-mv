<div align="center">

# Anti-Marriage Universe · Music Videos

**Three music videos drawn entirely in code, each in a different style: red paper-cut, 80s cel anime and risograph print, rendered frame by frame in headless Chromium.**

</div>

## The films

### Warrior Ah Hua · 战士阿花

<!-- FILM: warrior-ah-hua · 16:9, 3:59 — Chan uploads the video here in GitHub's web editor -->

▶ Watch on YouTube: https://youtu.be/GS_eawacEVs

### Drifter Ah Fa · 浪子阿发

<!-- FILM: drifter-ah-fa · 16:9, 4:55 — Chan uploads the video here in GitHub's web editor -->

▶ Watch on YouTube: https://youtu.be/btSFv9OVoDc

### The Best Strangers · 最佳路人

<!-- FILM: the-best-strangers · 16:9, 5:55 — Chan uploads the video here in GitHub's web editor -->

▶ Watch on YouTube: https://youtu.be/V5X91IMEmiw

## How it's made

- **Red paper-cut** (`ahua/`): jointed paper rigs, paper texture and light from the Lemo-Opuscar paper-cut engine, Canvas 2D.
- **80s cel anime** (`afa/`): held cels, colour-model changes and a WebGL2 tape/CRT pass over Canvas 2D drawings.
- **Risograph print** (`passerby/`): one Canvas 2D plate per ink, printed by a WebGL2 shader with misregistration and halftone.
- **Cut to the song.** librosa beat grid and faster-whisper word timings, aligned to the official lyric sheet; every cut and hit sits on the grid.
- **Deterministic.** Each film is a page exposing `window.render(t)`; frames render in any order, then ffmpeg muxes the untouched song at −14 LUFS.
- No image or video generation model is used for the picture. Songs by Chan Meng, made with Suno.

## Make your own

Needs Node 20+, ffmpeg, Python 3.11+, and a local clone of [Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) with its packages installed (its render tools are not in this repo). The songs are in `shared/audio/`. From a POSIX shell (Git Bash on Windows):

```sh
LIB=/path/to/lemo-opuscar sh ahua/build.sh       # or afa/build.sh, passerby/build.sh
```

## Licence

Code: MIT ([LICENSE](LICENSE)). Films, songs, images and other media made by Chan Meng: CC BY 4.0 ([LICENSE-MEDIA.md](LICENSE-MEDIA.md)). Excluded and under their own licences: the engine modules from [Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) (MIT, LemoLab) and the fonts (SIL OFL 1.1), as listed in each film's `CREDITS`.

More detail: [docs/overview.md](docs/overview.md)
