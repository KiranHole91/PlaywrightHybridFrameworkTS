import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SideMenuPage } from '../pages/SideMenuPage';

type POMFixture = {
  loginPage: LoginPage;
  sideMenuPage: SideMenuPage;
};

export const test = baseTest.extend<POMFixture>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  sideMenuPage: async ({ page }, use) => {
    await use(new SideMenuPage(page));
  },
});

export { expect } from '@playwright/test';
