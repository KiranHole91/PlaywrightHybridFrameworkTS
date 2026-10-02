import { Page, Locator } from '@playwright/test';

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

  constructor(page: Page) {
    this.page = page;
    this.linkEmployeeList = page.getByRole('link', { name: 'Employee List' });
    this.linkAddEmployee = page.getByRole('link', { name: 'Add Employee' });
    this.linkReport = page.getByRole('link', { name: 'Reports' });
    this.inputFirstName = page.getByPlaceholder('First Name');
    this.inputLastName = page.getByPlaceholder('Last Name');
    this.inputEmployeeID = page.getByRole('textbox', { name: 'Employee Id' });
    this.buttonCancel = page.getByRole('button', { name: 'Cancel' });
    this.buttonSave = page.getByRole('button', { name: 'Save' });
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
  }
}
