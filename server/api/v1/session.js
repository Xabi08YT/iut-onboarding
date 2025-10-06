import {login} from "~~/server/database";
import {createToken, exchangeToken, getRole, verifyToken} from "~~/server/jwt";

/**
 * @openapi
 * /session:
 *   get:
 *     tags:
 *      - Session management
 *     description: "Check JWT validity."
 *     responses:
 *       200:
 *         description: "JWT is valid."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: "JWT Expired or missing."
 *   post:
 *     tags:
 *      - Session management
 *     description: "Create a new JWT."
 *     responses:
 *       201:
 *         description: "JWT appplication + message."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome !"
 *       403:
 *         description: "Wrong username or password"
 *   put:
 *     tags:
 *      - Session management
 *     security:
 *      - JWT: []
 *     description: "Replace the current JWT by a newer one IF VALID"
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
 *       401:
 *         description: "JWT Expired or missing."
 *   delete:
 *     tags:
 *      - Session management
 *     security:
 *      - JWT: []
 *     description: "Delete the JWT and return a goodbye message."
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
 *       401:
 *         description: "JWT Expired or missing."
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
  let res;
  let token;
  let adminPanelRoles = ["BDE","ENSEIGNANT","ADMIN"]
  try {
    switch(req.method) {
      case "POST":
        data = await readBody(req);
        res = await login(data.username, data.password);
        if(res == null ||  !res.ok) {
          return new Response(JSON.stringify({message: "Incorrect credentials"}), {status: 403});
        }
        token = await createToken(res);
        let user = res.user;
        let toRedirect = "";
        let adminPanelPerm = false;
        let culturePanelPerm = user.role.includes("CULTURE") || user.role.includes("MAINTAINER");
        let i = 0;
        while(!adminPanelPerm && i<user.role.length) {
          if(adminPanelRoles.includes(user.role[i])) {
            adminPanelPerm = true;
          }
          ++i;
        }

        if(culturePanelPerm && adminPanelPerm) {
          toRedirect = "CHOOSE";
        } else if (adminPanelPerm) {
          toRedirect = "ADMIN";
        } else {
          toRedirect = "CULTURE";
        }

        return new Response(JSON.stringify({goto: toRedirect}), {status: 201, headers: {"Set-Cookie": `onboardingToken=${token}; SameSite=Strict`}});
      case "PUT":
        token = await exchangeToken(parseCookies(req)?.onboardingToken);
        if(await verifyToken(parseCookies(req)?.onboardingToken) === false || token === -1) {
          return new Response(JSON.stringify({message:"Session expired or token is invalid."}), {status: 401});
        }
        return new Response(JSON.stringify({message: "Token modified successfully."}), {status: 200, headers: {"Set-Cookie": `onboardingToken=${token}; SameSite=Strict`} });
      case "DELETE":
        if(await verifyToken(parseCookies(req)?.onboardingToken) === false) {
          return new Response(JSON.stringify({message:"Session expired"}), {status: 401});
        }
        return new Response("", {status: 200, headers: {"Set-Cookie": ""}});
      case "GET":
        if(await verifyToken(parseCookies(req)?.onboardingToken) === false) {
          return new Response(JSON.stringify({message:"Session expired"}), {status: 401});
        }
        let roles = await getRole(parseCookies(req)?.onboardingToken);
        return new Response(JSON.stringify({roles: roles}), {status: 200});
      default:
        return new Response(JSON.stringify({message:"Method not allowed. Please read the documentation."}), {status: 405});
    }
  } catch (error) {
    return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
  }
}

export default eventHandler(handler);
