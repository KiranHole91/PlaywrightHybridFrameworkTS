import { APIRequestContext, expect } from "@playwright/test";
import apiendpoints from "../test-data/api-data/api-endoints.json"
import { encryptionDecryption } from "./encryptionDecryption";

export default class CommonAPIUtils{

    readonly request : APIRequestContext;

    constructor(request : APIRequestContext)
    {
        this.request = request;
    }

 
    /**
     * PUT, PATCH & DELETE need an auth token, sent as a Cookie header
     * @param request 
     * @returns 
     */
public async getAuthToken(request : APIRequestContext) 
{
    //First Encrypt & use Decrypted credentials
    const encDecObj = new encryptionDecryption();
    const apiUserName = encDecObj.decryptData(process.env.API_USERNAME!);
    const apiPassword = encDecObj.decryptData(process.env.API_PASSWORD!)

    const createAuthResp = await request.post(apiendpoints.auth_endpoint, {
                     data: { "username": apiUserName, 
                              "password": apiPassword
                          }
            });
    expect(createAuthResp.status()).toBe(200);

    const createAuthJSONResp = await createAuthResp.json();
    expect(createAuthJSONResp.token).toBeTruthy();
    return createAuthJSONResp.token;
}
}