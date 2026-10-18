import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', 'data');

if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Minimal JSON-file-backed store.
 * Good enough for low-volume form submissions without standing up a database.
 * Swap for MySQL or another database later without touching the controllers
 * (readCollection/appendToCollection keep the same signature).
 */
export const readCollection = (name) => {
    const filePath = join(DATA_DIR, `${name}.json`);
    if (!existsSync(filePath)) return [];
    try {
        const raw = readFileSync(filePath, 'utf-8');
        return raw.trim() ? JSON.parse(raw) : [];
    } catch (err) {
        console.error(`[jsonStore] Failed to read "${name}":`, err.message);
        return [];
    }
};

export const writeCollection = (name, data) => {
    const filePath = join(DATA_DIR, `${name}.json`);
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

export const appendToCollection = (name, entry) => {
    const data = readCollection(name);
    data.push(entry);
    writeCollection(name, data);
    return entry;
};
