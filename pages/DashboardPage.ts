import {Page, Locator} from '@playwright/test'

export class DashboardPage{

    readonly page;
    readonly dashboardTitletext;

    constructor(page : Page)
    {
        this.page = page;
        this.dashboardTitletext = page.getByRole('heading',{name:'Dashboard'});
    }
}
