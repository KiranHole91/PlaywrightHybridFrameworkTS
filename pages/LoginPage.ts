import { Locator, Page } from '@playwright/test';

export class LoginPage {
  /**
   * Properties of page
   */
  readonly page: Page;
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  /**
   * initialized properties
   * @param page
   */
  constructor(page: Page) {
    this.page = page;
    this.userNameInput = page.getByRole('textbox', { name: 'username' });
    this.passwordInput = page.getByRole('textbox', { name: 'password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  /**
   * Method actions on the page
   */

  async gotoOrangeHRM() {
    await this.page.goto('/');
  }

  async loginToOrgangeHRM(userName: string, password: string) {
    await this.userNameInput.fill(userName);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
