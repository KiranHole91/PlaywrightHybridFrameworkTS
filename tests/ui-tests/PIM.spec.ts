import { createEmployee } from '../../test-data/ui-data/employe.factory';
import { test, expect } from '../../fixtures/hooks-fixture';
import { uniqueID } from '../../utils/uniqueID';

test('Add and validate added Employee in Employee list using auto-suggest', async ({ pimPage, gotoURL }) => {
  const user = createEmployee();
  const id = uniqueID();
  const lastName = `${user.employeeLastName}${id}`;
  await pimPage.gotoPIM();
  await pimPage.addEmployee(user.employeeFirstName, lastName, id);

  await pimPage.searchEmployee(lastName);

  await expect(pimPage.page.getByText('(1) Record Found')).toBeVisible();
  const row = pimPage.rowFor(lastName);
  await expect(row).toHaveCount(1);
  await expect(row).toContainText(id);
  await expect(row).toContainText(user.employeeFirstName);
});

test('Delete an added Employee', async ({ pimPage,gotoURL }) => {
   await pimPage.gotoPIM();
  const user = createEmployee();
  const id = uniqueID();
  const lastName = `${user.employeeLastName}${id}`;
  await pimPage.addEmployee(user.employeeFirstName, lastName, id);

  await pimPage.deleteEmployee(lastName);

  await expect(pimPage.toastMessage).toContainText('Successfully Deleted');
  await expect(pimPage.rowFor(lastName)).toHaveCount(0);
});
