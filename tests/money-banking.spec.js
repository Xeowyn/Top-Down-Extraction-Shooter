// Regression coverage for the "money not banked on death" bug, plus the
// matching extraction path and a check that corrupted savegame data can't
// permanently zero out the player's banked money.
const { test, expect } = require('@playwright/test');
const { gotoGame } = require('./helpers');

test('extraction banks 100% of the run\'s earned money', async ({ page }) => {
    await gotoGame(page, 1);
    await page.evaluate(() => localStorage.setItem('mh_bankedCrumbs', '500'));

    await page.evaluate(() => {
        runMoneyEarned = 240;
        extractPlayer();
    });

    const banked = await page.evaluate(() => localStorage.getItem('mh_bankedCrumbs'));
    expect(Number(banked)).toBe(500 + 240);
});

test('dying banks exactly 10% of the run\'s earned money', async ({ page }) => {
    await gotoGame(page, 1);
    await page.evaluate(() => localStorage.setItem('mh_bankedCrumbs', '500'));

    await page.evaluate(() => {
        runMoneyEarned = 240;
        triggerPlayerDeath();
    });

    const banked = await page.evaluate(() => localStorage.getItem('mh_bankedCrumbs'));
    expect(Number(banked)).toBe(500 + Math.floor(240 * 0.1));
});

test('dying with 0 money earned banks 0, not NaN', async ({ page }) => {
    await gotoGame(page, 1);
    await page.evaluate(() => localStorage.setItem('mh_bankedCrumbs', '100'));

    await page.evaluate(() => {
        runMoneyEarned = 0;
        triggerPlayerDeath();
    });

    const banked = await page.evaluate(() => localStorage.getItem('mh_bankedCrumbs'));
    expect(Number(banked)).toBe(100);
});

test('a corrupted mh_bankedCrumbs value does not permanently zero out money', async ({ page }) => {
    await gotoGame(page, 1);
    // Simulate a tampered/corrupted save — not valid JSON or a number.
    await page.evaluate(() => localStorage.setItem('mh_bankedCrumbs', 'not-a-number'));

    await page.evaluate(() => {
        runMoneyEarned = 300;
        extractPlayer();
    });

    const banked = await page.evaluate(() => localStorage.getItem('mh_bankedCrumbs'));
    expect(banked).not.toBe('NaN');
    expect(Number(banked)).toBe(300); // corrupted prior balance is treated as 0, not carried forward as garbage
});
