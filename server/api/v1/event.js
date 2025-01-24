/**
 * @openapi
 * /event:
 *   get:
 *     description: "Get a list containing all the events that are currently stored in the database"
 *     responses:
 *       200:
 *         description: "Return a JSON array containing every event stored in the database"
 *   post:
 *     description: "Create and save a new event to the database"
 *     responses:
 *       201:
 *         description: "The object has been saved"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Insufficient access"
 *   put:
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
function handler(req) {
  try {
    switch(req.method) {
      case "POST":
        return new Response(JSON.stringify({message:"Event created successfully."}), {status: 201});
      case "PUT":
        return new Response(JSON.stringify({message:null}), {status: 200});
      case "DELETE":
        return new Response(JSON.stringify({message:null}), {status: 200});
      case "GET":
        return new Response(JSON.stringify([{id:1, ename:"blabla"}]), {status: 200});
      default:
        return new Response(JSON.stringify({message:"Method not allowed. Please read the documentation."}), {status: 405});
    }
  } catch (error) {
    return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
  }
}

export default eventHandler(handler);
