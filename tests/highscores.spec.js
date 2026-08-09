// Checks the highscores page actually renders what's in the database —
// not just that the page loads without crashing.
const { test, expect } = require('@playwright/test');

async function waitForDbReady(page) {
    await page.goto('/highscores.html');
    await page.waitForFunction(() => {
        const el = document.getElementById('content');
        return el && el.textContent && !el.textContent.includes('LOADING DATABASE');
    }, null, { timeout: 20000 });
}

test('a saved highscore appears in the top-10 table after reload', async ({ page }) => {
    await waitForDbReady(page);
    await page.evaluate(() => {
        GameDB.saveHighscore({ initials: 'ABC', score: 12345, kills: 10, coins: 200, levelId: 2 });
    });

    await waitForDbReady(page); // reload, forcing a fresh read from the persisted database

    const row = page.locator('.board-wrap tbody tr', { hasText: 'ABC' });
    await expect(row).toBeVisible();
    await expect(row.locator('.score-val')).toHaveText('12,345');
});

test('a saved run shows up in the recent runs table with the right result', async ({ page }) => {
    await waitForDbReady(page);
    await page.evaluate(() => {
        GameDB.saveRun({ characterName: 'TestMouse', levelId: 3, kills: 7, coins: 90, extracted: true });
    });

    await waitForDbReady(page);

    const row = page.locator('.runs-wrap tbody tr', { hasText: 'TestMouse' });
    await expect(row).toBeVisible();
    await expect(row.locator('.result-win')).toHaveText('EXTRACTED');
});

test('a died run is labeled DIED, not EXTRACTED', async ({ page }) => {
    await waitForDbReady(page);
    await page.evaluate(() => {
        GameDB.saveRun({ characterName: 'DeadMouse', levelId: 1, kills: 1, coins: 5, extracted: false });
    });

    await waitForDbReady(page);

    const row = page.locator('.runs-wrap tbody tr', { hasText: 'DeadMouse' });
    await expect(row).toBeVisible();
    await expect(row.locator('.result-loss')).toHaveText('DIED');
});

test('career stats total runs count increases as runs are saved', async ({ page }) => {
    await waitForDbReady(page);
    const before = await page.evaluate(() => GameDB.getCareerStats().total_runs || 0);

    await page.evaluate(() => {
        GameDB.saveRun({ characterName: 'CountMouse', levelId: 1, kills: 0, coins: 0, extracted: false });
    });
    await waitForDbReady(page);

    const after = await page.evaluate(() => GameDB.getCareerStats().total_runs || 0);
    expect(after).toBe(before + 1);
});

test('the leaderboard never shows more than 10 entries', async ({ page }) => {
    await waitForDbReady(page);
    await page.evaluate(() => {
        for (let i = 0; i < 15; i++) {
            GameDB.saveHighscore({ initials: 'Z' + i, score: 1000 + i, kills: i, coins: i, levelId: 1 });
        }
    });
    await waitForDbReady(page);

    const rowCount = await page.locator('.board-wrap tbody tr').count();
    expect(rowCount).toBeLessThanOrEqual(10);
});
