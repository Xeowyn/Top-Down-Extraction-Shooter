// Simulates a tampered/corrupted save (someone editing localStorage by hand,
// or a bad write from an older version of the game) and checks the game
// degrades gracefully instead of crashing or bricking the save.
const { test, expect } = require('@playwright/test');

test('base.html does not crash when mh_unlockedSkins is invalid JSON', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.addInitScript(() => {
        localStorage.setItem('mh_unlockedSkins', 'not valid json{{{');
    });
    await page.goto('/base.html');
    await page.waitForFunction(() => typeof player !== 'undefined' && typeof gameState !== 'undefined');

    expect(errors).toEqual([]);
    const unlockedSkins = await page.evaluate(() => unlockedSkins);
    expect(unlockedSkins).toContain('default');
});

test('base.html does not crash when mh_weaponLevels / mh_blueprints are invalid JSON', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.addInitScript(() => {
        localStorage.setItem('mh_weaponLevels', '{broken');
        localStorage.setItem('mh_blueprints', '[not json');
    });
    await page.goto('/base.html');
    await page.waitForFunction(() => typeof player !== 'undefined' && typeof gameState !== 'undefined');

    expect(errors).toEqual([]);
    expect(await page.evaluate(() => loadWeaponLevels())).toEqual({});
    expect(await page.evaluate(() => loadBlueprints())).toEqual(['handgun']);
});

test('base.html does not crash when mh_unlockedLevels is invalid JSON', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.addInitScript(() => {
        localStorage.setItem('mh_unlockedLevels', '{{{not json');
    });
    await page.goto('/base.html');
    await page.waitForFunction(() => typeof player !== 'undefined' && typeof gameState !== 'undefined');

    expect(errors).toEqual([]);
});

test('game.html does not crash when mh_unlockedLevels is invalid JSON', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.addInitScript(() => {
        localStorage.setItem('mh_unlockedLevels', '{{{not json');
    });
    await page.goto('/game.html?level=1');
    await page.waitForFunction(() => typeof player !== 'undefined' && typeof gameState !== 'undefined');

    // Extraction touches mh_unlockedLevels — make sure that path is safe too.
    await page.evaluate(() => {
        runMoneyEarned = 50;
        extractPlayer();
    });
    expect(errors).toEqual([]);
});

test('corrupted mh_bankedCrumbs on base.html loads as 0, not NaN', async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('mh_bankedCrumbs', 'garbage');
    });
    await page.goto('/base.html');
    await page.waitForFunction(() => typeof player !== 'undefined' && typeof gameState !== 'undefined');

    const money = await page.evaluate(() => money);
    expect(Number.isFinite(money)).toBe(true);
    expect(money).toBe(0);
});

test('corrupted mh_scraps / mh_parts load as 0, not NaN', async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('mh_scraps', 'xx');
        localStorage.setItem('mh_parts', 'yy');
    });
    await page.goto('/base.html');
    await page.waitForFunction(() => typeof player !== 'undefined' && typeof gameState !== 'undefined');

    const materials = await page.evaluate(() => loadMaterials());
    expect(materials).toEqual({ scraps: 0, parts: 0 });
});
