import { test, expect } from '../../fixtures/commonFixture';

// Logged-in session comes from storageState (auth.json), created by global.setup.ts
test('Validate side menu options are navigating successfully', async ({
  page,
  loginPage,
  sideMenuPage,
  dashboardPage,
}) => {
  await loginPage.gotoOrangeHRM();
  await expect(page).toHaveURL(/dashboard/);
  await expect(dashboardPage.dashboardTitletext).toHaveText('Dashboard');

  await sideMenuPage.validateSideMenuOptionNavigations();
});
