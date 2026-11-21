# Hayase extensions (fork)

Forked from:
- `https://exten.pages.dev/multi/index.json`
- `https://exten.pages.dev/nzb/index.json`
- `https://github.com/anh9000/anitorrent` (Nyaa, AnimeTosho, Seadex, SubsPlease, Yameii, ToonsHub)

## Contents
- `multi/index.json` + `multi/*.js`: torrent/multi-sub extensions
- `nzb/index.json` + `nzb/*.js`: NZB extensions
- `data/anilist-to-anidb.json`: AniList→AniDB mapping used by the AnimeTosho extension
- `*/index.upstream.json`: original upstream manifests at fork time

## Usage
Manifests currently point `code`/`update` to:
`https://raw.githubusercontent.com/Apfelchorle/anesa-exten/master`

If you host this repo elsewhere, replace that base URL in `multi/index.json` and `nzb/index.json`.

Upstream source: https://exten.pages.dev/
