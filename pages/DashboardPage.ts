import {Page, Locator} from '@playwright/test'

export class DashboardPage{

    readonly page;
    readonly dashboardTitletext;
    readonly profileMenu;
    readonly linkLogout;

    constructor(page : Page)
    {
        this.page = page;
        this.dashboardTitletext = page.getByRole('heading',{name:'Dashboard'});
        this.profileMenu = page.locator('.oxd-userdropdown-name');
        this.linkLogout = page.getByRole('link',{name:'Logout'});
    }

   async logout()
    {
        await this.profileMenu.click();
        await this.linkLogout.click();
    }
}
