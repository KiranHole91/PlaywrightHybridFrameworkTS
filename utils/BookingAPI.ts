import { APIRequestContext, expect } from "@playwright/test";
import apiendpoints from "../test-data/api-data/api-endoints.json"
import apidata from "../test-data/api-data/api-module-data.json"

export default class BookingAPI{

    /**
     * Creates a new booking & returns its bookingid
     * @param request
     * @param data booking payload, defaults to create_Booking test data
     * @returns
     */
public async createBooking(request : APIRequestContext, data = apidata.create_Booking) : Promise<number>
{
    const createBookingResp = await request.post(apiendpoints.booking_endpoint, { data : data });
    expect(createBookingResp.status()).toBe(200);

    const createBookingRespJson = await createBookingResp.json();
    expect(createBookingRespJson.bookingid).toBeTruthy();
    return createBookingRespJson.bookingid;
}

    /**
     * Fetches booking details for the given bookingId
     * @param request
     * @param bookingId
     * @returns booking json
     */
public async getBooking(request : APIRequestContext, bookingId : number)
{
    const getBookingResp = await request.get(`${apiendpoints.booking_endpoint}/${bookingId}`);
    expect(getBookingResp.status()).toBe(200);
    return getBookingResp.json();
}

    /**
     * Deletes a booking, needs auth token sent as a Cookie header
     * @param request
     * @param bookingId
     * @param token
     * @returns
     */
public async deleteBooking(request : APIRequestContext, bookingId : number, token : string)
{
    return request.delete(`${apiendpoints.booking_endpoint}/${bookingId}`, {
                     headers: { Cookie: `token=${token}` }
            });
}
}
