import { expect, test } from '../../fixtures/commonFixture';


test('Login to OrangeHRM', async ({ page, loginPage, dashboardPage, encdec }) => {
  await loginPage.gotoOrangeHRM();
  await loginPage.loginToOrgangeHRM(
    encdec.decryptData(process.env.USER_NAME!),
    encdec.decryptData(process.env.PASSWORD!),
  );

  await page.waitForURL(`${process.env.BASE_URL}/web/index.php/dashboard/index`)
  await expect(dashboardPage.dashboardTitletext).toHaveText('Dashboard');

  await  page.context().storageState({
        path : './auth-file/.auth/auth.json'
    })
});