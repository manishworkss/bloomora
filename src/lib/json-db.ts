import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

export function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readJsonFile<T>(filename: string, defaultData: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Failed to write initial ${filename}:`, err);
    }
    return defaultData;
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to read/parse ${filename}, falling back to defaults:`, err);
    return defaultData;
  }
}

export function writeJsonFile<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = `${filePath}.tmp`;

  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Failed to atomically write ${filename}:`, err);
    // Fallback direct write
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (fallbackErr) {
      console.error(`Direct write also failed for ${filename}:`, fallbackErr);
    }
  }
}

