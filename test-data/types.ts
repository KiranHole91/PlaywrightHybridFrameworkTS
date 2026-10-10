// Shared by the JSON-driven specs and the Excel → JSON converter
export type EmployeeData = {
  id: string;
  title: string;
  tags: string[];
  firstName: string;
  middleName?: string;
  lastName: string;
  login?: { usernamePrefix: string; status: 'Enabled' | 'Disabled' };
};
