// Shared helpers for the Playwright test suite.
// The game keeps everything in global scope inside one <script> tag per page,
// so tests drive it the same way the earlier bug-fix scripts did: load the
// real page in a browser and call its own functions through page.evaluate().

async function gotoGame(page, level, extraQuery = '') {
    const query = extraQuery ? `level=${level}&${extraQuery}` : `level=${level}`;
    await page.goto(`/game.html?${query}`);
    await page.waitForFunction(() => typeof player !== 'undefined' && typeof gameState !== 'undefined');
}

async function gotoBase(page, query = '') {
    await page.goto(query ? `/base.html?${query}` : '/base.html');
    await page.waitForFunction(() => typeof player !== 'undefined' && typeof gameState !== 'undefined');
}

module.exports = { gotoGame, gotoBase };
