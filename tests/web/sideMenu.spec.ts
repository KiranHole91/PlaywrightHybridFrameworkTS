import { test, expect } from '../../fixtures/commonFixture';

test('Validate side menu options are navigating successfully', async ({
  loginPage,
  sideMenuPage,
  encdec,
}) => {
  await loginPage.gotoOrangeHRM();
  await loginPage.loginToOrgangeHRM(
    encdec.decryptData(process.env.USER_NAME!),
    encdec.decryptData(process.env.PASSWORD!),
  );
  await sideMenuPage.validateSideMenuOptionNavigations();
});
