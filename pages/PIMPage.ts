import { Page, Locator, expect } from '@playwright/test';

export class PIMPage {
  readonly page: Page;
  readonly linkEmployeeList: Locator;
  readonly linkAddEmployee: Locator;
  readonly linkReport: Locator;
  readonly inputFirstName: Locator;
  readonly inputLastName: Locator;
  readonly inputEmployeeID: Locator;
  readonly buttonCancel: Locator;
  readonly buttonSave: Locator;
  readonly linkPIM : Locator;
  readonly inputEmployeeNameSearch: Locator;
  readonly autoSuggestList: Locator;
  readonly buttonSearch: Locator;
  readonly resultRows: Locator;
  readonly buttonConfirmDelete: Locator;
  readonly toastMessage: Locator;
  readonly inputMiddleName: Locator;
  readonly toggleCreateLogin: Locator;
  readonly inputUsername: Locator;
  readonly inputPassword: Locator;
  readonly inputConfirmPassword: Locator;

  constructor(page: Page) {
    this.page = page;
    this.linkEmployeeList = page.getByRole('link', { name: 'Employee List' });
    this.linkAddEmployee = page.getByRole('link', { name: 'Add Employee' });
    this.linkReport = page.getByRole('link', { name: 'Reports' });
    this.inputFirstName = page.getByPlaceholder('First Name');
    this.inputLastName = page.getByPlaceholder('Last Name');
    this.inputEmployeeID = page
                        .locator('.oxd-input-group', { hasText: 'Employee Id' })
                        .locator('input');
    this.buttonCancel = page.getByRole('button', { name: 'Cancel' });
    this.buttonSave = page.getByRole('button', { name: 'Save' });
    this.linkPIM = page.getByRole('link', { name: 'PIM' });
    this.inputEmployeeNameSearch = page
                         .locator('.oxd-input-group', { hasText: 'Employee Name' })
                         .getByPlaceholder('Type for hints...');
    this.autoSuggestList = page.getByRole('listbox');
    this.buttonSearch = page.getByRole('button', { name: 'Search' });
    this.resultRows = page.locator('.oxd-table-body').getByRole('row');
    this.buttonConfirmDelete = page.getByRole('button', { name: 'Yes, Delete' });
    this.toastMessage = page.locator('.oxd-toast');
    this.inputMiddleName = page.getByPlaceholder('Middle Name');
    this.toggleCreateLogin = page.locator('.oxd-switch-input');
    this.inputUsername = page.locator('.oxd-input-group', { hasText: 'Username' }).locator('input');
    this.inputPassword = page.locator('input[type="password"]').nth(0);
    this.inputConfirmPassword = page.locator('input[type="password"]').nth(1);
  }

  async gotoPIM(){
    await this.linkPIM.click();
    await expect(this.page).toHaveURL(/pim\/viewEmployeeList/);
  }


  async addEmployee(
    employeeFirstName: string,
    employeeLastName: string,
    employeeID: number | string,
  ) {
    await this.linkAddEmployee.click();
    await this.inputFirstName.pressSequentially(employeeFirstName);
    await this.inputLastName.pressSequentially(employeeLastName);
    await this.inputEmployeeID.fill(String(employeeID));
    await this.buttonSave.click();
    // Save is slow on the demo site, so allow more than the default 5s
    await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/, { timeout: 15000 });
  }

  // Passing login switches on "Create Login Details" and fills the user fields
  async addEmployeeWithDetails(
    emp: { firstName: string; middleName?: string; lastName: string; employeeId: string },
    login?: { username: string; password: string; status: 'Enabled' | 'Disabled' },
  ) {
    await this.linkAddEmployee.click();
    await this.inputFirstName.pressSequentially(emp.firstName);
    if (emp.middleName) await this.inputMiddleName.fill(emp.middleName);
    await this.inputLastName.pressSequentially(emp.lastName);
    await this.inputEmployeeID.fill(emp.employeeId);

    if (login) {
      await this.toggleCreateLogin.click();
      await expect(this.inputUsername).toBeVisible();
      await this.inputUsername.fill(login.username);
      await this.page.locator('label', { hasText: login.status }).click();
      await this.inputPassword.fill(login.password);
      await this.inputConfirmPassword.fill(login.password);
    }

    await this.buttonSave.click();
    // Save is slow on the demo site, so allow more than the default 5s
    await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/, { timeout: 15000 });
  }

  /**
   * Types into the Employee Name auto-suggest and picks the matching option.
   * Nothing may take focus between typing and clicking, or the dropdown closes.
   */
  async selectEmployeeFromAutoSuggest(searchText: string, optionToPick: string | RegExp = searchText) {
    await this.inputEmployeeNameSearch.click();
    await this.inputEmployeeNameSearch.pressSequentially(searchText, { delay: 100 });

    await expect(this.autoSuggestList).toBeVisible();
    await expect(this.autoSuggestList).not.toContainText('Searching');

    const option = this.autoSuggestList.getByRole('option').filter({ hasText: optionToPick }).first();
    await expect(option).toBeVisible();
    await option.click();
  }

  async searchEmployee(searchText: string, optionToPick?: string | RegExp) {
    await this.linkEmployeeList.click();
    await this.selectEmployeeFromAutoSuggest(searchText, optionToPick);
    await this.buttonSearch.click();
  }

  rowFor(text: string | RegExp): Locator {
    return this.resultRows.filter({ hasText: text });
  }

  async deleteEmployee(searchText: string, optionToPick?: string | RegExp) {
    await this.searchEmployee(searchText, optionToPick);
    const row = this.rowFor(optionToPick ?? searchText);
    await expect(row).toHaveCount(1);
    await row.locator('.bi-trash').click();
    await this.buttonConfirmDelete.click();
  }
}
