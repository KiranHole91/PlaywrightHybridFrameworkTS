import { Page, Locator, expect } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly sideMenuAdmin: Locator;
  readonly buttonAdd: Locator;
  readonly dropdownUserRole: Locator;
  readonly inputEmployeeName: Locator;
  readonly dropdownStatus: Locator;
  readonly inputUsername: Locator;
  readonly inputPassword: Locator;
  readonly inputConfirmPassword: Locator;
  readonly buttonSave: Locator;
  readonly buttonSearch: Locator;
  readonly resultRows: Locator;
  readonly buttonConfirmDelete: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sideMenuAdmin = page.getByRole('link', { name: 'Admin' });
    this.buttonAdd = page.getByRole('button', { name: 'Add' });
    this.dropdownUserRole = page
      .locator('.oxd-input-group', { hasText: 'User Role' })
      .locator('.oxd-select-text');
    this.inputEmployeeName = page.getByPlaceholder('Type for hints...');
    this.dropdownStatus = page
      .locator('.oxd-input-group', { hasText: 'Status' })
      .locator('.oxd-select-text');
    this.inputUsername = page.locator('.oxd-input-group', { hasText: 'Username' }).locator('input');
    this.inputPassword = page.locator('input[type="password"]').nth(0);
    this.inputConfirmPassword = page.locator('input[type="password"]').nth(1);
    this.buttonSave = page.getByRole('button', { name: 'Save' });
    this.buttonSearch = page.getByRole('button', { name: 'Search' });
    this.resultRows = page.locator('.oxd-table-body').getByRole('row');
    this.buttonConfirmDelete = page.getByRole('button', { name: 'Yes, Delete' });
    this.toastMessage = page.locator('.oxd-toast');
  }

  async gotoAdmin() {
    await this.sideMenuAdmin.click();
  }

  async addAdminUser(employeeName: string, username: string, password: string) {
    await this.buttonAdd.click();

    await this.dropdownUserRole.click();
    await this.page.getByRole('option', { name: 'Admin' }).click();

    await this.inputEmployeeName.pressSequentially(employeeName, { delay: 100 });
    const option = this.page.getByRole('option').filter({ hasText: employeeName }).first();
    await expect(option).toBeVisible();
    await option.click();

    await this.dropdownStatus.click();
    await this.page.getByRole('option', { name: 'Enabled' }).click();

    await this.inputUsername.fill(username);
    await this.inputPassword.fill(password);
    await this.inputConfirmPassword.fill(password);
    await this.buttonSave.click();
    await expect(this.toastMessage).toContainText('Successfully Saved');
    await expect(this.page).toHaveURL(/admin\/viewSystemUsers/);
  }

  async searchUser(username: string) {
    await this.inputUsername.fill(username);
    await this.buttonSearch.click();
  }

  rowFor(text: string): Locator {
    return this.resultRows.filter({ hasText: text });
  }

  async deleteUser(username: string) {
    await this.rowFor(username).locator('.bi-trash').click();
    await this.buttonConfirmDelete.click();
  }
}
