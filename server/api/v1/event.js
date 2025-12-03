import {createEvent, getEvents, updateEvent, deleteEvent} from "~~/server/database";
import {getRole, verifyToken} from "~~/server/jwt";
import {parseCookies, setCookie} from "h3";

/**
 * @openapi
 * /event:
 *   get:
 *     tags:
 *       - Event management
 *     security:
 *       - JWT: []
 *     summary: "Get a list containing all the events that are currently stored in the database"
 *     responses:
 *       200:
 *         description: "Return a JSON array containing every event stored in the database"
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
 *                     example: "JPO"
 *                   startTS:
 *                     type: string
 *                     format: date-time
 *                   endTS:
 *                     type: string
 *                     format: date-time
 *                   description:
 *                     type: string
 *                     format: date-time
 *                   image:
 *                     type: string
 *                     example: "https://img.com/jpo.png"
 *
 *   post:
 *     tags:
 *       - Event management
 *     security:
 *       - JWT: []
 *     summary: "Create and save a new event to the database"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: "event title to add"
 *                 example: "Template title"
 *               startTS:
 *                 type: string
 *                 format: date-time
 *               endTS:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *                 format: date-time
 *               image:
 *                 type: string
 *                 description: "image link associated with the event"
 *                 example: "https://img.com/event.png"
 *             required:
 *               - title
 *               - startTS
 *               - endTS
 *               - description
 *     responses:
 *       201:
 *         description: "The object has been saved"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Insufficient access"
 *
 *   put:
 *     tags:
 *       - Event management
 *     security:
 *       - JWT: []
 *     summary: "Modify an existing event"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: "id of the event"
 *                 example: 1
 *               title:
 *                 type: string
 *               startTS:
 *                 type: string
 *                 format: date-time
 *               endTS:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 description: "image link associated with the event"
 *             required:
 *               - id
 *               - title
 *               - startTS
 *               - endTS
 *               - description
 *     responses:
 *       200:
 *         description: "Event modified"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Insufficient access"
 *       410:
 *         description: "This event does not exist."
 *
 *   delete:
 *     tags:
 *       - Event management
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
 *                 description: "event id to delete"
 *                 example: 1
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: "Event deleted"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Insufficient access"
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

    if (roles === -1 || !(roles.includes("ADMIN") || roles.includes("BDE") || roles.includes("MAINTAINER") || !roles.includes("ENSEIGNANT"))) {
        return new Response(JSON.stringify({message: "Permission denied."}), {status: 403});
    }
    try {
        switch (req.method) {
            case "POST":
                if (await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
                }
                body = await readBody(req);
                await createEvent(body);
                return new Response(JSON.stringify({message: "Event created successfully."}), {status: 201});
            case "PUT":
                if (await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
                }
                body = await readBody(req);
                await updateEvent(body);
                return new Response(JSON.stringify({message: null}), {status: 200});
            case "DELETE":
                if (await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
                }
                body = await readBody(req);
                await deleteEvent(body);
                return new Response(JSON.stringify({message: null}), {status: 200});
            case "GET":
                return new Response(JSON.stringify(await getEvents()), {status: 200});
            default:
                return new Response(JSON.stringify({message: "Method not allowed. Please read the documentation."}), {status: 405});
        }
    } catch (error) {
        return new Response(JSON.stringify({message: `Internal Server Error: ${error.message}`}), {status: 500});
    }
}

export default eventHandler(handler);
