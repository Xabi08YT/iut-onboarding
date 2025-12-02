import {getRole, verifyToken} from "~~/server/jwt";
import {updateConfigValue,getConfigValue} from "~~/server/database"

/**
 * @openapi
 * /dateJpo:
 *      get:
 *          tags:
 *              - JPO management
 *          summary: Get the date of the next JPO
 *          responses:
 *              200:
 *                  description: Get the date of the next JPO
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              format: date
 *                              description: The date of the next JPO
 *                              example: "2025-12-02"
 *              405:
 *                  description: Method not allowed
 *              500:
 *                  description: Unknown error
 *      put:
 *          tags:
 *              - JPO management
 *          security:
 *              - JWT: []
 *          summary: Change the date of the JPO
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              value:
 *                                  type: string
 *                                  format: date
 *                                  description: The new date of the JPO
 *                                  example: "2025-12-31"
 *                          required:
 *                              - value
 *          responses:
 *              200:
 *                  description: Change the date of the JPO
 *              401:
 *                  description: Invalid token
 *              403:
 *                  description: Permission denied
 *              500:  
 *                  description: Unknown error
 */
export default defineEventHandler(async (event) => {
    try {
        switch(event.method) {
            case "PUT":
                let token = parseCookies(event)?.onboardingToken;
                if(await verifyToken(token) === false) {
                    return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
                }

                let roles = await getRole(token);

                if(roles === -1 || !(roles.includes("ADMIN") || roles.includes("BDE") || roles.includes("MAINTAINER"))) {
                    return new Response(JSON.stringify({message:"Permission denied."}), {status: 403});
                }
                let body = await readBody(event);
                let tmp = JSON.parse(body);
                let data = {key: "dateJpo", value: tmp.value}
                await updateConfigValue(data);
                return new Response(JSON.stringify({message:null}), {status: 200});
            
            case "GET":
                let dateJPO = await getConfigValue("dateJpo");
                if (!dateJPO) return new Response(JSON.stringify({message:`JPO Date not found`}), {status: 404});
                return new Response(dateJPO.value, {status: 200});
            
            default:
                return new Response(JSON.stringify({message:"Method not allowed. Please read the documentation."}), {status: 405});
        }
    } catch (error: any) {
        return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
    }
})