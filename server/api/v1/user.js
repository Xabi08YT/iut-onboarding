import {createUser, deleteUser, getUsers, updateUser} from "~/server/database";
import {getRole, verifyToken} from "~/server/jwt";

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
  if(await verifyToken(parseCookies(req)?.onboardingToken) === false) {
    return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
  }

  /*if(!getRole(parseCookies(req)?.onboardingToken).contains("ADMIN")) {
    return new Response(JSON.stringify({message:"Permission denied."}), {status: 403});
  }*/

  if(req.method === "GET") {
    return new Response(JSON.stringify(await getUsers()), {status: 200});
  }
  try {
    let data = await readBody(req);
    switch(req.method) {
      case "POST":
        await createUser(JSON.parse(data));
        return new Response(JSON.stringify({message:"User created successfully."}), {status: 201});
      case "PUT":
        await updateUser(JSON.parse(data));
        return new Response(JSON.stringify({message:null}), {status: 200});
      case "DELETE":
        console.log(data);
        await deleteUser(parseInt(data));
        return new Response(JSON.stringify({message:null}), {status: 200});
      default:
        return new Response(JSON.stringify({message:"Method not allowed. Please read the documentation."}), {status: 405});
    }
  } catch (error) {
    return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
  }
}

export default eventHandler(handler);
