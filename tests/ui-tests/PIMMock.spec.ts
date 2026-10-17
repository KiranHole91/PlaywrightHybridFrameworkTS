import { test, expect } from '../../fixtures/hooks-fixture';
import mockData from '../../test-data/api-data/mock-data.json';

// Employee list API called by the PIM page (has a query string, so match with a RegExp)
const EMPLOYEE_LIST_API = /\/api\/v2\/pim\/employees\?/;

type EmployeeListResponse = { data: { firstName: string }[] };

// gotoURL is a side-effect fixture: logs in and lands on the dashboard
test.describe('PIM - API mocking', () => {

  test('shows "No Records Found" when API returns empty', async ({ pimPage, apiMock, gotoURL }) => {
    await apiMock.mockResponse(pimPage.page, EMPLOYEE_LIST_API, mockData.emptyEmployeeList);
    await pimPage.gotoPIM();

    await expect(pimPage.noRecordsText).toBeVisible();
    await expect(pimPage.resultRows).toHaveCount(0);
  });

  test('shows the mocked employee', async ({ pimPage, apiMock, gotoURL }) => {
    await apiMock.mockResponse(pimPage.page, EMPLOYEE_LIST_API, mockData.singleEmployeeList);
    await pimPage.gotoPIM();

    await expect(pimPage.page.getByText('(1) Record Found')).toBeVisible();
    await expect(pimPage.rowFor('MOCK001')).toContainText(/Mocky.*Mockerson/);
  });

  test('shows a modified first name from the real API', async ({ pimPage, apiMock, gotoURL }) => {
    await apiMock.modifyResponse(pimPage.page, EMPLOYEE_LIST_API, (json: EmployeeListResponse) => {
      json.data[0].firstName = 'PatchedByMock';
      return json;
    });
    await pimPage.gotoPIM();

    await expect(pimPage.rowFor('PatchedByMock')).toHaveCount(1);
  });
});
