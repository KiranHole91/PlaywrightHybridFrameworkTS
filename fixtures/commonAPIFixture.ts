import {test as baseTest} from '@playwright/test'
import CommonAPIUtils from '../utils/CommonAPIUtils';
import BookingAPI from '../utils/BookingAPI';

type commonAPIfixture = {
    tokenFixture : CommonAPIUtils;
    bookingAPI : BookingAPI;
    bookingId : number;
}

export const test = baseTest.extend<commonAPIfixture> ({

    tokenFixture : ({request}, use) => {
        return use ( new CommonAPIUtils(request));

    },

    bookingAPI : ({}, use) => {
        return use ( new BookingAPI());
    },

    // Each test gets its own booking, so it doesn't depend on (or change) shared data
    bookingId : async ({request, bookingAPI, tokenFixture}, use) => {
        const bookingId = await bookingAPI.createBooking(request);

        await use(bookingId);

        // Teardown: clean up the booking (returns 404 if the test already deleted it)
        const tokenValue = await tokenFixture.getAuthToken(request);
        await bookingAPI.deleteBooking(request, bookingId, tokenValue);
    }
})

export {expect} from '@playwright/test';
