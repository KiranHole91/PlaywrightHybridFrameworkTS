
import { test, expect } from '../../fixtures/POMfixture'

test("Login to OrangeHRM", async ({loginPage}) => {
  
    await loginPage.gotoOrangeHRM();
    await loginPage.loginToOrgangeHRM("Admin","admin123");

}


)