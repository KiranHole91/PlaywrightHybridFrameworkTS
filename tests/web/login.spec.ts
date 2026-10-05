import { test } from '../../fixtures/commonFixture';

test('Login to OrangeHRM', async ({ loginPage, encdec }) => {
  await loginPage.gotoOrangeHRM();
  await loginPage.loginToOrgangeHRM(
    encdec.decryptData(process.env.USER_NAME!),
    encdec.decryptData(process.env.PASSWORD!),
  );
});
