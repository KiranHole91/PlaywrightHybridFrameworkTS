import { test as baseTest } from '../fixtures/POMfixture';
import { encryptionDecryption } from '../utils/encryptionDecryption';
import APIMockUtils from '../utils/APIMockUtils';

type commonFixtureType = {
  encdec: encryptionDecryption;
  apiMock: APIMockUtils;
};

export const test = baseTest.extend<commonFixtureType>({
  // eslint-disable-next-line no-empty-pattern
  encdec: async ({}, use) => {
    await use(new encryptionDecryption());
  },

  // eslint-disable-next-line no-empty-pattern
  apiMock: async ({}, use) => {
    await use(new APIMockUtils());
  },
});
export { expect } from '../fixtures/POMfixture';
