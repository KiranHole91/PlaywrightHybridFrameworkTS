import {test as baseTest} from '@playwright/test'
import CommonAPIUtils from '../utils/CommonAPIUtils';

type commonAPIfixture = {
    tokenFixture : CommonAPIUtils;
}

export const test = baseTest.extend<commonAPIfixture> ({

    tokenFixture : ({request}, use) => {
        return use ( new CommonAPIUtils(request));

    }
})

export {expect} from '@playwright/test';