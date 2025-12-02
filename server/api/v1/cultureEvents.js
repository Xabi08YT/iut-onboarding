import {
    createCultureEvent, updateCultureEvent, deleteCultureEvent, getCultureEvents
} from "~~/server/database";
import {getRole, verifyToken} from "~~/server/jwt";
import {parseCookies, setCookie} from "h3";

/**
 * @openapi
 * /cultureEvent:
 *   get:
 *     tags:
 *      - Culture meetings management
 *     security:
 *      - JWT: []
 *     description: "Get a list containing all the cultural events that are currently stored in the database"
 *     responses:
 *       200:
 *         description: "Return a JSON array containing every cultural event stored in the database"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Access denied."
 *   post:
 *     tags:
 *      - Culture meetings management
 *     security:
 *      - JWT: []
 *     description: "Create and save a new cultural event to the database"
 *     requestBody:
 *          required : true
 *     parameters:
 *          -in:query
 *          name: "title"
 *          required : true
 *          schema:
 *              type:string
 *          description: "event cultural envent title to add"
 *          example:"template title"
 *          -in:query
 *          name: "startTS"
 *          required:true
 *          schema:
 *              type:string
 *              format:date-time
 *          description: "starting date of the cultural event"
 *          example:"2025-12-31T12:55:15.000Z"
 *          -in:query
 *          name:"endTS"
 *          required:true
 *          schema:
 *              type:string
 *              format:date-time
 *          description : "ending date of the cultural event"
 *          example:"2025-12-31T12:55:15.000Z"
 *          -in:query
 *          name:"eventTS"
 *          required:true
 *          schema:
 *              type:string
 *              format:date-time
 *          description:"day of the cultural event"
 *          example:"2025-12-31T12:55:15.000Z"
 *     responses:
 *       201:
 *         description: "The object has been saved"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Access denied."
 *   put:
 *     tags:
 *      - Culture meetings management
 *     security:
 *      - JWT: []
 *     request-body:
 *          required : true
 *     parameters:
 *          -in:query
 *          name:"id"
 *          required:true
 *          schema:
 *              type:integer
 *          description:"id of the culural event"
 *          example: 1
 *          -in:query
 *          name: "title"
 *          required : true
 *          schema:
 *              type:string
 *          description: "event cultural envent title to add"
 *          example:"template title"
 *          -in:query
 *          name: "startTS"
 *          required:true
 *          schema:
 *              type:string
 *              format:date-time
 *          description: "starting date of the cultural event"
 *          example:"2025-12-31T12:55:15.000Z"
 *          -in:query
 *          name:"endTS"
 *          required:true
 *          schema:
 *              type:string
 *              format:date-time
 *          description : "ending date of the cultural event"
 *          example:"2025-12-31T12:55:15.000Z"
 *          -in:query
 *          name:"eventTS"
 *          required:true
 *          schema:
 *              type:string
 *              format:date-time
 *          description:"day of the cultural event"
 *          example:"2025-12-31T12:55:15.000Z"
 *          -in:query
 *          name:"image"
 *          required:true
 *          schema:
 *              type:string
 *          description: "image link associated for a cultural event"
 *     description: "Modify an existing cultural event"
 *     responses:
 *       200:
 *         description: "Cultural event modified"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Access denied."
 *       410:
 *         description: "This event does not exist."
 *   delete:
 *      request-body:
 *          required:true
 *      parameters:
 *          -in:query
 *          name:id
 *          required:true
 *          schema:
 *              type:integer
 *          description: "cultural event id to delete"
 *          example : 1
 *     tags:
 *      - Culture meetings management
 *     security:
 *      - JWT: []
 *     description: "Deletes an existing event"
 *     responses:
 *       200:
 *         description: "Cultural event deleted"
 *
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Access denied."
 *       410:
 *         description: "This event does not exist."
 */
async function handler(req) {
    let body;
    let token = parseCookies(req)?.onboardingToken
    if (await verifyToken(token) === false) {
        return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
    }

    let roles = await getRole(token);

    if (roles === -1 || !(roles.includes("ADMIN") || roles.includes("CULTURE") || roles.includes("MAINTAINER"))) {
        return new Response(JSON.stringify({message: "Permission denied."}), {status: 403});
    }
    try {
        switch (req.method) {
            case "POST":
                if (await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
                }
                body = await readBody(req);
                await createCultureEvent(body);
                return new Response(JSON.stringify({message: "Event created successfully."}), {status: 201});
            case "PUT":
                if (await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
                }
                body = await readBody(req);
                await updateCultureEvent(body);
                return new Response(JSON.stringify({message: null}), {status: 200});
            case "DELETE":
                if (await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
                }
                body = await readBody(req);
                await deleteCultureEvent(body);
                return new Response(JSON.stringify({message: null}), {status: 200});
            case "GET":
                return new Response(JSON.stringify(await getCultureEvents()), {status: 200});
            default:
                return new Response(JSON.stringify({message: "Method not allowed. Please read the documentation."}), {status: 405});
        }
    } catch (error) {
        return new Response(JSON.stringify({message: `Internal Server Error: ${error.message}`}), {status: 500});
    }
}

export default eventHandler(handler);
