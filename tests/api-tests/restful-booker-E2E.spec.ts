import { test, expect } from "../../fixtures/commonAPIFixture";
import apiendpoint from '../../test-data/api-data/api-endoints.json'
import apiData from '../../test-data/api-data/api-module-data.json'

test("Verify that user is able to create, partially update & delete a booking using API chaining",
{
    tag: ['@API', '@SMOKE', '@E2E'],
    annotation: {
          type : "test Case ID",
          description : "API_TC_14"
    }
}, async({request, tokenFixture}) => {

    const bookingID = await test.step('Create booking using POST API', async () => {
        const bookingResp = await request.post(apiendpoint.booking_endpoint,
                     {data : apiData.create_Booking} )

        expect(bookingResp.status()).toBe(200);
        const bookingJsonResp = await bookingResp.json();
        console.log(`Booking ID ${bookingJsonResp.bookingid} is created with name : ${bookingJsonResp.booking.firstname} and Total price: ${bookingJsonResp.booking.totalprice}`);
        return bookingJsonResp.bookingid;
    });

    const tokenValue = await test.step('Generate auth token', async () => {
        return await tokenFixture.getAuthToken(request);
    });

    await test.step('Partially update booking using PATCH API', async () => {
        const patchedBookingResp = await request.patch(`${apiendpoint.booking_endpoint}/${bookingID}`,{
                        headers : {Cookie: `token=${tokenValue}`},
                        data : apiData.partial_Update_Booking
                })
        expect(patchedBookingResp.status()).toBe(200);

        const patchedBookingJSONResp = await patchedBookingResp.json();
        console.log(`Booking ID ${bookingID} is PATCHED with name : ${patchedBookingJSONResp.firstname} and Total price: ${patchedBookingJSONResp.totalprice}`);
    });

    await test.step('Delete booking using DELETE API', async () => {
        const deletedResp = await request.delete(`${apiendpoint.booking_endpoint}/${bookingID}`, {
            headers : {Cookie: `token=${tokenValue}`}
            })
        expect(deletedResp.status()).toBe(201);
    });

    await test.step('Verify deleted booking returns 404 using GET API', async () => {
        const getBookingResp = await request.get(`${apiendpoint.booking_endpoint}/${bookingID}`);
        expect(getBookingResp.status()).toBe(404);
        console.log(`${bookingID} Not Found, Deleted successfully`);
    });
})
