import {expect, test} from '../../fixtures/commonAPIFixture'
import { APIResponse } from '@playwright/test'
import apiendpoints from '../../test-data/api-data/api-endoints.json'
import apidata from '../../test-data/api-data/api-module-data.json'
import negativedata from '../../test-data/api-data/api-negative-data.json'

/**
 * Common checks for a rejected (unauthorised) request:
 * 403 Forbidden, plain "Forbidden" body, no internal details leaked
 * @param resp
 * @returns response body as text, for any extra checks in the test
 */
async function verifyForbiddenResponse(resp : APIResponse) : Promise<string>
{
    expect(resp.status()).toBe(403);
    expect(resp.statusText()).toBe('Forbidden');

    const respBody = await resp.text();
    expect(respBody).toBe(negativedata.forbidden_Message);

    for (const pattern of negativedata.sensitive_Info_Patterns) {
        expect.soft(respBody, `body should not match ${pattern}`).not.toMatch(new RegExp(pattern, 'i'));
    }
    return respBody;
}


test ("Verify that user is unable to update booking using PUT API without a valid token & receive Forbidden response",
{
    tag: ['@API', '@UAT', '@Negative'],
    annotation: {
          type : "test Case ID",
          description : "API_TC_07"
    }
}, async ({request, bookingAPI, bookingId}) => {

    // Snapshot the booking before the unauthorised call
    const originalBooking = await bookingAPI.getBooking(request, bookingId);

    // No Cookie / Authorization header
    const noTokenResp = await request.put(`${apiendpoints.booking_endpoint}/${bookingId}`, {
        data: apidata.update_Booking
    });
    await verifyForbiddenResponse(noTokenResp);

    // Verify the booking was not changed
    expect(await bookingAPI.getBooking(request, bookingId)).toEqual(originalBooking);

})

test ("Verify that user is not able to update booking using PUT API with invalid token & receive Forbidden response",
{
    tag: ['@API', '@UAT', '@Negative'],
    annotation: {
          type : "test Case ID",
          description : "API_TC_08"
    }
}, async ({request, bookingAPI, bookingId}) => {

    const originalBooking = await bookingAPI.getBooking(request, bookingId);

    const invalidTokenResp = await request.put(`${apiendpoints.booking_endpoint}/${bookingId}`, {
        headers: { Cookie: `token=${negativedata.invalid_Token}` },
        data: apidata.update_Booking
    });
    const invalidTokenRespBody = await verifyForbiddenResponse(invalidTokenResp);

    // Bad token must not be echoed back in body or headers
    expect(invalidTokenRespBody).not.toContain(negativedata.invalid_Token);
    expect(JSON.stringify(invalidTokenResp.headers())).not.toContain(negativedata.invalid_Token);

    // Verify the booking was not changed
    expect(await bookingAPI.getBooking(request, bookingId)).toEqual(originalBooking);

})
