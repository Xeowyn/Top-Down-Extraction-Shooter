// Regression coverage for the "player spawns stuck inside a wall" bug.
// Levels are randomized every run, so this reloads each level many times
// and checks the player never spawns overlapping an obstacle.
const { test, expect } = require('@playwright/test');
const { gotoGame } = require('./helpers');

const LEVELS = [1, 2, 3, 4];
const RUNS_PER_LEVEL = 15;

for (const level of LEVELS) {
    test(`level ${level}: player never spawns inside an obstacle (${RUNS_PER_LEVEL} runs)`, async ({ page }) => {
        test.setTimeout(60000);
        for (let i = 0; i < RUNS_PER_LEVEL; i++) {
            await gotoGame(page, level);

            const result = await page.evaluate(() => {
                return {
                    colliding: checkObstacleCollision(player.x, player.y, player.width, player.height),
                    x: player.x,
                    y: player.y,
                    obstacleCount: obstacles.length,
                };
            });

            expect(result.obstacleCount).toBeGreaterThan(0); // sanity check the level actually generated obstacles
            expect(result.colliding, `run ${i}: player spawned inside an obstacle at (${result.x}, ${result.y})`).toBe(false);
        }
    });
}
