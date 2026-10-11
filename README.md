# Playwright Automation Framework

## Test Data

All test data, whether JSON, CSV or Excel, is read through one utility: [`utils/TestDataReader.ts`](utils/TestDataReader.ts).

```ts
import { readTestData } from '../../utils/TestDataReader';

const rows = readTestData<MyRowType>('test-data/<file>.<json|csv|xlsx|xls>', 'OptionalSheetName');
```

- Paths are relative to the project root, so every spec uses the same path style.
- The parser is chosen from the **file extension**. You never pick a reader yourself.
- The result is always an **array of rows**. Each row becomes one test in a `for…of` loop.
- If the file is missing, the error shows the full path that was tried.
- An unsupported extension throws `Unsupported test data format "<ext>"`.

### How each file type is handled

| | `.json` | `.csv` | `.xlsx` / `.xls` |
|---|---|---|---|
| Parser | `JSON.parse` | `csv-parse` | SheetJS (`xlsx`) |
| Row keys | Object keys | Header row (row 1) | Header row (row 1) of the sheet |
| Value types | Kept as in the JSON file (arrays, nested objects, booleans, numbers) | **Always strings** | **Always strings**, as shown in Excel (formatted dates, formula results) |
| Blank values | Whatever the JSON holds | `''` | `''`; a column is never missing from a row |
| Blank rows | n/a | Skipped | Skipped |
| Extras | A single object is wrapped into a one-row array | Values trimmed; Excel's BOM removed | Sheet chosen by name; defaults to the first sheet |
| Example | [`employee.json`](test-data/employee.json) → [`addEmployee.spec.ts`](tests/web/addEmployee.spec.ts) | [`addEmployeeValidation.csv`](test-data/addEmployeeValidation.csv) → [`addEmployeeValidation.spec.ts`](tests/web/addEmployeeValidation.spec.ts) | [`hr-new-joiners.xlsx`](test-data/excel/hr-new-joiners.xlsx) → [`convert-new-joiners.ts`](scripts/convert-new-joiners.ts) |

CSV and Excel both produce flat rows of strings. In the spec, convert numbers and booleans yourself, and split comma-separated lists such as tags. JSON keeps nested, typed data, so moving a dataset between JSON and CSV/Excel needs a mapping step.

### Which format to use

| Source | Use it when | How it reaches the test |
|---|---|---|
| JSON | Testers own the data and it has nested or typed fields | Read directly in the spec |
| CSV | You have flat tables with many rows, such as validation cases | Read directly in the spec, then convert types |
| Excel, read directly | You have a simple sheet whose columns already match the code names | `readTestData('file.xlsx', 'Sheet')` in the spec |
| Excel, converted first | The business owns the sheet | A converter script validates the sheet and writes JSON before the run (see below) |

### Business-owned Excel: HR new-joiner batch

HR maintains [`test-data/excel/hr-new-joiners.xlsx`](test-data/excel/hr-new-joiners.xlsx), sheet `NewJoiners`, using business-friendly column names:

| Run | Test ID | Title | Tags | First Name | Middle Name | Last Name | Create Login | Username Prefix | Login Status |
|---|---|---|---|---|---|---|---|---|---|
| Y | TC_HR_001 | Joiner without login | @smoke, @hr | Ravi | | Kulkarni | N | | |
| Y | TC_HR_002 | Joiner with login | @regression, @hr | Neha | S | Joshi | Y | neha | Enabled |

- Set `Run` to `N` to leave a row out of the run without deleting it.
- `Tags` are comma-separated.
- `Create Login`, `Run` and `Login Status` have dropdowns in the sheet.

The flow:

```
hr-new-joiners.xlsx ──npm run data:new-joiners──► test-data/generated/new-joiners.json ──► hrNewJoiners.spec.ts
```

[`scripts/convert-new-joiners.ts`](scripts/convert-new-joiners.ts) does the following:

1. Reads the sheet with `readTestData`.
2. Keeps only the rows where `Run = Y`.
3. Validates each row:
   - the required fields are filled in;
   - no `Test ID` appears twice;
   - when `Create Login = Y`, `Username Prefix` is set and `Login Status` is `Enabled` or `Disabled`.
4. Maps the business column names to the `EmployeeData` type in [`test-data/types.ts`](test-data/types.ts).
5. Writes the JSON. The generated folder is git-ignored; the Excel file is the source of truth.

If any row is invalid, the script stops before the browser opens and names each problem by its Excel row number:

```
❌ test-data/excel/hr-new-joiners.xlsx has 1 problem(s):
  Row 3: "Login Status" must be Enabled or Disabled, got "Active"
```

Run it:

```powershell
npm run data:new-joiners   # convert only
npm run test:new-joiners   # convert, then run the batch on SIT / Chromium
```

> **Why not convert in `globalSetup`?** Playwright loads the spec files, and so reads their test data, **before** `globalSetup` runs. Converting there would mean the first run uses an old JSON file, or finds none at all. Always convert before `playwright test` starts.

### Adding a new data-driven test

1. Put the data file in `test-data/`.
2. Define a row type for it, either in the spec or in `test-data/types.ts` if more than one file uses it.
3. Call `readTestData<RowType>('test-data/<file>')` at the top of the spec and create one `test()` per row.
4. For CSV or Excel, convert string values to the types you need inside the spec.
5. If the business owns the file, add a converter script in `scripts/` and an `npm run data:<name>` script, following the new-joiner example.

### Setup note

SheetJS is installed from the SheetJS CDN, because the `xlsx` package on npm is outdated and has known vulnerabilities:

```powershell
npm i -D https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```
