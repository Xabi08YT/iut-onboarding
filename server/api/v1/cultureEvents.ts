import {
    createCultureEvent, updateCultureEvent, deleteCultureEvent, getCultureEvents
} from "~~/server/database";
import {getRole, verifyToken} from "~~/server/jwt";
import {parseCookies, setCookie} from "h3";

/**
 * @openapi
 * /cultureEvents:
 *   get:
 *     tags:
 *       - Culture meetings management
 *     security:
 *       - JWT: []
 *     summary: "Get a list containing all the cultural events that are currently stored in the database"
 *     responses:
 *       200:
 *         description: "Return a JSON array containing every cultural event stored in the database"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Concert classic"
 *                   description:
 *                      type: string
 *                      example: "A concert made by..."
 *                   startTS:
 *                     type: string
 *                     format: date-time
 *                   endTS:
 *                     type: string
 *                     format: date-time
 *                   eventTS:
 *                     type: string
 *                     format: date-time
 *                   image:
 *                     type: string
 *                     example: "https://img.com/event.png"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Access denied."
 *
 *   post:
 *     tags:
 *       - Culture meetings management
 *     security:
 *       - JWT: []
 *     summary: "Create and save a new cultural event to the database"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "event cultural title to add"
 *                 example: "template title"
 *               description:
 *                  type: string
 *                  description: "event description"
 *                  example: "A super film about..."
 *               startTS:
 *                 type: string
 *                 format: date-time
 *                 description: "starting date of the cultural event"
 *                 example: "2025-12-31T12:55:15.000Z"
 *               endTS:
 *                 type: string
 *                 format: date-time
 *                 description: "ending date of the cultural event"
 *                 example: "2025-12-31T12:55:15.000Z"
 *               eventTS:
 *                 type: string
 *                 format: date-time
 *                 description: "day of the cultural event"
 *                 example: "2025-12-31T12:55:15.000Z"
 *               image:
 *                 type: string
 *                 description: "image link associated for a cultural event"
 *                 example: "https://img.com/event.png"
 *             required:
 *               - title
 *               - startTS
 *               - endTS
 *               - eventTS
 *               - description
 *     responses:
 *       201:
 *         description: "The object has been saved"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Access denied."
 *
 *   put:
 *     tags:
 *       - Culture meetings management
 *     security:
 *       - JWT: []
 *     summary: "Modify an existing cultural event"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: "id of the cultural event"
 *                 example: 1
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startTS:
 *                 type: string
 *                 format: date-time
 *               endTS:
 *                 type: string
 *                 format: date-time
 *               eventTS:
 *                 type: string
 *                 format: date-time
 *               image:
 *                 type: string
 *                 example: "https://img.com/event.png"
 *             required:
 *               - id
 *               - title
 *               - description
 *               - startTS
 *               - endTS
 *               - eventTS
 *     responses:
 *       200:
 *         description: "Cultural event modified"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Access denied."
 *       410:
 *         description: "This event does not exist."
 *
 *   delete:
 *     tags:
 *       - Culture meetings management
 *     security:
 *       - JWT: []
 *     summary: "Deletes an existing event"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: "Cultural event id to delete"
 *                 example: 1
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: "Cultural event deleted"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Access denied."
 *       410:
 *         description: "This event does not exist."
 */
export default defineEventHandler(async (event) => {
    const method = event.method;
    const cookies = parseCookies(event);
    const token: string = cookies?.onboardingToken;
    let body;

    if(await verifyToken(token) === false) {
        return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
    }

    let roles = await getRole(token);

    if (roles === -1 || !(roles.includes("ADMIN") || roles.includes("CULTURE") || roles.includes("MAINTAINER"))) {
        return new Response(JSON.stringify({message: "Permission denied."}), {status: 403});
    }
    try {
        switch(method) {
            case "POST":
                body = await readBody(event);
                await createCultureEvent(body);
                return new Response(JSON.stringify({message: "Event created successfully."}), {status: 201});
            case "PUT":
                body = await readBody(event);
                await updateCultureEvent(body);
                return new Response(JSON.stringify({message: null}), {status: 200});
            case "DELETE":
                body = await readBody(event);
                await deleteCultureEvent(body);
                return new Response(JSON.stringify({message: null}), {status: 200});
            case "GET":
                return new Response(JSON.stringify(await getCultureEvents()), {status: 200});
            default:
                return new Response(JSON.stringify({message: "Method not allowed. Please read the documentation."}), {status: 405});
        }
    } catch (error: any) {
        return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
    }
})
