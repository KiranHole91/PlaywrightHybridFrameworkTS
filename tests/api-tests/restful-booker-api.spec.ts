import {expect, test} from '../../fixtures/hooks-fixture'
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
    expect(bookingIdResp.statusText()).toBe('OK')
    ;
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