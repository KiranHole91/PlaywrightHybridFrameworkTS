import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SideMenuPage } from '../pages/SideMenuPage';
import { PIMPage } from '../pages/PIMPage';  
import { AdminPage } from '../pages/AdminPage';
import { DashboardPage } from '../pages/DashboardPage';

type POMFixture = {
  loginPage: LoginPage;
  sideMenuPage: SideMenuPage;
  pimPage : PIMPage;
  adminPage : AdminPage;
  dashboardPage : DashboardPage;
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
  },

  adminPage: async ({page}, use) =>{
    await use(new AdminPage(page));
  },

  dashboardPage : async({page}, use) => {

    await use(new DashboardPage(page));
  }

});
export { expect } from '@playwright/test';
