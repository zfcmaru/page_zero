# CLAUDE.md

Project context for Claude Code working in this repo.

## What this is

`page_zero` is ZFC Works' personal site and experimental playground, deployed via GitHub Pages at `zfcmaru.github.io/page_zero`. It is a static site — plain HTML / CSS / vanilla JS, no build step, no framework, no bundler. Anything committed to `main` goes live in a few minutes.

The main experiment inside this repo is **Ocean Park**, a browser-based Visual Novel with a sailing minigame, living at `vn/`. It uses the author's own illustrations and follows a strict PC-98 / 90s Japanese console aesthetic.

## Repo layout

```
page_zero/
├── index.html              # landing page
├── assets/css/             # shared CSS for the site
├── art/                    # site illustrations
├── blog/                   # blog posts
└── vn/                     # Ocean Park VN
    ├── index.html          # VN engine (HTML + inline CSS + inline JS)
    ├── story.js            # narrative data: SCRIPT, CHOICES, CHARACTERS, SPRITES
    ├── physics.test.js     # Node test for boat physics
    └── art/                # VN sprites and backgrounds
```

## Visual identity — non-negotiable

Ocean Park's interface follows a PC-98 / console retrô look. Do not drift from this palette or break the grammar:

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
- Branch names: `claude/<feature-slug>` when Claude Code is authoring.
- Prefer `str_replace` for surgical edits over full file rewrites when refining existing code.
- Do not introduce dependencies (npm packages) unless explicitly asked. Husky is the only dev dependency.

## Deploy

GitHub Pages auto-deploys from `main` on merge. Takes 1–5 minutes. No manual step.
