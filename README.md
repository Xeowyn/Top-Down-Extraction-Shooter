# Mousehunt: Extraction

A game where you play as a mouse. You sneak into a house, grab loot, fight off bugs and other mice, and then escape before you get killed. It's made with plain HTML, CSS, and JavaScript — no game engine, nothing to install or build.

## Play it now

**[xeowyn.github.io/Top-Down-Extraction-Shooter](https://xeowyn.github.io/Top-Down-Extraction-Shooter/)** — no download, just click the link.

## Running it yourself

You don't need to install anything.

**Easiest way:**

1. Download or clone this repo
2. Open `index.html` in your browser

**Better way (some browsers block local files from working right):**

```bash
git clone https://github.com/Xeowyn/Top-Down-Extraction-Shooter.git
cd Top-Down-Extraction-Shooter
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Controls

| Action | Key |
|---|---|
| Move | WASD |
| Shoot | Left Click |
| Melee | Right Click |
| Dash | Space |
| Swap weapons | Q / Scroll |
| Throw grenade | G |
| Interact | E |
| Reload | R |
| Pause | Esc |

## How to play

1. On the main menu (`index.html`), type a name for your mouse and hit Play
2. You start in the **Base** — buy weapons, upgrades, and supplies here
3. Pick a level and fight your way through it, picking up money and materials
4. Find a mouse hole and escape before you die (if you die, you only keep 10% of what you earned that run)
5. Go back to base, spend what you earned, then do it again
6. Check the [Highscores](highscores.html) page to see your best runs

## What's in each file

- `index.html` — the main menu / start screen
- `base.html` — the base: shop, upgrades, pick a level
- `game.html` — the actual gameplay, drawn on a Canvas
- `highscores.html` — shows your best past runs
- `db.js` — saves your runs and highscores. Uses [sql.js](https://sql.js.org/) (a real SQLite database that runs in the browser) and stores everything in `localStorage`
- `GAME_PLAN.md` — the design doc, kept up to date as ideas change
