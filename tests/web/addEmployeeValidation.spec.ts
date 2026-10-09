import { test, expect } from '../../fixtures/hooks-fixture';
import { readCsv } from '../../utils/TestDataCsvReader';
import type { AddEmployeeField } from '../../pages/PIMPage';

type ValidationRow = {
  id: string;
  title: string;
  tags: string;
  field: AddEmployeeField;
  value: string;
  repeat: string;
  expectedError: string;
};

const LOGIN_FIELDS: AddEmployeeField[] = ['username', 'password', 'confirmPassword'];

// Valid values for every field, so each row triggers only its own error
const validValues: Record<AddEmployeeField, string> = {
  firstName: 'Valid',
  middleName: '',
  lastName: 'User',
  employeeId: '',
  username: 'validuser01',
  password: 'Valid@1234',
  confirmPassword: 'Valid@1234',
};

const rows = readCsv<ValidationRow>('test-data/addEmployeeValidation.csv');

for (const row of rows) {
  // Fail fast on a typo in the CSV instead of a confusing locator error
  if (!(row.field in validValues)) throw new Error(`${row.id}: unknown field "${row.field}"`);

  // Tags come from CSV, which the lint rule can't check statically
  // eslint-disable-next-line playwright/valid-test-tags
  test(
    `${row.id} - ${row.title}`,
    {
      tag: row.tags.split('|').filter(Boolean),
      annotation: { type: 'field', description: row.field },
    },
    async ({ gotoURL, pimPage }) => {
      const badValue = row.repeat ? row.value.repeat(Number(row.repeat)) : row.value;
      const values = { ...validValues, [row.field]: badValue };
      const needsLogin = LOGIN_FIELDS.includes(row.field);

      await test.step('Fill Add Employee form with one invalid field', async () => {
        await pimPage.gotoPIM();
        await pimPage.linkAddEmployee.click();
        if (needsLogin) {
          await pimPage.toggleCreateLogin.click();
          await expect(pimPage.inputUsername).toBeVisible();
        }

        for (const [field, value] of Object.entries(values) as [AddEmployeeField, string][]) {
          if (!needsLogin && LOGIN_FIELDS.includes(field)) continue;
          await pimPage.fieldInput(field).fill(value);
        }
        await pimPage.buttonSave.click();
      });

      await test.step(`Verify ${row.field} shows "${row.expectedError}"`, async () => {
        await expect(pimPage.errorFor(row.field)).toHaveText(row.expectedError);
        // Form must not submit
        await expect(pimPage.page).toHaveURL(/pim\/addEmployee/);
      });
    },
  );
}
