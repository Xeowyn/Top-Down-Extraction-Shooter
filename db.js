/**
 * GameDB — SQLite database for Mousehunt: Extraction
 *
 * Uses sql.js (SQLite compiled to WebAssembly) so real SQL runs
 * directly in the browser. The database binary is saved to
 * localStorage under the key 'mh_sqldb' after every write.
 *
 * Usage:
 *   await GameDB.init();          // must call once before anything else
 *   GameDB.saveRun({...});
 *   GameDB.getHighscores();
 *   GameDB.query("SELECT ...");   // open query for learning / devtools
 */
const GameDB = (() => {
    const STORAGE_KEY  = 'mh_sqldb';
    const SQL_JS_CDN   = 'https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/sql-wasm.js';
    const WASM_CDN_DIR = 'https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/';

    let db  = null;   // sql.js Database instance
    let SQL = null;   // sql.js constructor

    // ─────────────────────────────────────────────────────────
    //  Bootstrap
    // ─────────────────────────────────────────────────────────

    /** Load sql.js from CDN if it isn't already on the page, then open DB. */
    async function init() {
        // Load sql.js library if not already present
        if (typeof initSqlJs === 'undefined') {
            await loadScript(SQL_JS_CDN);
        }

        SQL = await initSqlJs({
            locateFile: file => WASM_CDN_DIR + file
        });

        // Restore an existing database or start fresh
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const bytes = Uint8Array.from(atob(saved), c => c.charCodeAt(0));
            db = new SQL.Database(bytes);
        } else {
            db = new SQL.Database();
        }

        _createSchema();
        console.info('[GameDB] Ready. Tables:', _tableNames().join(', '));
        return GameDB; // allow chaining: await GameDB.init()
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = () => reject(new Error('Failed to load ' + src));
            document.head.appendChild(s);
        });
    }

    // ─────────────────────────────────────────────────────────
    //  Schema
    // ─────────────────────────────────────────────────────────

    /**
     * Create tables if they don't exist yet.
     *
     * characters — one row per named mouse character
     * runs       — one row per game attempt (win or loss)
     * highscores — top 10 extraction scores with 3-letter initials
     */
    function _createSchema() {
        db.run(`
            CREATE TABLE IF NOT EXISTS characters (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                name       TEXT    NOT NULL,
                skin       TEXT    NOT NULL DEFAULT 'default',
                created_at TEXT    NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS runs (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                character_name TEXT    NOT NULL,
                level_id       INTEGER NOT NULL DEFAULT 1,
                kills          INTEGER NOT NULL DEFAULT 0,
                coins          INTEGER NOT NULL DEFAULT 0,
                score          INTEGER NOT NULL DEFAULT 0,
                extracted      INTEGER NOT NULL DEFAULT 0,
                played_at      TEXT    NOT NULL DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS highscores (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                initials    TEXT    NOT NULL,
                score       INTEGER NOT NULL,
                kills       INTEGER NOT NULL DEFAULT 0,
                coins       INTEGER NOT NULL DEFAULT 0,
                level_id    INTEGER NOT NULL DEFAULT 1,
                achieved_at TEXT    NOT NULL DEFAULT (datetime('now'))
            );
        `);
        _persist();
    }

    // ─────────────────────────────────────────────────────────
    //  Persistence helper
    // ─────────────────────────────────────────────────────────

    /** Serialize the SQLite binary and write it to localStorage. */
    function _persist() {
        const data   = db.export();                           // Uint8Array
        const base64 = btoa(String.fromCharCode(...data));    // base64 string
        try {
            localStorage.setItem(STORAGE_KEY, base64);
        } catch (e) {
            console.warn('[GameDB] localStorage write failed:', e);
        }
    }

    // ─────────────────────────────────────────────────────────
    //  Score formula
    // ─────────────────────────────────────────────────────────

    /**
     * Score = kills × 25 + coins × 10 + level × 100 + extraction bonus 500
     *
     * This lives here so every caller uses the same formula.
     */
    function calcScore({ kills, coins, levelId, extracted }) {
        return kills * 25
             + coins * 10
             + levelId * 100
             + (extracted ? 500 : 0);
    }

    // ─────────────────────────────────────────────────────────
    //  Public API — write operations
    // ─────────────────────────────────────────────────────────

    /**
     * Save a completed run (win or loss).
     *
     * @param {object} p
     * @param {string}  p.characterName  Player's chosen name
     * @param {number}  p.levelId        1–4
     * @param {number}  p.kills
     * @param {number}  p.coins          crumbs collected
     * @param {boolean} p.extracted      true = successful extraction
     * @returns {number} computed score
     */
    function saveRun({ characterName, levelId, kills, coins, extracted }) {
        _assertReady();
        const score = calcScore({ kills, coins, levelId, extracted });
        db.run(
            `INSERT INTO runs
                (character_name, level_id, kills, coins, score, extracted)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [characterName || 'Unknown', levelId, kills, coins, score, extracted ? 1 : 0]
        );
        _persist();
        return score;
    }

    /**
     * Returns true if the given score qualifies for the top-10 leaderboard.
     * @param {number} score
     */
    function isHighscore(score) {
        _assertReady();
        const countResult = db.exec('SELECT COUNT(*) FROM highscores');
        const count = countResult[0]?.values[0][0] ?? 0;
        if (count < 10) return true;                  // board not full yet

        const minResult = db.exec('SELECT MIN(score) FROM highscores');
        const minScore  = minResult[0]?.values[0][0] ?? 0;
        return score > minScore;
    }

    /**
     * Save a new highscore entry and trim the board to 10.
     *
     * @param {object} p
     * @param {string}  p.initials  1–3 uppercase letters
     * @param {number}  p.score
     * @param {number}  p.kills
     * @param {number}  p.coins
     * @param {number}  p.levelId
     */
    function saveHighscore({ initials, score, kills, coins, levelId }) {
        _assertReady();
        const clean = (initials || '???').toUpperCase().replace(/[^A-Z]/g, '?').padEnd(3, '?').slice(0, 3);
        db.run(
            `INSERT INTO highscores (initials, score, kills, coins, level_id)
             VALUES (?, ?, ?, ?, ?)`,
            [clean, score, kills, coins, levelId]
        );
        // Keep only top 10
        db.run(`
            DELETE FROM highscores
            WHERE id NOT IN (
                SELECT id FROM highscores ORDER BY score DESC LIMIT 10
            )
        `);
        _persist();
    }

    // ─────────────────────────────────────────────────────────
    //  Public API — read operations
    // ─────────────────────────────────────────────────────────

    /** Returns the top-10 highscores as an array of plain objects. */
    function getHighscores() {
        _assertReady();
        return _rows('SELECT initials, score, kills, coins, level_id, achieved_at FROM highscores ORDER BY score DESC LIMIT 10');
    }

    /**
     * Returns recent run history.
     * @param {number} [limit=20]
     */
    function getRunHistory(limit = 20) {
        _assertReady();
        return _rows(`SELECT character_name, level_id, kills, coins, score, extracted, played_at FROM runs ORDER BY id DESC LIMIT ${Number(limit)}`);
    }

    /** Returns career totals: total_runs, total_kills, total_coins, extractions. */
    function getCareerStats() {
        _assertReady();
        return _rows(`
            SELECT
                COUNT(*)                    AS total_runs,
                SUM(kills)                  AS total_kills,
                SUM(coins)                  AS total_coins,
                SUM(extracted)              AS extractions,
                MAX(score)                  AS best_score,
                ROUND(AVG(score), 0)        AS avg_score
            FROM runs
        `)[0] || {};
    }

    /**
     * Run any arbitrary SQL and return results.
     * Great for learning — open your browser console and type:
     *
     *   GameDB.query("SELECT * FROM runs WHERE extracted = 1")
     *   GameDB.query("SELECT * FROM highscores ORDER BY score DESC")
     */
    function query(sql) {
        _assertReady();
        const results = db.exec(sql);
        if (!results.length) return { message: 'Query OK (no rows returned)' };
        return results.map(r => ({
            columns: r.columns,
            rows: r.values.map(v => {
                const obj = {};
                r.columns.forEach((c, i) => obj[c] = v[i]);
                return obj;
            })
        }));
    }

    // ─────────────────────────────────────────────────────────
    //  Helpers
    // ─────────────────────────────────────────────────────────

    /** Execute a SELECT and return rows as plain objects. */
    function _rows(sql, params = []) {
        const results = params.length ? db.exec(sql, params) : db.exec(sql);
        if (!results.length) return [];
        const { columns, values } = results[0];
        return values.map(v => {
            const obj = {};
            columns.forEach((c, i) => obj[c] = v[i]);
            return obj;
        });
    }

    function _tableNames() {
        return _rows("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").map(r => r.name);
    }

    function _assertReady() {
        if (!db) throw new Error('[GameDB] Call GameDB.init() before using the database.');
    }

    // ─────────────────────────────────────────────────────────
    //  Expose
    // ─────────────────────────────────────────────────────────
    return {
        init,
        calcScore,
        saveRun,
        isHighscore,
        saveHighscore,
        getHighscores,
        getRunHistory,
        getCareerStats,
        query,
    };
})();
