import { test, expect } from '../../fixtures/commonFixture';
import { createEmployee } from '../../test-data/employe.factory';
import { PIMPage } from '../../pages/PIMPage';
import { AdminPage } from '../../pages/AdminPage';

test.beforeEach(async ({ loginPage, encdec }) => {
  await loginPage.gotoOrangeHRM();
  await loginPage.loginToOrgangeHRM(
    encdec.decryptData(process.env.USER_NAME!),
    encdec.decryptData(process.env.PASSWORD!),
  );
});

const uniqueID = () => Date.now().toString().slice(-6);

// An admin user must be linked to an employee, so create one first
async function createAdminUser(pimPage: PIMPage, adminPage: AdminPage) {
  const user = createEmployee();
  const id = uniqueID();
  const lastName = `${user.employeeLastName}${id}`;
  const username = `${user.employeeUsername}${id}`;

  await pimPage.gotoPIM();
  await pimPage.addEmployee(user.employeeFirstName, lastName, id);
  await adminPage.gotoAdmin();
  await adminPage.addAdminUser(lastName, username, `Admin@${id}`);
  return username;
}

test.describe('Admin user management', () => {
  // Each test creates an employee and an admin user, which is slow on the demo site
  test.describe.configure({ timeout: 60000 });

  test('Create an Admin user', async ({ pimPage, adminPage }) => {
    const username = await createAdminUser(pimPage, adminPage);
    // addAdminUser already checks the "Successfully Saved" toast
    await adminPage.searchUser(username);
    await expect(adminPage.rowFor(username)).toHaveCount(1);
  });

  test('Search an Admin user', async ({ pimPage, adminPage }) => {
    const username = await createAdminUser(pimPage, adminPage);
    await adminPage.searchUser(username);
    const row = adminPage.rowFor(username);
    await expect(row).toHaveCount(1);
    await expect(row).toContainText('Admin');
  });

  test('Delete an Admin user', async ({ pimPage, adminPage }) => {
    const username = await createAdminUser(pimPage, adminPage);
    await adminPage.searchUser(username);
    await adminPage.deleteUser(username);
    await expect(adminPage.toastMessage).toContainText('Successfully Deleted');
    await expect(adminPage.rowFor(username)).toHaveCount(0);
  });
});
