
import { test, expect } from '../../fixtures/POMfixture'


test ("Validate side menu options are navigating successfully", async ({loginPage , sideMenuPage}) => {
  
    await loginPage.gotoOrangeHRM();
    await loginPage.loginToOrgangeHRM('Admin','admin123');
    await sideMenuPage.validateSideMenuOptionNavigations();
    
})