// A reviewer reported: "I see a mouse but it is covered with skills." The base
// hub is wall-to-wall with station displays, and the player used to spawn dead
// center on load, which happened to land right on top of the passive skills
// grid. This checks the player's spawn spot in base.html never overlaps any
// station display or the bottom prompt bar.
const { test, expect } = require('@playwright/test');
const { gotoBase } = require('./helpers');

test('player does not spawn on top of any base station on load', async ({ page }) => {
    await gotoBase(page);

    const result = await page.evaluate(() => {
        const promptBar = {
            x: baseConfig.x + baseConfig.width / 2 - 260,
            y: baseConfig.y + baseConfig.height - 90,
            width: 520,
            height: 32
        };
        const allStations = [
            ...weaponStations, ...upgradeStations, ...grenadeStations,
            ...modStations, ...skillStations, ...wardrobeStations, ...levelStations,
            promptBar
        ];
        const overlapping = allStations.filter(s =>
            player.x < s.x + s.width && player.x + player.width > s.x &&
            player.y < s.y + s.height && player.y + player.height > s.y
        );
        return { overlappingCount: overlapping.length, playerX: player.x, playerY: player.y };
    });

    expect(result.overlappingCount).toBe(0);
});
