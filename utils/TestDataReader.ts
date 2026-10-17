import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

/**
 * Universal test data reader: picks the parser from the file extension.
 * Paths are relative to the project root, so every spec uses the same path.
 * CSV and Excel values are strings; JSON keeps its own types.
 * @param relativeFilePath e.g. 'test-data/ui-data/employee.json'
 * @param sheetName Excel only; defaults to the first sheet
 */
export function readTestData<T = Record<string, string>>(relativeFilePath: string, sheetName?: string): T[] {
  const fullPath = path.resolve(process.cwd(), relativeFilePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Test data file not found: ${fullPath}`);
  }

  const fileExtension = path.extname(fullPath).toLowerCase();

  switch (fileExtension) {
    case '.json': {
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      // A file holding a single object becomes a one-row array
      return (Array.isArray(data) ? data : [data]) as T[];
    }

    case '.csv':
      return parse(fs.readFileSync(fullPath, 'utf-8'), {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        // Excel on Windows saves CSVs with a BOM, which would corrupt the first header
        bom: true,
      }) as T[];

    case '.xlsx':
    case '.xls': {
      const workbook = XLSX.readFile(fullPath);
      const targetSheet = sheetName ?? workbook.SheetNames[0];
      const worksheet = workbook.Sheets[targetSheet];
      if (!worksheet) {
        throw new Error(`Sheet "${targetSheet}" not found in ${relativeFilePath}`);
      }
      // raw: false → values as shown in Excel (dates, formula results); defval → blank cells become ''
      return XLSX.utils.sheet_to_json<T>(worksheet, { raw: false, defval: '' });
    }

    default:
      throw new Error(`Unsupported test data format "${fileExtension}". Use .json, .csv, .xlsx or .xls`);
  }
}
