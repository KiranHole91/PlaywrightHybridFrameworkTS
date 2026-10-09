import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Paths are relative to the project root, so every spec uses the same path.
// The header row becomes the keys; every value is a string, so convert numbers/booleans in the spec.
export function readCsv<T = Record<string, string>>(relativePath: string): T[] {

  return parse(fs.readFileSync(relativePath, 'utf-8'), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    // Excel on Windows saves CSVs with a BOM, which would corrupt the first header
    bom: true,
  }) as T[];
}
