import fs from 'fs';
import path from 'path';

// Paths are relative to the project root, so every spec uses the same path
export function readJson<T>(relativePath: string): T {
  const fullPath = path.resolve(process.cwd(), relativePath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as T;
}
