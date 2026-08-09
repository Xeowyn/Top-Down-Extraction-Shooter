# Top-Down Extraction Shooter — Game Plan

> This is the design doc. Update it whenever the plan changes.
> Built with: plain HTML5 Canvas and JavaScript — no game engine.

---

## The Big Idea

An extraction shooter that's easy to pick up but hard to master. You play as a **mouse** sneaking through a house, grabbing money and materials, fighting off roaches and rival rodents, and getting out safely through **mouse holes in the walls**.

The vibe is **fun and charming**, not scary or gross — hand-drawn art, bright colors, lots of action. It should feel good to grind and satisfying to get better at.

---

## Art Style

- **Hand-drawn and charming** — thick outlines, warm colors, slightly wobbly shapes
- Not violent — enemies poof away or ragdoll, no blood
- Each level has its own colorful look
- Player: a small brown mouse with ears, a backpack, holding weapons
- Enemies: cockroaches, rival mice, rats — each one easy to tell apart by silhouette
- UI: looks like a notebook/sketchbook page
- Art needs to be sourced from somewhere (itch.io, OpenGameArt) or hand-drawn

---

## Core Loop

1. Start in the **Base** (the mouse burrow) — buy gear, mods, skills, and supplies
2. Pick a **Level** to sneak into
3. Move through the level, fight enemies, grab **money and materials**
4. Find a **mouse hole** in a wall and escape through it
5. Bring your loot back to base — upgrade, unlock stuff, then go again
6. If you die: you lose 90% of what you earned that run, but keep 10%

**Easy to pick up:** clear goals, gentle early levels, controls that make sense right away
**Hard to master:** lots of enemy types, limited space for gear, tough risk/reward choices, boss rooms, hazards

---

## Levels (4 Total)

### Level 1 — The House *(Starting level, easiest)*
- Inside a home: kitchen, living room, hallway, bathroom
- Obstacles: chair legs, table legs, rugs (slow you down), power cords, baseboards
- You can climb up onto **countertops and tables** using ramps/ledges
- Enemies: basic roaches, house mice
- Escape route: mouse holes in the baseboards

### Level 2 — The Basement
- Dark, damp, industrial — pipes, boxes, puddles, exposed wires that hurt you
- Tougher enemies, tighter corridors
- Obstacles: cardboard boxes, pipes, shelves
- New hazard: standing water (slows you down)
- Escape route: mouse holes near the foundation walls

### Level 3 — The Attic
- Dusty, open, cluttered — insulation, old boxes, wooden beams
- You can walk along beams (raised platforms)
- Enemies: rats and big insects
- New hazard: insulation patches (slows you down and does a little damage over time)
- Escape route: gaps in the eaves / mouse holes near the roof edge

### Level 4 — The Yard *(Hardest)*
- Outdoors — grass, garden beds, patio tiles, a garden hose
- The most open level — long sightlines, enemies can flank you
- New hazard: wet grass (slows you down), bird shadows that warn you before an instant-kill strike (dodge in time or die)
- Enemies: every type, plus yard-only ones (ants, beetles)
- Escape route: holes under the fence

---

## Enemies (15 Types)

Most enemies shoot from a distance. Only a few fight up close.

| # | Name | Type | Movement | Attack | Notes |
|---|------|------|----------|--------|-------|
| 1 | House Roach | Ranged | Scurries around | Spits acid blobs (slow arc) | The basic enemy |
| 2 | Big Roach | Ranged | Slow and steady | Charged acid burst (wider shot) | Tanky version |
| 3 | Flying Roach | Ranged | Flies, hovers | Drops acid bombs from above | Ignores obstacles on the ground |
| 4 | House Mouse | Ranged | Walks, strafes | Fires small pellets (fast) | Rival mouse faction |
| 5 | Sniper Mouse | Ranged | Stays put, backs away | Laser-aimed long shot | Hits hard, but you can see it coming |
| 6 | Shield Mouse | Ranged | Slowly advances | Short burst, blocks from the front | You have to flank it |
| 7 | Rat Scout | Ranged | Fast dashes | Quick bursts, then retreats | Very mobile |
| 8 | Rat Bruiser | Melee | Charges at you | Heavy slam | One of the few melee enemies |
| 9 | Rat Gunner | Ranged | Peeks from cover | Heavy suppressing fire | Pins you down from cover |
| 10 | Rat Commander | Ranged | Hangs back | Buffs nearby enemies, shoots sometimes | Kill this one first |
| 11 | Earwig | Ranged | Skitters sideways | Poison spit (damage over time) | Low health but fast |
| 12 | Centipede | Melee | Winds along walls | Multi-segment body, rams you | Rare melee type |
| 13 | Fire Ant | Ranged | Moves in groups | Tiny flame shots | Shows up in swarms |
| 14 | Beetle Tank | Ranged | Slow, armored | Explosive shells | Very tough, turns slowly |
| 15 | Moth | Ranged | Flies erratically | Dust cloud that blinds you briefly | Can fly over obstacles |

---

## Weapons

### Loadout System
- You bring **2 guns** into each run:
  - 1 **Main Weapon** (strong, but limited ammo)
  - 1 **Sidearm** (weaker, backup)
- Swap between them with `Q` or the scroll wheel

### Main Weapons
| Name | Type | Notes |
|------|------|-------|
| Assault Rifle | Ballistic | Already in the game — the default main weapon |
| Shotgun | Ballistic | Already in the game |
| Rifle | Ballistic (hitscan) | Already in the game |
| Flamethrower | Fire | Cone of fire, burns enemies over time, short range |
| Acid Shooter | Chemical | Slow blobs, leaves acid puddles, melts armor |
| Freeze Ray | Cryo | Slows enemies, eventually freezes them solid |
| Crossbow | Ballistic | Quiet (doesn't alert enemies), hits hard, slow to fire |
| SMG | Ballistic | Fires fast, low damage per hit, reloads quickly |
| Grenade Launcher | Explosive | Arcs through the air, area damage on impact |
| Laser Pistol* | Energy | *(future)* Continuous beam, burns through cover |

### Sidearms
| Name | Type | Notes |
|------|------|-------|
| Handgun | Ballistic | Already in the game — the default sidearm |
| Mini Crossbow | Ballistic | Quiet sidearm version |
| Pocket Flamer | Fire | Short-burst flamethrower sidearm |
| Dart Gun | Chemical | Poison dart, damage over time |
| Stun Baton | Electric | Close-range stun weapon *(one of the rare melee options)* |

---

## Weapon Mods

Mods attach to weapons and change how they work.

Each weapon has a few mod slots you unlock over time. You buy mods at the base using materials.

| Mod | Effect |
|-----|--------|
| Expanded Mag | +50% ammo capacity |
| Fast Loader | -30% reload time |
| Hollow Point | +25% damage, but 1 less enemy pierced |
| Piercing Round | Bullets pass through 1 enemy |
| Silencer | Enemies notice you from much farther away less often |
| Incendiary | Bullets set enemies on fire briefly |
| Cryo Round | Bullets slow enemies briefly |
| Scope | +20% range, lets you aim down sights |
| Foregrip | Cuts spread by 40% |
| Drum Mag | 2x ammo, but 40% slower reload |
| Acid Tip | Bullets apply acid damage over time |

---

## Skills

Passive and active abilities you unlock at the base with materials or money.

### Passive Skills
| Skill | Effect |
|-------|--------|
| Nimble | +15% move speed |
| Iron Hide | +25 max HP |
| Scavenger | +15% chance of loot dropping |
| Light Foot | You're quieter — enemies notice you from less far away |
| Quick Hands | -15% weapon swap time |
| Adrenaline Rush | Short speed boost after a kill |
| Tough Paws | -20% damage from falling |
| Pack Rat | +1 grenade slot |
| Keen Eye | Briefly reveals enemy positions when you enter an area |

### Active Skills (on a cooldown, triggered by a key)
| Skill | Effect | Cooldown |
|-------|--------|----------|
| Smoke Cloak | Briefly invisible to enemies | 45s |
| Frenzy | Double fire rate for 5s | 60s |
| Shield Bubble | Blocks the next 3 hits | 90s |
| Rally | Instantly heal 20 HP | 120s |
| Berserk | Melee damage x5 for 8s | 75s |

---

## Grenades / Throwables

You can buy these at the base and bring a limited number into each run.

| Grenade | Effect | Description |
|---------|--------|-------------|
| Fire Grenade | Area fire zone, damage over time | Burning ring lasts 8s |
| Ice Grenade | Area freeze/slow zone | Slows 60%, fully freezes for 3s |
| Smoke Grenade | Area smoke cloud | Enemies inside can't see you; you can move through it freely |
| Healing Aura | Heals you over time in a radius around you | +5 HP/sec for 10s |
| Acid Bomb | Area acid puddle | Melts armor, damage over time |
| Flashbang | Blinds enemies in the area | 4s of them being unable to see |
| EMP | Stuns mechanical/electric enemies | *(for future enemy types)* |

---

## Hazards (Environmental)

| Hazard | Level | Effect |
|--------|-------|--------|
| Rug/Mat | House | Slows you down |
| Table leg | House | Something to hide behind |
| Power cord | House | Trips you (short stumble animation) |
| Wet puddle | Basement | Slows you down |
| Exposed wire | Basement | Touching it hurts |
| Insulation | Attic | Slows you down + minor damage over time |
| Bird shadow | Yard | Warning, then an instant-kill strike (you can dodge if you're fast) |
| Wet grass | Yard | Slows you down |
| Mouse trap | All levels | Instant death, but easy to spot |
| Sticky tape | House | Holds you in place briefly |

---

## Climbing / Elevation

- Counters, tables, and beams are **raised platforms** you can stand on
- You reach them with ramps, ledges, or by climbing an edge (press E near one)
- Being up high means enemies on the floor can't hit you in melee
- Some enemies can also reach high spots (flying or climbing ones)
- Falling from high enough hurts you
- The camera stays top-down, but raised tiles look brighter/outlined so you can tell

---

## Escaping: Mouse Holes

- Instead of an EXIT door, you escape through **mouse holes** chewed into walls/baseboards
- Each map has 2-4 holes, and not all of them are open right away
- Some are blocked by obstacles, or need a key item first
- They look like ragged oval holes with dirt/chew marks around them
- Press `E` near one to escape

---

## Sound Design

Full sound effects are needed for:

- Weapons: each gun needs its own fire, reload, and empty-click sounds
- Enemies: roach skitter, rat chatter, hit/death squeaks and crunches
- Throwables: fire crackle, ice shatter, smoke hiss, healing hum
- Ambience per level: house hum/AC, basement drip, attic wind, yard bugs
- UI: buying upgrades, equipping weapons, extracting successfully, dying
- Hazards: trap snap, wire zap, puddle splash
- Player: footstep sounds for different floors (tile, wood, carpet, grass), dash whoosh
- Victory and death stingers

**Where to get sounds:** Freesound.org, ZapSplat, itch.io audio packs — or generate them on the fly.

---

## Animations

- Player: walking, dashing, reloading, shooting, melee, dying, standing still
- Enemies: walking, attacking, getting hit, dying (poof/scatter — not gory)
- Projectiles: bullets spin and trail, acid blobs wobble, flames flicker
- Hit effects: cartoony flash, floating damage numbers
- Grenade effects: a ring animation for each type (fire = orange shimmer, ice = crystallize, smoke = billow, heal = green pulse)
- Escaping: a small animation of the player squeezing into the mouse hole
- Climbing: player hops up/down a ledge

---

## What Keeps People Playing

- **Randomized maps** each run (same areas, but different obstacle/enemy/loot layout)
- **Random events** mid-run: "pest control spray" forces you to leave early, "crumb trail" spawns a rush of loot
- **Daily challenge runs** with different rules (more enemies, limited ammo, etc.)
- **Enemies get tougher** in ways that feel different, not just "more health"
- **Lots of build variety** from mixing skills and mods
- **Unlockable mouse skins** for hitting milestones

---

## Progression & Economy

- **Money:** drops from enemies, spent on weapons, grenades, and some skills
- **Materials:** rarer drops (scraps, seeds, wire bits), used for weapon mods and advanced skills
- **Upgrades:** persistent — carry over between runs
- **Risk/reward:** harder zones = more loot, more danger

---

## Base Hub — Things to Add

- **Armory:** unlock and mod weapons
- **Skills board:** learn passive/active skills
- **Supply crate:** buy grenades/supplies for your next run
- **Level select door:** pick which of the 4 levels to enter
- **Journal/Codex:** track enemies you've seen, kills, and stats per run

---

## Development Phases

### Phase 1 — Foundation & Feel *(Current Focus)*
- [ ] Re-skin: player becomes a mouse, enemies become roaches/mice, exit becomes mouse holes
- [ ] Hand-drawn/charming art (source it or make it)
- [ ] Sound effects for everything
- [ ] 2-gun loadout system (main + sidearm)
- [ ] Grenade system (fire, ice, smoke, heal)
- [ ] Level 1 redesign (house interior, table legs, mats, climbing)

### Phase 2 — Content Expansion
- [ ] All 15 enemy types built
- [ ] Full weapon list (flamethrower, acid shooter, freeze ray, crossbow, SMG, grenade launcher)
- [ ] All sidearms
- [ ] Weapon mod system
- [ ] Skill system (passive + active)
- [ ] Level 2 (Basement)

### Phase 3 — Depth & Replayability
- [ ] Level 3 (Attic) + Level 4 (Yard)
- [ ] Randomized map layouts
- [ ] Random mid-run events
- [ ] All environmental hazards
- [ ] Full climbing/elevation system
- [ ] Daily challenges

### Phase 4 — Polish
- [ ] Full animation pass
- [ ] Music per level
- [ ] Cosmetics / unlockable skins
- [ ] Journal/Codex
- [ ] Balance pass
- [ ] Performance optimization

---

*Last updated: 2026-08-09*
