import { createEmployee } from '../../test-data/employe.factory';
import { test, expect } from '../../fixtures/commonFixture';

test.beforeEach(async ({ loginPage, pimPage, encdec }) => {
  await loginPage.gotoOrangeHRM();
  await loginPage.loginToOrgangeHRM(
    encdec.decryptData(process.env.USER_NAME!),
    encdec.decryptData(process.env.PASSWORD!),
  );
  await pimPage.gotoPIM();
});

// Unique values so reruns don't clash with other employees on the shared demo site
const uniqueID = () => Date.now().toString().slice(-6);

test('Add and validate added Employee in Employee list using auto-suggest', async ({ pimPage }) => {
  const user = createEmployee();
  const id = uniqueID();
  const lastName = `${user.employeeLastName}${id}`;
  await pimPage.addEmployee(user.employeeFirstName, lastName, id);

  await pimPage.searchEmployee(lastName);

  await expect(pimPage.page.getByText('(1) Record Found')).toBeVisible();
  const row = pimPage.rowFor(lastName);
  await expect(row).toHaveCount(1);
  await expect(row).toContainText(id);
  await expect(row).toContainText(user.employeeFirstName);
});

test('Delete an added Employee', async ({ pimPage }) => {
  const user = createEmployee();
  const id = uniqueID();
  const lastName = `${user.employeeLastName}${id}`;
  await pimPage.addEmployee(user.employeeFirstName, lastName, id);

  await pimPage.deleteEmployee(lastName);

  await expect(pimPage.toastMessage).toContainText('Successfully Deleted');
  await expect(pimPage.rowFor(lastName)).toHaveCount(0);
});
