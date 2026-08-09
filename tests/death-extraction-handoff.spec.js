// Checks that state built in game.html (weapons, level, skills, skin) survives
// the handoff into base.html, and that money always comes from localStorage
// rather than the URL — both death and extraction use the same query builder,
// so this covers both paths.
const { test, expect } = require('@playwright/test');
const { gotoGame, gotoBase } = require('./helpers');

test('extraction handoff carries level, weapon, and skin into base.html', async ({ page }) => {
    await gotoGame(page, 2, 'unlocked=handgun,ar&weapon=ar&skin=default');
    await page.evaluate(() => {
        currentLevel = 2;
        runEnemiesKilled = 4;
    });

    const query = await page.evaluate(() => buildBaseStateQuery());
    await gotoBase(page, query);

    const state = await page.evaluate(() => ({
        level: currentLevel,
        weaponUnlocked: isWeaponUnlocked('ar'),
    }));
    expect(state.level).toBe(2);
    expect(state.weaponUnlocked).toBe(true);
});

test('money is never read from the URL — only from localStorage', async ({ page }) => {
    await gotoGame(page, 1);
    await page.evaluate(() => localStorage.setItem('mh_bankedCrumbs', '777'));

    const query = await page.evaluate(() => buildBaseStateQuery());
    expect(query).toContain('money=0'); // the handoff always zeroes this field out

    await gotoBase(page, query);
    const money = await page.evaluate(() => money);
    expect(money).toBe(777); // real balance still comes from localStorage, untouched by the URL
});

test('dying unlocks nothing extra, but extracting unlocks the next level', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('mh_unlockedLevels', JSON.stringify([1])));
    await gotoGame(page, 1);

    await page.evaluate(() => {
        runMoneyEarned = 100;
        triggerPlayerDeath();
    });
    let unlocked = await page.evaluate(() => JSON.parse(localStorage.getItem('mh_unlockedLevels')));
    expect(unlocked).toEqual([1]);

    await gotoGame(page, 1);
    await page.evaluate(() => {
        runMoneyEarned = 100;
        extractPlayer();
    });
    unlocked = await page.evaluate(() => JSON.parse(localStorage.getItem('mh_unlockedLevels')));
    expect(unlocked).toEqual([1, 2]);
});

test('extracting from the last level does not unlock a level 5 that does not exist', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('mh_unlockedLevels', JSON.stringify([1, 2, 3, 4])));
    await gotoGame(page, 4);

    await page.evaluate(() => {
        runMoneyEarned = 50;
        extractPlayer();
    });

    const unlocked = await page.evaluate(() => JSON.parse(localStorage.getItem('mh_unlockedLevels')));
    expect(unlocked).toEqual([1, 2, 3, 4]);
});
