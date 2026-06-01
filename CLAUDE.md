# CLAUDE.md

Project context for Claude Code working in this repo.

## What this is

`page_zero` is ZFC Works' personal site and experimental playground, deployed via GitHub Pages at `zfcmaru.github.io/page_zero`. It is a static site — mostly plain HTML / CSS / vanilla JS, no build step, no framework, no bundler. (The one exception is `vn/`, which is now a precompiled Godot 4 HTML5 export — `.wasm` + `.pck` — not editable JS; see Deploy.) See Deploy for which branch actually publishes.

The main experiment inside this repo is **Ocean Park**, a browser-based Visual Novel with a sailing minigame, living at `vn/`. It uses the author's own illustrations and follows a strict PC-98 / 90s Japanese console aesthetic.

## Privacy — non-negotiable

The author's presence in this repo is via **social media handles only** (itch.io, Pixiv, Reddit, TikTok, X, GitHub). Never commit:

- Personal email, phone, address, real name beyond what is already public.
- API keys, tokens, or secrets — Anthropic, OpenAI, GitHub PATs, etc. Even example placeholders must be clearly fictional (`sk-ant-xxx`, `TOKEN_HERE`).
- Anything that could be used to contact the author directly outside the listed social channels.

Audit before each commit:

```bash
grep -rinE "(felipessalvador|@gmail|@googlemail|sk-ant|api[_-]?key)" --include="*.html" --include="*.js" --include="*.css" --include="*.md" --include="*.json" . 2>/dev/null | grep -v node_modules
```

Expected result: empty. If anything matches, fix before committing.

## Repo layout

```
page_zero/
├── index.html              # landing — hub of experiments
├── assets/css/style.css    # shared CSS — PC-98 tokens as :root vars
├── art/                    # site illustrations (never modify)
├── blog/                   # blog posts + index
├── experiments/            # future browser experiments — see experiments/README.md
└── vn/                     # Ocean Park VN (canonical reference for visual grammar)
    ├── index.html          # VN engine entry
    ├── js/                 # modular engine: vn, state, choices, minigame, physics, scene-select, audio, main
    ├── story.js            # narrative data: SCRIPT, CHOICES, CHARACTERS, SPRITES
    ├── scenarios.js        # scene-select entries
    ├── physics.test.js     # Node test for boat physics
    └── art/                # VN sprites and backgrounds
```

## Visual identity — non-negotiable

The whole site follows a PC-98 / console retrô look. Ocean Park (`vn/`) is the canonical reference; landing and blog inherit via shared CSS tokens in `assets/css/style.css`. Do not drift from this palette or break the grammar:

- Background: `#000`
- Borders: `2px solid #fff`
- Panel corners: `border-radius: 8px` (inner viewport `6px`)
- Accent (highlight, cursors, markers): `#f5c542` (yellow)
- Font (dialogue, name, choices, HUD): `'DotGothic16', monospace`
- No `backdrop-filter`, no `rgba` transparencies, no drop shadows, no gradients on panels.
- Text antialiasing disabled: `-webkit-font-smoothing: none`.
- Images render with `image-rendering: pixelated`.

If a new feature needs UI, copy the existing panel grammar (black fill, white 2px border, 8px radius).

## What NOT to touch without explicit instruction

- `tickPhysics()` function — boat physics. Covered by `physics.test.js`. Changing it requires updating tests.
- Blink cycle logic — the character's eye animation pipeline (`blinkCycle`, `startBlinkCycle`, `stopBlinkCycle`, `setSprite`).
- Typewriter logic (`startTypewriter`, `playTypeBeep`, `vnTypeTimer`).
- Narrative data shape in `story.js` — the author edits this manually. Do not reformat. Respect the existing `SCRIPT` / `CHOICES` / `CHARACTERS` / `SPRITES` structure.
- `art/` — never modify or delete illustration assets.

## How to run locally

Static site, no dev server required. Open `vn/index.html` directly, or use any static server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/vn/
```

## Tests

```bash
node vn/physics.test.js
```

Tests must pass before any commit that touches physics. See `.husky/pre-commit`.

## Conventions

- Commit messages in English, imperative, lowercase, short. Example: `refine VN interface: drop character, enlarge name box`.
- Branch names: `claude/<feature-slug>` when Claude Code is authoring; `refact` / similar for broader cross-cutting work.
- Prefer surgical edits over full file rewrites when refining existing code.
- Do not introduce dependencies (npm packages) unless explicitly asked. Husky is the only dev dependency.

## Workflow with Claude Code

This repo is built to be Claude-Code-friendly. Common patterns:

- **Authoring scenes**: edit `vn/story.js` and `vn/scenarios.js` by hand. Do not reformat; respect the existing data shape (`SCRIPT`, `CHOICES`, `CHARACTERS`, `SPRITES`). The author edits these directly; Claude only proposes diffs.
- **New experiment**: `mkdir experiments/<slug>`, drop an `index.html` that imports `../../assets/css/style.css` for the PC-98 tokens. See `experiments/README.md`.
- **No LLM in runtime**: this site never calls an LLM API from the browser. Claude is a dev/authoring assistant only — keeps the site cost-free, key-free, and offline-deployable.
- **Physics changes**: always run `node vn/physics.test.js` before committing. Husky enforces this via `.husky/pre-commit`.
- **Visual changes**: stay within the tokens in `assets/css/style.css`. The canonical reference is `vn/assets/css/vn.css` — copy patterns from there if a new component needs UI.

## Deploy

GitHub Pages publishes from the repo's **default branch, `claude/personal-website-setup-Nprfo`** — NOT from `main`. (Confirm under Settings → Pages, or via the `github-pages` deployments, whose `ref` is this branch.) Pushing to `main` does **not** deploy; the established flow is: land changes on `main`, then **merge `main` into the default branch** (the recurring "Merge pull request … from zfcmaru/main"), which triggers the `pages build and deployment` run. Takes 1–5 minutes.

`vn/` is a Godot HTML5 export. It is produced in the separate Godot project at `/Users/felsal/Desktop/game_dev/projects/ocean_park` (`godot --headless --path . --export-release "Web" build/web/index.html`) and copied in — do not hand-edit the files under `vn/`. The export uses **threads off** so no COOP/COEP headers are needed, and a `.nojekyll` at the repo root keeps Pages from touching the output. A `← back` link to the hub is injected via the export's Head Include.
