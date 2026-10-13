import {expect, test} from '../../fixtures/hooks-fixture'
import apiendpoints from '../../test-data/api-data/api-endoints.json'
import apidata from '../../test-data/api-data/api-module-data.json'

test("API GET Test", async ({request}) => {

  const ids =  await request.get("/booking");
  console.log(await ids.json());

})

test ("Verify that user is abl to fetch all booking IDs using GET api & receive vlid response",{
tag: ['@API', '@UAT'],
annotation: {
    type : "test ID",
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

