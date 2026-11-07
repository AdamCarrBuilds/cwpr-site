# Center for World Philosophy and Religion: website

The one-page site for the Center for World Philosophy and Religion: hero, the question and gallery, the Evolution story, The Project, The Movement, and the invitation. Plain HTML, CSS and JavaScript: no build step, no framework.

**Why:** it grew out of a set of design concepts; this repo holds the chosen one (concept 05.4) so anyone can edit it and see the change live.

Built by Adam Carr with Claude, November 2026. Owned by Adam Carr (GitHub `AddyCarr`), shared with Edward.

## Status

| Part | State |
|---|---|
| Site | ✅ Live at https://cwpr-site.vercel.app |
| Auto-deploy | ✅ Every push to `main` publishes to that address within about a minute |
| Real links (`/vision/...`, `/ideas/...`) | ⏳ Point to pages that do not exist yet |

## How it works

```
edit files ──> git push to main ──> Vercel builds (just copies the files) ──> https://cwpr-site.vercel.app
```

- **Scroll motion** is in `main.js` (no library apart from Lenis smooth scrolling, loaded from unpkg). It respects "reduce motion".
- **The logo animation** in The Solution is `logo-motion.js` (GSAP, loaded from jsDelivr by that file).
- **Colours and type** come from `ds/tokens.css` (Navy `#3d5a80`, Coral `#ee6c4d`, Ink `#2c2c2c`; Newsreader and Inter from Google Fonts).

## Files

| File | Holds |
|---|---|
| `index.html` | All the copy and structure |
| `styles.css` | All the layout and styling |
| `main.js`, `logo-motion.js` | Scroll motion and the logo animation |
| `img/` | Photos, already cropped and compressed. Gallery plates are `g-*.jpg` (4:5, faces centred) |
| `ds/` | Brand tokens and the CSS reset (`modern-normalize`) |

## Day to day

- **See it locally:** in this folder run `npx http-server -p 8080` and open http://localhost:8080
- **Change text:** edit `index.html`, commit, push to `main`.
- **Replace a photo:** save it over the file in `img/` at the same proportions, then change the `?v=3` after that file's name in `index.html` to the next number so browsers fetch the new one.
- **Check a deploy:** the Vercel dashboard, project `cwpr-site` (each commit shows a ✓ or ✗ on GitHub too).

## What it touches

| System | Access | Managed where |
|---|---|---|
| GitHub `AddyCarr/cwpr-site` | Public to read; pushing needs collaborator access from Adam | github.com repo Settings → Collaborators |
| Vercel project `cwpr-site` | Adam's Vercel account (`addycarr`, hobby plan) | vercel.com dashboard |
| Google Fonts, unpkg (Lenis), jsDelivr (GSAP) | Public, no keys | Linked from `index.html` / `logo-motion.js` |

## Known gaps

- Menu and footer links go to pages that are not built yet.
- The original photo files and crop settings live on Adam's computer (`Photos/05.4-site-images`), not in this repo.

## Decisions (2026-11-07)

- **Plain files, not a framework:** nothing to install or build, so a text edit and a push is all it takes.
- **Only the chosen concept is here:** the other design concepts stay in Adam's working folder so this repo stays small and clear.
- **Public repo:** so it can be shared by link; write access is still by invitation.
