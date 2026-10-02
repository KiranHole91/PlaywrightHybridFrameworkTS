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
  }

  async gotoPIM(){
    await this.linkPIM.click();
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
    await expect(this.page).toHaveURL(/pim\/viewPersonalDetails/);
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
