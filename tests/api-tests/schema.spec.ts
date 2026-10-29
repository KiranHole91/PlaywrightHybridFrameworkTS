import { test, expect } from "@playwright/test";
import apiendpoint from '../../test-data/api-data/api-endpoints.json'
import apidata from '../../test-data/api-data/api-module-data.json'
import schema from '../../test-data/api-data/api-schema.json'
import Ajv from "ajv";

    test("schema validation for create booking", {
        
    tag: ['@API', '@SCHEMA', '@SMOKE'],
    annotation: {
          type : "test Case ID",
          description : "API_TC_10"
    }
},

     async ({request}) =>{

        const resp = await request.post(apiendpoint.booking_endpoint, {
                data: apidata.create_Booking
        })
        expect(resp.ok()).toBeTruthy();

        const respBody = await resp.json();

        const ajv = new Ajv();
        const validate = ajv.compile(schema.createBookingSchema)
        const result = validate(respBody.booking);
        expect(result, JSON.stringify(validate.errors)).toBeTruthy();
})
