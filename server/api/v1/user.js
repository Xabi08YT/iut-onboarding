import {createUser, deleteUser, getUsers, updateUser} from "~/server/database";

/**
 * @openapi
 * /user:
 *   get:
 *     tags:
 *      - User management
 *     security:
 *      - JWT: []
 *     description: "Get a list containing all the users that are currently stored in the database"
 *     responses:
 *       200:
 *         description: "Returns a JSON array containing every user stored in the database"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Insufficient access"
 *   post:
 *     tags:
 *      - User management
 *     security:
 *      - JWT: []
 *     description: "Create and save a new user to the database"
 *     responses:
 *       201:
 *         description: "The object has been saved"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Insufficient access"
 *   put:
 *     tags:
 *      - User management
 *     security:
 *      - JWT: []
 *     description: "Modify an existing user"
 *     responses:
 *       200:
 *         description: "User modified successfully"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Insufficient access"
 *       410:
 *         description: "This user does not exist."
 *   delete:
 *     tags:
 *      - User management
 *     security:
 *      - JWT: []
 *     description: "Delete an existing user"
 *     responses:
 *       200:
 *         description: "User deleted successfully"
 *       401:
 *         description: "User token has expired"
 *       403:
 *         description: "Insufficient access"
 *       410:
 *         description: "This user does not exist."
 */
async function handler(req) {
  if(req.method === "GET") {
    return new Response(JSON.stringify(await getUsers()), {status: 200});
  }
  try {
    let data = await readBody(req);
    switch(req.method) {
      case "POST":
        createUser(data);
        return new Response(JSON.stringify({message:"User created successfully."}), {status: 201});
      case "PUT":
        updateUser(data);
        return new Response(JSON.stringify({message:null}), {status: 200});
      case "DELETE":
        deleteUser(data.id);
        return new Response(JSON.stringify({message:null}), {status: 200});
      default:
        return new Response(JSON.stringify({message:"Method not allowed. Please read the documentation."}), {status: 405});
    }
  } catch (error) {
    return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
  }
}

export default eventHandler(handler);
