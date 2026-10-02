import { test, expect } from '../../fixtures/POMfixture';

test('Login to OrangeHRM', async ({ loginPage }) => {
  await loginPage.gotoOrangeHRM();
  await loginPage.loginToOrgangeHRM(process.env.USER_NAME!, process.env.PASSWORD!);
});
