import {login} from "~/server/database";

/**
 * @openapi
 * /session:
 *   get:
 *     tags:
 *      - Session management
 *     description: "Check resource validity."
 *     responses:
 *       200:
 *         description: "Resource is valid."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *   post:
 *     tags:
 *      - Session management
 *     description: "Create a new resource and return a welcome message."
 *     responses:
 *       201:
 *         description: "Welcome message."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome !"
 *   put:
 *     tags:
 *      - Session management
 *     security:
 *      - JWT: []
 *     description: "Modify a resource and confirm the modification."
 *     responses:
 *       200:
 *         description: "Token modified successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token modified successfully."
 *   delete:
 *     tags:
 *      - Session management
 *     security:
 *      - JWT: []
 *     description: "Delete a resource and return a goodbye message."
 *     responses:
 *       200:
 *         description: "Goodbye message."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Goodbye !"
 *   default:
 *     description: "Handle unsupported HTTP methods."
 *     responses:
 *       405:
 *         description: "Method not allowed."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Method not allowed. Please read the documentation."
 *   error:
 *     description: "Internal server error."
 *     responses:
 *       500:
 *         description: "An unexpected error occurred on the server."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error: {error message}"
 */
async function handler(req) {
  let data;
  try {
    switch(req.method) {
      case "POST":
        data = await readBody(req);
        let res = await login(data.username, data.password);
        return new Response(JSON.stringify({message:"Welcome !"}), {status: 201});
      case "PUT":
        return new Response(JSON.stringify({message: "Token modified successfully."}), {status: 200});
      case "DELETE":
        return new Response(JSON.stringify({message: "Goodbye !"}), {status: 200});
      case "GET":
        return new Response(JSON.stringify({valid: true}), {status: 200});
      default:
        return new Response(JSON.stringify({message:"Method not allowed. Please read the documentation."}), {status: 405});
    }
  } catch (error) {
    return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
  }
}

export default eventHandler(handler);
