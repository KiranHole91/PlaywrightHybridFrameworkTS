import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SideMenuPage } from '../pages/SideMenuPage';
import { PIMPage } from '../pages/PIMPage';  

type POMFixture = {
  loginPage: LoginPage;
  sideMenuPage: SideMenuPage;
  pimPage : PIMPage;
};

export const test = baseTest.extend<POMFixture>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  sideMenuPage: async ({ page }, use) => {
    await use(new SideMenuPage(page));
  },


  pimPage: async ({page}, use) => {
   await use (new PIMPage(page));
  }

});
export { expect } from '@playwright/test';
