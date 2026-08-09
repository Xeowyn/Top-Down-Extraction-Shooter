# Mousehunt: Extraction

A top-down extraction shooter built with vanilla HTML5 Canvas and JavaScript — no engine, no build step. You play as a mouse scavenging dangerous household environments for loot, fighting off roaches and rival rodents, and escaping through mouse holes before you die.

See [`GAME_PLAN.md`](GAME_PLAN.md) for the full design vision, level list, and mechanics.

## How to run it

No installation or build step required — it's plain HTML/JS/CSS.

**Easiest way:**

1. Download or clone this repo
2. Open `index.html` directly in a browser

**Recommended (avoids browser file-access restrictions):**

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

1. From the main menu (`index.html`), enter a mouse name and press Play
2. You start in the **Base** — buy gear, mods, skills, and consumables
3. Choose a level to infiltrate and fight through it, collecting money and materials
4. Find a mouse hole and extract before you die (dying loses 90% of that run's earnings)
5. Return to base, spend your loot, repeat
6. View past runs on the [Highscores](highscores.html) page

## File structure

- `index.html` — main menu / start screen
- `base.html` — base hub (shop, upgrades, level select)
- `game.html` — the core gameplay loop and Canvas rendering
- `highscores.html` — leaderboard of past runs
- `db.js` — local save/highscore storage, backed by [sql.js](https://sql.js.org/) (SQLite compiled to WebAssembly) persisted to `localStorage`
- `GAME_PLAN.md` — living design document
