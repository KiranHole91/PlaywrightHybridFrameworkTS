import path from 'path';
import ExcelJS from 'exceljs';

// Paths are relative to the project root, so every caller uses the same path.
// Row 1 is the header; cell.text gives what the user sees in Excel (formula results, dates, rich text).
// rowNumber is returned so validation errors can point at the exact Excel row.
export async function readExcel(
  relativePath: string,
  sheetName: string,
): Promise<{ rowNumber: number; data: Record<string, string> }[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.resolve(process.cwd(), relativePath));

  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found in ${relativePath}`);

  const headers: string[] = [];
  sheet.getRow(1).eachCell((cell, col) => (headers[col] = cell.text.trim()));

  const rows: { rowNumber: number; data: Record<string, string> }[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const data: Record<string, string> = {};
    headers.forEach((header, col) => {
      if (header) data[header] = row.getCell(col).text.trim();
    });
    // Skip rows HR left blank
    if (Object.values(data).some(Boolean)) rows.push({ rowNumber, data });
  });
  return rows;
}
