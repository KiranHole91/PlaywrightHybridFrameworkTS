import { test as baseTest } from '../fixtures/POMfixture';
import { encryptionDecryption } from '../utils/encryptionDecryption';

type commonFixtureType = {
  encdec: encryptionDecryption;
};

export const test = baseTest.extend<commonFixtureType>({
  // eslint-disable-next-line no-empty-pattern
  encdec: async ({}, use) => {
    await use(new encryptionDecryption());
  },
});
export { expect } from '../fixtures/POMfixture';
