import { faker } from '@faker-js/faker';

// Values are generated once per call, so each test gets one consistent employee
export const createEmployee = () => {
  return {
    employeeFirstName: faker.person.firstName(),
    employeeLastName: faker.person.lastName(),
    employeeUsername: faker.internet.username(),
    employeePassword: faker.internet.password(),
  };
};
