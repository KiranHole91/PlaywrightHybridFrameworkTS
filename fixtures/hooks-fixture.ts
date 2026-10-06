import {test as baseTest} from './commonFixture'
import { expect } from '@playwright/test';

type hooksFixture = {
    gotoURL : void;
    logout : void
}


export const test = baseTest.extend<hooksFixture> ({

    gotoURL: async ({ page, loginPage }, use) => {
    await loginPage.gotoOrangeHRM();   // before test
    await expect(page).toHaveURL(/dashboard/); // wait for redirect; also fails fast if auth.json is stale
    await use();
  },

  logout: async ({ dashboardPage }, use) => {
    await use();
    await dashboardPage.logout();      // after test (teardown)
  },
})

export { expect } from './commonFixture';


