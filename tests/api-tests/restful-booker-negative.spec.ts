import {expect, test} from '../../fixtures/commonAPIFixture'
import apiendpoints from '../../test-data/api-data/api-endoints.json'
import negativedata from '../../test-data/api-data/api-negative-data.json'


test ("Verify that user receives 400 Bad Request when creating booking with missing fields",
{
    tag: ['@API', '@UAT', '@Negative'],
    annotation: [
        { type : "test Case ID", description : "API_TC_10" },
        { type : "Known defect", description : "returns 500 Internal Server Error instead of 400 Bad Request" }
    ]
}, async ({request}) => {

    test.fail();   // remove once the API returns 400

    // Unique lastname, so the payload can't match an existing booking
    const lastname = `${negativedata.missing_Fields_Booking.lastname}_${Date.now()}`;
    const missingFieldsResp = await request.post(apiendpoints.booking_endpoint, {
        data: { ...negativedata.missing_Fields_Booking, lastname }
    });
    expect(missingFieldsResp.status()).toBe(400);

})

test ("Verify that missing fields booking request returns 500 without leaking internal details & creates no booking",
{
    tag: ['@API', '@UAT', '@Negative', '@SMOKE'],
    annotation: {
          type : "test Case ID",
          description : "API_TC_10"
    }
}, async ({request}) => {

    const lastname = `${negativedata.missing_Fields_Booking.lastname}_${Date.now()}`;
    const missingFieldsResp = await request.post(apiendpoints.booking_endpoint, {
        data: { ...negativedata.missing_Fields_Booking, lastname }
    });

    // Current behaviour; change to 400 once the defect is fixed
    expect(missingFieldsResp.status()).toBe(500);
    const respBody = await missingFieldsResp.text();
    expect(respBody).toBe(negativedata.server_Error_Message);
    for (const pattern of negativedata.sensitive_Info_Patterns) {
        expect.soft(respBody, `body should not match ${pattern}`).not.toMatch(new RegExp(pattern, 'i'));
    }

    // Verify no booking was created
    const searchResp = await request.get(apiendpoints.booking_endpoint, { params: { lastname } });
    expect(searchResp.status()).toBe(200);
    expect(await searchResp.json()).toEqual([]);

})
