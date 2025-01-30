import {createEvent, getEvents, updateEvent, deleteEvent} from "~/server/database";
import {verifyToken} from "~/server/jwt";

/**
 * @openapi
 * /event:
 *   get:
 *     tags:
 *      - Event management
 *     description: "Get a list containing all the events that are currently stored in the database"
 *     responses:
 *       200:
 *         description: "Return a JSON array containing every event stored in the database"
 *   post:
 *     tags:
 *      - Event management
 *     security:
 *      - JWT: []
 *     description: "Create and save a new event to the database"
 *     responses:
 *       201:
 *         description: "The object has been saved"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Insufficient access"
 *   put:
 *     tags:
 *      - Event management
 *     security:
 *      - JWT: []
 *     description: "Modify an existing event"
 *     responses:
 *       200:
 *         description: "Event modified"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Insufficient access"
 *       410:
 *         description: "This event does not exist."
 *   delete:
 *     tags:
 *      - Event management
 *     security:
 *      - JWT: []
 *     description: "Deletes an existing event"
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
  try {
    switch(req.method) {
      case "POST":
        if(await verifyToken(getHeader(req, "cookie")) === false) {
          return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
        }
        body = await readBody(req);
        await createEvent(body);
        return new Response(JSON.stringify({message:"Event created successfully."}), {status: 201});
      case "PUT":
        if(await verifyToken(getHeader(req, "cookie")) === false) {
          return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
        }
        body = await readBody(req);
        await updateEvent(body);
        return new Response(JSON.stringify({message:null}), {status: 200});
      case "DELETE":
        if(await verifyToken(getHeader(req, "cookie")) === false) {
          return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
        }
        body = await readBody(req);
        await deleteEvent(body.id);
        return new Response(JSON.stringify({message:null}), {status: 200});
      case "GET":
        return new Response(JSON.stringify(await getEvents()), {status: 200});
      default:
        return new Response(JSON.stringify({message:"Method not allowed. Please read the documentation."}), {status: 405});
    }
  } catch (error) {
    return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
  }
}

export default eventHandler(handler);
