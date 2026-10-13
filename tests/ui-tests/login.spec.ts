import { test, expect } from '../../fixtures/commonFixture';

// Projects load the saved session (auth.json); clear it so this spec tests the real login flow
test.use({ storageState: { cookies: [], origins: [] } });

test('Login to OrangeHRM', async ({ page, loginPage, dashboardPage, encdec }) => {
  await loginPage.gotoOrangeHRM();
  await loginPage.loginToOrgangeHRM(
    encdec.decryptData(process.env.USER_NAME!),
    encdec.decryptData(process.env.PASSWORD!),
  );
  await expect(page).toHaveURL(/dashboard/);
  await expect(dashboardPage.dashboardTitletext).toHaveText('Dashboard');
});
