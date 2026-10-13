import { test, expect } from '../../fixtures/commonFixture';

// Logged-in session comes from storageState (auth.json), created by global.setup.ts
test(
  'Validate side menu options are navigating successfully',
  {
    tag: ['@smoke', '@sideMenu'],
    annotation: {
      type: 'description',
      description: 'Clicks each side menu option and verifies the matching page opens',
    },
  },
  async ({ page, loginPage, sideMenuPage, dashboardPage }) => {
    await test.step('Open OrangeHRM and land on the Dashboard', async () => {
      await loginPage.gotoOrangeHRM();
      await expect(page).toHaveURL(/dashboard/);
      await expect(dashboardPage.dashboardTitletext).toHaveText('Dashboard');
    });

    await test.step('Navigate through each side menu option', async () => {
      await sideMenuPage.validateSideMenuOptionNavigations();
    });
  }
);
