import fs from 'fs';
import path from 'path';
import { readExcel } from '../utils/TestDataExcelReader';
import type { EmployeeData } from '../test-data/types';

// HR owns the Excel sheet; this turns it into JSON before Playwright starts.
// It must run before `playwright test`, not in globalSetup, because spec files are collected first.
const SOURCE = 'test-data/excel/hr-new-joiners.xlsx';
const OUTPUT = 'test-data/generated/new-joiners.json';

async function main() {
  const rows = await readExcel(SOURCE, 'NewJoiners');
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const employees: EmployeeData[] = [];

  for (const { rowNumber, data: r } of rows) {
    if (r['Run']?.toUpperCase() !== 'Y') continue;
    const err = (msg: string) => errors.push(`Row ${rowNumber}: ${msg}`);

    for (const col of ['Test ID', 'Title', 'First Name', 'Last Name']) {
      if (!r[col]) err(`"${col}" is required`);
    }
    if (seenIds.has(r['Test ID'])) err(`duplicate Test ID "${r['Test ID']}"`);
    seenIds.add(r['Test ID']);

    const wantsLogin = r['Create Login']?.toUpperCase() === 'Y';
    if (wantsLogin) {
      if (!r['Username Prefix']) err('"Username Prefix" is required when Create Login = Y');
      if (!['Enabled', 'Disabled'].includes(r['Login Status'])) {
        err(`"Login Status" must be Enabled or Disabled, got "${r['Login Status'] ?? ''}"`);
      }
    }

    employees.push({
      id: r['Test ID'],
      title: r['Title'],
      tags: (r['Tags'] ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      firstName: r['First Name'],
      middleName: r['Middle Name'] || undefined,
      lastName: r['Last Name'],
      login: wantsLogin
        ? { usernamePrefix: r['Username Prefix'], status: r['Login Status'] as 'Enabled' | 'Disabled' }
        : undefined,
    });
  }

  if (errors.length) {
    console.error(`❌ ${SOURCE} has ${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
    process.exit(1);
  }
  if (!employees.length) {
    console.error(`❌ No rows with Run = Y in ${SOURCE}`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(employees, null, 2));
  console.log(`✅ Wrote ${employees.length} new joiner(s) to ${OUTPUT}`);
}

main().catch((e) => {
  console.error(`❌ ${e.message}`);
  process.exit(1);
});
