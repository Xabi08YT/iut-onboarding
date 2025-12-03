import {getConfigValue, PrismaKeyValue, updateConfigValue} from "~~/server/database";
import {parseCookies} from "h3";
import {getRole, verifyToken} from "~~/server/jwt";

/**
 * @openapi
 * /hyperplanningEndpoint:
 *  get:
 *      tags:
 *          - Hyperplanning management
 *      summary: "Get Hyperplanning version and ICALs IDs "
 *      responses:
 *          200:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              version:
 *                                  type: object
 *                                  description: "Contains the version object for the timetable software and the related key in DB"
 *                                  properties:
 *                                  key:
 *                                      type: string
 *                                      example: "HPVersion"
 *                                  value:
 *                                      type: string
 *                                      example: "2025.5.6"
 *                              icals:
 *                                  type: object
 *                                  description: "Object under the JSON string form containing all ical IDs"
 *                                  properties:
 *                                      key:
 *                                          type: string
 *                                          example: "HPIcals"
 *                                      value:
 *                                          type: string
 *                                          example: "{}"
 *  put:
 *      tags:
 *          - Hyperplanning management
 *      summary: "Updates Hyperplanning version and ICALs IDs"
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          version:
 *                              type: string
 *                              description: "New Hyperplanning version to save"
 *                              example: "2026.1.0"
 *                          icals:
 *                              type: string
 *                              description: "Icals IDs under the JSON string form"
 *                              example: "..."
 *      responses:
 *          200:
 *              description: "Updated successfully."
 *          401:
 *              description: "Expired or missing user token."
 *          403:
 *              description: "Access denied."
 *          500:
 *              description: "Internal server error."
 */
export default defineEventHandler(async (event) => {
    switch (event.method) {
        case "GET":
            let hp_version: PrismaKeyValue|null = await getConfigValue("HPVersion");
            let hp_icals: PrismaKeyValue|null = await getConfigValue("HPIcals");

            return new Response(JSON.stringify({version: hp_version, icals: hp_icals}), {status: 200});
        case "PUT":
            let token: string = parseCookies(event)?.onboardingToken
            if (await verifyToken(token) === false) {
                return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
            }

            let roles = await getRole(token);

            if (roles === -1 || !(roles.includes("ADMIN") || roles.includes("BDE") || roles.includes("MAINTAINER") || !roles.includes("ENSEIGNANT"))) {
                return new Response(JSON.stringify({message: "Permission denied."}), {status: 403});
            }

            let body = await readBody(event);
            let parsed = JSON.parse(body);

            try {
                await updateConfigValue({key: "HPVersion", value: JSON.stringify(parsed.version)});
                await updateConfigValue({key: "HPIcals", value: JSON.stringify(parsed.icals)})
                return new Response(JSON.stringify({message: "Success"}), {status: 200});
            } catch (error) {
                return new Response(JSON.stringify({message: "Internal server error: Request could not be executed. The request may be invalid or the server encountered a problem."}), {status: 500});
            }
    }
});

