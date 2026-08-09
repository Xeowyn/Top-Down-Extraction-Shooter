// Exercises the real base.html buy/craft/upgrade flow through the same
// handleBaseInteract() code path the player triggers by pressing E next to
// a station — not a reimplementation of the logic, the actual thing.
const { test, expect } = require('@playwright/test');
const { gotoBase } = require('./helpers');

// Moves the player to stand exactly on top of a station so handleBaseInteract() sees it.
// Station arrays are top-level `const`s in base.html, so they aren't reachable
// via window[name] — each supported array gets its own small branch here.
async function standAtStation(page, arrayName, key, value) {
    await page.evaluate(({ arrayName, key, value }) => {
        const arrays = { weaponStations, grenadeStations, modStations, skillStations, levelStations, wardrobeStations };
        const stations = arrays[arrayName];
        const match = stations.find(s => s[key] === value);
        if (!match) throw new Error(`No station found in ${arrayName} where ${key} === ${value}`);
        player.x = match.x + match.width / 2 - player.width / 2;
        player.y = match.y + match.height / 2 - player.height / 2;
    }, { arrayName, key, value });
}

test('crafting a weapon with exactly enough materials deducts them and unlocks it', async ({ page }) => {
    await gotoBase(page);
    await page.evaluate(() => {
        localStorage.setItem('mh_scraps', '10');
        localStorage.setItem('mh_parts', '1');
        localStorage.setItem('mh_blueprints', JSON.stringify(['handgun', 'smg']));
    });
    await standAtStation(page, 'weaponStations', 'id', 'smg');

    const result = await page.evaluate(() => {
        const interacted = handleBaseInteract();
        return {
            interacted,
            unlocked: isWeaponUnlocked('smg'),
            materials: loadMaterials(),
        };
    });

    expect(result.interacted).toBe(true);
    expect(result.unlocked).toBe(true);
    expect(result.materials.scraps).toBe(0);
    expect(result.materials.parts).toBe(0);
});

test('crafting with one scrap short of the cost fails and spends nothing', async ({ page }) => {
    await gotoBase(page);
    await page.evaluate(() => {
        localStorage.setItem('mh_scraps', '9'); // smg costs 10 scraps, 1 part
        localStorage.setItem('mh_parts', '1');
        localStorage.setItem('mh_blueprints', JSON.stringify(['handgun', 'smg']));
    });
    await standAtStation(page, 'weaponStations', 'id', 'smg');

    const result = await page.evaluate(() => {
        const interacted = handleBaseInteract();
        return {
            interacted,
            unlocked: isWeaponUnlocked('smg'),
            materials: loadMaterials(),
        };
    });

    expect(result.interacted).toBe(false);
    expect(result.unlocked).toBe(false);
    expect(result.materials.scraps).toBe(9);
    expect(result.materials.parts).toBe(1);
});

test('a crafted weapon stays unlocked after leaving and reloading base.html with no query string', async ({ page }) => {
    await gotoBase(page);
    await page.evaluate(() => {
        localStorage.setItem('mh_scraps', '20');
        localStorage.setItem('mh_parts', '2');
        localStorage.setItem('mh_blueprints', JSON.stringify(['handgun', 'ar']));
    });
    await standAtStation(page, 'weaponStations', 'id', 'ar');
    await page.evaluate(() => handleBaseInteract());
    expect(await page.evaluate(() => isWeaponUnlocked('ar'))).toBe(true);

    // Simulate opening base.html straight from the main menu (index.html sends
    // no query string at all) instead of round-tripping through game.html.
    await gotoBase(page);
    expect(await page.evaluate(() => isWeaponUnlocked('ar'))).toBe(true);
});

test('buying a grenade at exactly your full balance leaves money at 0, never negative', async ({ page }) => {
    await gotoBase(page);
    await page.evaluate(() => localStorage.setItem('mh_bankedCrumbs', '30')); // grenadeBaseCost is 30
    await gotoBase(page); // reload so `money` picks up the balance we just set
    await standAtStation(page, 'grenadeStations', 'type', 'fire');

    const result = await page.evaluate(() => {
        const interacted = handleBaseInteract();
        return { interacted, money, storedMoney: localStorage.getItem('mh_bankedCrumbs') };
    });

    expect(result.interacted).toBe(true);
    expect(result.money).toBe(0);
    expect(result.storedMoney).toBe('0');
});

test('buying a grenade with no money fails and does not go negative', async ({ page }) => {
    await gotoBase(page);
    await page.evaluate(() => localStorage.setItem('mh_bankedCrumbs', '5'));
    await gotoBase(page);
    await standAtStation(page, 'grenadeStations', 'type', 'fire');

    const result = await page.evaluate(() => {
        const interacted = handleBaseInteract();
        return { interacted, money };
    });

    expect(result.interacted).toBe(false);
    expect(result.money).toBe(5);
    expect(result.money).toBeGreaterThanOrEqual(0);
});

test('mashing the interact key at a grenade station cannot buy more than the wallet affords', async ({ page }) => {
    await gotoBase(page);
    // Enough for exactly one grenade, not two.
    await page.evaluate(() => localStorage.setItem('mh_bankedCrumbs', '30'));
    await gotoBase(page);
    await standAtStation(page, 'grenadeStations', 'type', 'fire');

    const result = await page.evaluate(() => {
        // Simulate rapid repeated key presses on the same station.
        const results = [handleBaseInteract(), handleBaseInteract(), handleBaseInteract()];
        return { results, money };
    });

    expect(result.results[0]).toBe(true);
    expect(result.results[1]).toBe(false);
    expect(result.results[2]).toBe(false);
    expect(result.money).toBeGreaterThanOrEqual(0);
});

test('weapon upgrades cannot go past level 5', async ({ page }) => {
    await gotoBase(page);
    await page.evaluate(() => {
        localStorage.setItem('mh_weaponLevels', JSON.stringify({ handgun: 5 }));
        localStorage.setItem('mh_scraps', '999');
        localStorage.setItem('mh_parts', '999');
    });
    await standAtStation(page, 'weaponStations', 'id', 'handgun');

    const result = await page.evaluate(() => {
        handleBaseInteract(); // handgun is already unlocked, at max level — should equip, not upgrade
        return loadWeaponLevels().handgun;
    });

    expect(result).toBe(5);
});

test('standing at a sidearm station interacts with that sidearm, not an overlapping main weapon above it', async ({ page }) => {
    await gotoBase(page);
    await page.evaluate(() => {
        localStorage.setItem('mh_scraps', '999');
        localStorage.setItem('mh_parts', '999');
        localStorage.setItem('mh_blueprints', JSON.stringify(baseWeaponIds));
    });

    const result = await page.evaluate(() => {
        const smgStation = weaponStations.find(s => s.id === 'smg' && s.row === 'sidearm');
        const pcx = smgStation.x + smgStation.width / 2;
        const pcy = smgStation.y + smgStation.height / 2;
        // The station rows sit close enough together that a naive "first in range"
        // search can find a main-weapon station instead of the sidearm you're standing at.
        const found = findNearbyStation(weaponStations, pcx, pcy, weaponInteractRange);
        return { foundId: found ? found.id : null, foundRow: found ? found.row : null };
    });

    expect(result.foundId).toBe('smg');
    expect(result.foundRow).toBe('sidearm');
});
