import { Page, Locator } from '@playwright/test';

export class SideMenuPage {
  readonly page: Page;
  readonly admin: Locator;
  readonly PIM: Locator;
  readonly leave: Locator;
  readonly time: Locator;
  readonly recruitment: Locator;
  readonly myInfo: Locator;
  readonly personalDetails: Locator;
  readonly dashboard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.admin = page.getByRole('link', { name: 'Admin' });
    this.PIM = page.getByRole('link', { name: 'PIM' });
    this.leave = page.getByRole('link', { name: 'Leave' });
    this.time = page.getByRole('link', { name: 'Time' });
    this.recruitment = page.getByRole('link', { name: 'Recruitment' });
    this.myInfo = page.getByRole('link', { name: 'My Info' });
    this.personalDetails = page.getByRole('heading', { name: 'Personal Details' });
    this.dashboard = page.getByRole('link', { name: 'Dashboard' });
  }

  async validateSideMenuOptionNavigations() {
    await this.admin.click();
    await this.PIM.click();
    await this.leave.click();
    await this.time.click();
    await this.recruitment.click();
    await this.myInfo.click();
    await this.personalDetails.click();
    await this.dashboard.click();
  }
}
