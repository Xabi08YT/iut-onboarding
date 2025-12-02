import {getRole, verifyToken} from "~~/server/jwt";
import {updateConfigValue, getConfigValue} from "~~/server/database"

/**
 * @openapi
 * /videoJpo:
 *      get:
 *          tags:
 *              - JPO management
 *          summary: Get the link of the JPO video
 *          responses:
 *              200:
 *                  description: Get the link of the JPO video
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              description: The link of the JPO video
 *                              example: "youtube.com/linkofthevideo"
 *              405:
 *                  description: Method not allowed
 *              500:
 *                  description: Unknown error
 *      put:
 *          tags:
 *              - JPO management
 *          security:
 *              - JWT: []
 *          summary: Change the link of the JPO video
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              value:
 *                                  type: string
 *                                  description: The new link of the JPO video
 *                                  example: "youtube.com/newlinkofthevideo"
 *                          required:
 *                              - value
 *          responses:
 *              200:
 *                  description: Change the link of the JPO video
 *              401:
 *                  description: Invalid token
 *              403:
 *                  description: Permission denied
 *              500:
 *                  description: Unknown error
 */
async function handler(req) {
    let body;
    let token = parseCookies(req)?.onboardingToken

    try {
        switch (req.method) {

            case "PUT":
                if (await verifyToken(token) === false) {
                    return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
                }

                let roles = await getRole(token);

                if (roles === -1 || !(roles.includes("ADMIN") || roles.includes("BDE") || roles.includes("MAINTAINER"))) {
                    return new Response(JSON.stringify({message: "Permission denied."}), {status: 403});
                }
                body = await readBody(req);
                let tmp = JSON.parse(body);
                let data = {key: "lienVideoJpo", value: tmp.value}
                console.error(data)
                await updateConfigValue(data);
                return new Response(JSON.stringify({message: null}), {status: 200});

            case "GET":
                let LienVideoJpo = await getConfigValue("lienVideoJpo");
                console.log(LienVideoJpo)
                return new Response(LienVideoJpo.value, {status: 200});

            default:
                return new Response(JSON.stringify({message: "Method not allowed. Please read the documentation."}), {status: 405});
        }
    } catch (error) {
        return new Response(JSON.stringify({message: `Internal Server Error: ${error.message}`}), {status: 500});
    }
}

export default eventHandler(handler);
