// A reviewer flagged two things as bugs/clutter: a semi-transparent combat log
// box (top-right) that filled with "Hit for X" text faster than it could be
// read, and mineral blocks scattered around levels that the player could
// shoot/mine for resources — a leftover feature the user never asked for and
// didn't want. Both were removed entirely. These tests guard against either
// coming back.
const { test, expect } = require('@playwright/test');
const { gotoGame } = require('./helpers');

test('the combat log overlay is gone', async ({ page }) => {
    await gotoGame(page, 1);
    const exists = await page.evaluate(() => document.getElementById('combatLog') !== null);
    expect(exists).toBe(false);
});

test('mineral blocks no longer exist as a feature', async ({ page }) => {
    await gotoGame(page, 1);
    const hasMineralBlocks = await page.evaluate(() => typeof mineralBlocks !== 'undefined');
    expect(hasMineralBlocks).toBe(false);
});

test('enemy-kill XP leveling still works without the mining system', async ({ page }) => {
    await gotoGame(page, 1);
    const result = await page.evaluate(() => {
        dropXPAt(player.x, player.y, 500, false);
        // Place each orb 1px from the player (not exactly on top — the pickup
        // code needs a nonzero distance to move the orb in) so a single
        // updateXPPickups() call collects everything.
        for (const p of xpPickups) {
            p.x = player.x + player.width / 2 + 1;
            p.y = player.y + player.height / 2;
        }
        updateXPPickups();
        return { playerXP, playerLevel };
    });
    expect(result.playerLevel).toBeGreaterThan(1);
});
