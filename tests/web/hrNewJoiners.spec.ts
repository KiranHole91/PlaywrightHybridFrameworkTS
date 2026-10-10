import fs from 'fs';
import { test, expect } from '../../fixtures/hooks-fixture';
import { readJson } from '../../utils/TestDataJsonReader';
import type { EmployeeData } from '../../test-data/types';

// Generated from HR's Excel sheet by `npm run data:new-joiners`
const DATA_FILE = 'test-data/generated/new-joiners.json';
if (!fs.existsSync(DATA_FILE)) {
  throw new Error(`${DATA_FILE} not found. Run "npm run data:new-joiners" first.`);
}
const joiners = readJson<EmployeeData[]>(DATA_FILE);

// Unique values so reruns don't clash with other employees on the shared demo site
const uniqueID = () => Date.now().toString().slice(-6);

for (const data of joiners) {
  // Tags come from Excel, which the lint rule can't check statically
  // eslint-disable-next-line playwright/valid-test-tags
  test(
    `${data.id} - ${data.title}`,
    {
      tag: data.tags,
      annotation: {
        type: 'description',
        description: data.login ? 'New joiner with login details' : 'New joiner without login details',
      },
    },
    async ({ gotoURL, pimPage, adminPage }) => {
      // Adding an employee plus a login is slow on the demo site
      test.setTimeout(60000);
      const id = uniqueID();
      const lastName = `${data.lastName}${id}`;
      const login = data.login && {
        username: `${data.login.usernamePrefix}${id}`,
        password: `Emp@${id}x`,
        status: data.login.status,
      };

      await test.step('Add new joiner', async () => {
        await pimPage.gotoPIM();
        await pimPage.addEmployeeWithDetails(
          { firstName: data.firstName, middleName: data.middleName, lastName, employeeId: id },
          login,
        );
      });

      await test.step('Verify new joiner appears in Employee List', async () => {
        await pimPage.searchEmployee(lastName);
        const row = pimPage.rowFor(lastName);
        await expect(row).toHaveCount(1);
        await expect(row).toContainText(id);
      });

      if (login) {
        await test.step('Verify system user was created in Admin', async () => {
          await adminPage.gotoAdmin();
          await adminPage.searchUser(login.username);
          const row = adminPage.rowFor(login.username);
          await expect(row).toHaveCount(1);
          await expect(row).toContainText(login.status);
        });
      }
    },
  );
}
