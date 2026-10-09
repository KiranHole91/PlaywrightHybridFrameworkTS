import { test, expect } from '../../fixtures/hooks-fixture';
import { readJson } from '../../utils/TestDataJsonReader';

type EmployeeData = {
  id: string;
  title: string;
  tags: string[];
  firstName: string;
  middleName?: string;
  lastName: string;
  login?: { usernamePrefix: string; status: 'Enabled' | 'Disabled' };
};

const employees = readJson<EmployeeData[]>('test-data/employee.json');

// Unique values so reruns don't clash with other employees on the shared demo site
const uniqueID = () => Date.now().toString().slice(-6);

for (const data of employees) {
  // Tags come from JSON, which the lint rule can't check statically
  // eslint-disable-next-line playwright/valid-test-tags
  test(
    `${data.id} - ${data.title}`,
    {
      tag: data.tags,
      annotation: {
        type: 'description',
        description: data.login ? 'With login details' : 'Without login details',
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

      await test.step('Add employee', async () => {
        await pimPage.gotoPIM();
        await pimPage.addEmployeeWithDetails(
          { firstName: data.firstName, middleName: data.middleName, lastName, employeeId: id },
          login,
        );
      });

      await test.step('Verify employee appears in Employee List', async () => {
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
