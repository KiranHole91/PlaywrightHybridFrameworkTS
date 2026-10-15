import {expect, test} from '../../fixtures/commonAPIFixture'
import apiendpoints from '../../test-data/api-data/api-endoints.json'
import apidata from '../../test-data/api-data/api-module-data.json'


test ("Verify that user is abl to fetch all booking IDs using GET api & receive vlid response",
{
    tag: ['@API', '@UAT'],
    annotation: {
          type : "test Case ID",
          description : "API_TC_01"
    }
}, async ({request}) => {

    const bookingIdResp = await request.get(apiendpoints.booking_endpoint);
    
    expect(bookingIdResp.status()).toBe(200);
    expect(bookingIdResp.statusText()).toBe('OK');
    expect(bookingIdResp.headers()).toBeTruthy();
    expect(bookingIdResp.headers()['content-type']).toBe(apidata['content-type']);

     const bookingIdJsonResp = await bookingIdResp.json();
    expect(bookingIdJsonResp).not.toBeNull();
    
}
)

test ("Verify that user is able to fetch booking details using GET API & receive valid response",
{
    tag: ['@API', '@UAT'],
    annotation: {
          type : "test Case ID",
          description : "API_TC_02"
    }
}, async ({request}) => {

    const bookingDetailsResp = await request.get(`${apiendpoints.booking_endpoint}/${apidata.bookingId}`)
     expect (bookingDetailsResp.status()).toBe(200);
     expect (bookingDetailsResp.statusText()).toBe('OK');

    const bookingJsonResp = await bookingDetailsResp.json();
    expect (bookingJsonResp).not.toBeNull();
    expect (bookingJsonResp.firstname).toEqual(apidata.firstname);

})

test ("Verify that user is able to create new booking using POST API & receive valid response",
{
    tag: ['@API', '@UAT'],
    annotation: {
          type : "test Case ID",
          description : "API_TC_03"
    }
}, async ({request}) => {

    const CreateBookingResp = await request.post(apiendpoints.booking_endpoint, { data : apidata.create_Booking })
    expect (CreateBookingResp.status()).toBe(200);

    const createBookingRespJson = await CreateBookingResp.json();
    expect(createBookingRespJson.booking).toMatchObject(apidata.create_Booking);

}
)



test ("Verify that user is able to update booking using PUT API & receive valid response",
{
    tag: ['@API', '@UAT'],
    annotation: {
          type : "test Case ID",
          description : "API_TC_04"
    }
}, async ({request, tokenFixture, bookingId}) => {

    const tokenValue = await tokenFixture.getAuthToken(request);

    const updateBookingResp = await request.put(`${apiendpoints.booking_endpoint}/${bookingId}`, {
        headers: { Cookie: `token=${tokenValue}` },
        data: apidata.update_Booking
    });
    expect(updateBookingResp.status()).toBe(200);
    expect(updateBookingResp.statusText()).toBe('OK');
    expect(updateBookingResp.headers()['content-type']).toBe(apidata['content-type']);

    const updateBookingRespJson = await updateBookingResp.json();
    expect(updateBookingRespJson).toEqual(apidata.update_Booking);

    // Verify the update was persisted
    const getBookingResp = await request.get(`${apiendpoints.booking_endpoint}/${bookingId}`);
    expect(getBookingResp.status()).toBe(200);
    expect(await getBookingResp.json()).toEqual(apidata.update_Booking);

})

test ("Verify that user is able to partially update booking using PATCH API & receive valid response",
{
    tag: ['@API', '@UAT'],
    annotation: {
          type : "test Case ID",
          description : "API_TC_05"
    }
}, async ({request, tokenFixture, bookingId}) => {

    const tokenValue = await tokenFixture.getAuthToken(request);

    const partialUpdateResp = await request.patch(`${apiendpoints.booking_endpoint}/${bookingId}`, {
        headers: { Cookie: `token=${tokenValue}` },
        data: apidata.partial_Update_Booking
    });
    expect(partialUpdateResp.status()).toBe(200);
    expect(partialUpdateResp.statusText()).toBe('OK');
    expect(partialUpdateResp.headers()['content-type']).toBe(apidata['content-type']);

    // Patched fields change, every other field keeps its created value
    const expectedBooking = { ...apidata.create_Booking, ...apidata.partial_Update_Booking };
    const partialUpdateRespJson = await partialUpdateResp.json();
    expect(partialUpdateRespJson).toEqual(expectedBooking);

    // Verify the partial update was persisted
    const getBookingResp = await request.get(`${apiendpoints.booking_endpoint}/${bookingId}`);
    expect(getBookingResp.status()).toBe(200);
    expect(await getBookingResp.json()).toEqual(expectedBooking);

})

test ("Verify that user is able to delete booking using DELETE API & receive valid response",
{
    tag: ['@API', '@UAT'],
    annotation: {
          type : "test Case ID",
          description : "API_TC_06"
    }
}, async ({request, tokenFixture, bookingId}) => {

    const tokenValue = await tokenFixture.getAuthToken(request);

    const deleteBookingResp = await request.delete(`${apiendpoints.booking_endpoint}/${bookingId}`, {
        headers: { Cookie: `token=${tokenValue}` }
    });
    // Restful-booker returns 201 Created for a successful delete
    expect(deleteBookingResp.status()).toBe(201);
    expect(deleteBookingResp.statusText()).toBe('Created');

    // Verify the booking no longer exists
    const getBookingResp = await request.get(`${apiendpoints.booking_endpoint}/${bookingId}`);
    expect(getBookingResp.status()).toBe(404);

})
