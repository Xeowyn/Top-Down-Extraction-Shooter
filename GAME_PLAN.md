# Top-Down Extraction Shooter — Game Plan

> Living design document. Update this as the vision evolves.
> Tech stack: Vanilla HTML5 Canvas / JavaScript — no engine required.

---

## Vision

An easy-to-get-into, hard-to-master extraction shooter. You play as a **mouse** navigating dangerous household environments, scrounging for materials and money, fighting off roaches and rival rodents, and escaping safely through **mouse holes in the walls**.

The tone is **charming and fun** — hand-drawn art style, colorful, exciting, lots going on — not grim or gory. Rewarding to grind, fun to master.

---

## Art Style

- **Hand-drawn, charming aesthetic** — thick outlines, warm colors, slightly wobbly shapes
- Not violent-looking — enemies ragdoll/poof away, no blood
- Colorful per-level palette
- Player: small brown mouse with ears, backpack, holding weapons
- Enemies: cockroaches, rival mice, rats — each with distinct silhouettes
- UI: sketch/notebook paper feel
- Sprites to be sourced or created — search itch.io, OpenGameArt, or hand-draw in a pixel/vector tool

---

## Core Loop

1. Start in the **Base** (mouse burrow) — buy gear, mods, skills, consumables
2. Choose a **Level** to infiltrate
3. Navigate the level, fight enemies, collect **money + materials**
4. Find a **mouse hole** in the wall and escape to extract safely
5. Return to base with loot — upgrade, unlock, repeat
6. Death = lose 90% of run earnings (keep 10%)

**Easy to get into:** Clear objectives, forgiving early levels, intuitive controls
**Hard to master:** Enemy variety, limited loadout space, risk/reward depth decisions, boss rooms, hazards

---

## Levels (4 Total)

### Level 1 — The House *(Starting Level / Easiest)*
- Interior of a home: kitchen, living room, hallway, bathroom
- Obstacles: chair legs, table legs, mats/rugs (slow player), power cords, baseboards
- Verticality: player can climb onto **countertops and tables** via ramps/ledges
- Enemy types: basic roaches, house mice
- Extraction: mouse holes in the baseboards

### Level 2 — The Basement
- Dark, damp, industrial feel — pipes, boxes, water puddles (slow), exposed wires (damage hazard)
- More elite enemies, tighter corridors
- Obstacles: cardboard boxes, pipes, shelf units
- New hazard: standing water (slows movement)
- Extraction: mouse holes near foundation walls

### Level 3 — The Attic
- Dusty, open, cluttered — insulation patches, old boxes, wooden beams
- Verticality: beams the player can walk along (raised platforms)
- Enemies: rats and large insects
- New hazard: insulation patches (slow + minor damage over time)
- Extraction: gaps in the eaves / mouse holes near the roof edge

### Level 4 — The Yard *(Hardest)*
- Outdoor environment — grass, garden beds, patio tiles, a garden hose
- Most open layout — long sightlines, flanking enemies
- New hazard: wet grass patches (slow), bird shadow warnings (instant-kill AoE, dodge in time)
- Enemies: all types + exclusives (ants, beetles)
- Extraction: holes under the fence

---

## Enemies (15 Types)

Most enemies are **ranged**. Very few melee.

| # | Name | Type | Movement | Attack | Notes |
|---|------|------|----------|--------|-------|
| 1 | House Roach | Ranged | Scurry (erratic) | Spits acid blobs (slow arc) | Basic enemy |
| 2 | Big Roach | Ranged | Slow + steady | Charged acid burst (wider shot) | Tank variant |
| 3 | Flying Roach | Ranged | Airborne, hovering | Drops acid bombs from above | Ignores ground obstacles |
| 4 | House Mouse | Ranged | Walk + strafe | Fires small pellets (fast) | Rival faction |
| 5 | Sniper Mouse | Ranged | Stationary + retreat | Laser-aimed long-range shot | High damage, telegraphed |
| 6 | Shield Mouse | Ranged | Slow advance | Short-range burst, blocks front | Must be flanked or flanked-shot |
| 7 | Rat Scout | Ranged | Fast dash-strafe | Quick burst fire, retreats | Very mobile |
| 8 | Rat Bruiser | Melee | Charge | Heavy slam | One of very few melee |
| 9 | Rat Gunner | Ranged | Cover-peek | Heavy minigun suppression | Suppresses player from cover |
| 10 | Rat Commander | Ranged | Hangs back | Buffs nearby enemies, fires intermittently | Priority target |
| 11 | Earwig | Ranged | Skitter sideways | Poison spit (DoT) | Low HP but fast |
| 12 | Centipede | Melee | Winding path | Multi-segment body, ramming | Rare melee; wall-hugging pathing |
| 13 | Fire Ant | Ranged | Swarm (group) | Tiny flame shots | Spawn in large groups |
| 14 | Beetle Tank | Ranged | Slow + armored | Explosive shells | Very tanky, slow to turn |
| 15 | Moth | Ranged | Erratic flight | Dust cloud (blinds player briefly) | Flies over obstacles |

---

## Weapons

### Loadout System
- Player brings **2 guns** into each run:
  - 1 **Main Weapon** (high power, limited ammo)
  - 1 **Sidearm** (lighter, backup)
- Swap between them with `Q` or scroll wheel

### Main Weapons
| Name | Type | Notes |
|------|------|-------|
| Assault Rifle | Ballistic | Already in game — baseline main |
| Shotgun | Ballistic | Already in game |
| Rifle | Ballistic (hitscan) | Already in game |
| Flamethrower | Fire | Continuous cone, sets enemies on fire (DoT), limited range |
| Acid Shooter | Chemical | Slow blob projectiles, AoE acid puddles on impact, melts armor |
| Freeze Ray | Cryo | Slows and eventually freezes enemies solid |
| Crossbow | Ballistic | Silent (doesn't alert enemies), high damage, slow fire |
| SMG | Ballistic | High fire rate, low damage per bullet, fast reload |
| Grenade Launcher | Explosive | Arcing projectile, AoE impact |
| Laser Pistol* | Energy | *(future)* Continuous beam, burns through cover |

### Sidearms
| Name | Type | Notes |
|------|------|-------|
| Handgun | Ballistic | Already in game — baseline sidearm |
| Mini Crossbow | Ballistic | Silent sidearm variant |
| Pocket Flamer | Fire | Short-burst flamethrower sidearm |
| Dart Gun | Chemical | Poison dart, DoT sidearm |
| Stun Baton | Electric | Close-range melee/energy stun *(rare melee option)* |

---

## Weapon Mods

New system — mods attach to weapons and modify their behavior.

Each weapon has **mod slots** (unlockable). Mods are bought in the base with materials.

| Mod | Effect |
|-----|--------|
| Expanded Mag | +50% ammo capacity |
| Fast Loader | -30% reload time |
| Hollow Point | +25% damage, -1 piercing |
| Piercing Round | Bullets pass through 1 enemy |
| Silencer | Greatly reduces enemy alert radius |
| Incendiary | Bullets apply brief burn (DoT) |
| Cryo Round | Bullets apply brief slow |
| Scope | +20% effective range, ADS zoom |
| Foregrip | Reduces spread by 40% |
| Drum Mag | 2x ammo, +40% reload time |
| Acid Tip | Bullets apply acid DoT |

---

## Skills

New system — passive and active abilities unlocked in the base with materials/money.

### Passive Skills
| Skill | Effect |
|-------|--------|
| Nimble | +15% move speed |
| Iron Hide | +25 max HP |
| Scavenger | +15% loot drop chance |
| Light Foot | Movement makes less noise (smaller enemy alert radius) |
| Quick Hands | -15% weapon swap time |
| Adrenaline Rush | After a kill, brief speed boost |
| Tough Paws | -20% fall damage from heights |
| Pack Rat | +1 grenade slot |
| Keen Eye | Reveals enemy positions briefly when entering area |

### Active Skills (cooldown-based, triggered by key)
| Skill | Effect | Cooldown |
|-------|--------|----------|
| Smoke Cloak | Brief invisibility to enemies | 45s |
| Frenzy | Double fire rate for 5s | 60s |
| Shield Bubble | Absorb next 3 hits | 90s |
| Rally | Restore 20 HP instantly | 120s |
| Berserk | Melee damage x5 for 8s | 75s |

---

## Grenades / Throwables

Player can **buy and bring** consumables into each run. Equip in base, limited slots.

| Grenade | Effect | Description |
|---------|--------|-------------|
| Fire Grenade | AoE fire zone, DoT on enemies | Burning ring lasts 8s |
| Ice Grenade | AoE freeze/slow zone | Slows 60%, full freeze 3s |
| Smoke Grenade | AoE smoke cloud | Enemies inside cannot see player; player can move freely through it |
| Healing Aura | Player-centered healing field | +5 HP/sec for 10s in radius |
| Acid Bomb | AoE acid puddle | Melts enemy armor, DoT |
| Flashbang | Blinds enemies in radius | 4s disorientation |
| EMP | Stuns mechanical/electric enemies | *(for future enemy types)* |

---

## Hazards (Environmental)

| Hazard | Level | Effect |
|--------|-------|--------|
| Rug/Mat | House | Slows movement |
| Table leg | House | Cover obstacle |
| Power cord | House | Trips (brief stumble animation) |
| Wet puddle | Basement | Slows movement |
| Exposed wire | Basement | Touch = damage |
| Insulation | Attic | Slows + minor DoT |
| Bird shadow | Yard | Warning → instant-kill AoE (dodge window) |
| Wet grass | Yard | Slows movement |
| Mouse trap | All | Instant death trap, visible but easy to spot |
| Sticky tape | House | Holds player in place briefly |

---

## Verticality System

- Counters, tables, and beams are **elevated platforms**
- Player reaches them via **ramps, ledges, or climbing edges** (press E near edge)
- Elevated positions give height advantage: enemies on floor can't melee you
- Some enemies can also reach elevated positions (flying, climbing variants)
- Falls from high enough = damage
- Visual: camera stays top-down but elevated tiles are brighter/outlined

---

## Extraction: Mouse Holes

- Replace current EXIT door with **mouse holes** cut into walls/baseboards
- Multiple holes per map (2-4), not all accessible from the start
- Some are blocked by obstacles or require a key item to clear
- Visual: ragged oval hole in the wall with dirt/chewing marks around it
- Interact with `E` when adjacent

---

## Sound Design

Full contextual sound effects needed for:

- Weapon sounds: each gun has unique fire, reload, empty-click sounds
- Enemy sounds: roach skitter, rat chatter, hit/death squeaks/crunches
- Throwable effects: fire crackle, ice shatter, smoke hiss, healing hum
- Ambient per level: house hum/AC, basement drip, attic wind, yard insects
- UI sounds: upgrade purchase, weapon equip, extraction success, death
- Hazard sounds: trap snap, wire zap, puddle splash
- Player sounds: footstep variations (tile, wood, carpet, grass), dash whoosh
- Victory/death stingers

**Sources:** Freesound.org, ZapSplat, itch.io audio packs — or procedural generation for real-time sounds.

---

## Animations

- Player: walk cycle, dash, reload, shoot, melee, death, idle
- Enemies: walk, attack, hit reaction, death (poof/scatter — not gory)
- Projectiles: spin/trail on bullets, blob wobble on acid, flame flicker
- Hit effects: cartoony star flash, number popups for damage
- Grenade effects: expanding ring animations per type (fire = orange shimmer, ice = crystallize, smoke = billow, heal = green pulse)
- Extraction: player squeezes into mouse hole (small animation)
- Elevation: player hops up/down ledge

---

## Replayability Features

- **Randomized maps** per run (same zones, different obstacle/enemy/loot layout)
- **Random events** mid-run: "pest control spray" forces early extraction, "crumb trail" spawns loot rush
- **Daily challenge runs** with modified rules (more enemies, limited ammo, etc.)
- **Enemy scaling** makes higher-difficulty runs feel distinct, not just harder
- **Build variety** from skill + mod combinations — many loadout permutations
- **Unlockable mouse skins/cosmetics** for grinding milestones

---

## Progression & Economy

- **Money:** Drops from enemies, used to buy weapons, grenades, and some skills
- **Materials:** Rare drops (scraps, seeds, wire bits), used for weapon mods and advanced skills
- **Upgrade tree:** Persistent, carries between runs
- **Risk/reward:** Higher-level zones = more loot + more danger

---

## Base Hub Updates

- Add **Armory** section: unlock and mod weapons
- Add **Skills board**: learn passive/active skills
- Add **Supply crate**: buy grenades/consumables for next run
- Add **Level select door**: choose which of 4 levels to enter
- Add **Journal/Codex**: track enemy types seen, kills, stats per run

---

## Development Phases

### Phase 1 — Foundation & Feel *(Current Focus)*
- [ ] Thematic re-skin: player → mouse, enemies → roaches/mice, exit → mouse holes
- [ ] Hand-drawn/charming art sprites (source or create)
- [ ] Sound effects overhaul (contextual audio for all actions)
- [ ] 2-gun loadout system (main + sidearm)
- [ ] Grenade system (fire, ice, smoke, heal)
- [ ] Level 1 map redesign (house interior, table legs, mats, verticality)

### Phase 2 — Content Expansion
- [ ] All 15 enemy types implemented
- [ ] Full weapon roster (flamethrower, acid shooter, freeze ray, crossbow, SMG, grenade launcher)
- [ ] All sidearm options
- [ ] Weapon mod system
- [ ] Skill system (passive + active)
- [ ] Level 2 (Basement)

### Phase 3 — Depth & Replayability
- [ ] Level 3 (Attic) + Level 4 (Yard)
- [ ] Randomized map layouts
- [ ] Random mid-run events
- [ ] Environmental hazards (all types)
- [ ] Full verticality system
- [ ] Daily challenges

### Phase 4 — Polish
- [ ] Full animation pass
- [ ] Music per level
- [ ] Cosmetics / unlockable skins
- [ ] Journal/Codex
- [ ] Balancing pass
- [ ] Performance optimization

---

*Last updated: 2026-03-13*
