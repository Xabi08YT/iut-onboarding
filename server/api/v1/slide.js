import {getSlides, updateSlide} from "~~/server/database";
import {getRole, verifyToken} from "~~/server/jwt";
import {parseCookies} from "h3";

/**
 * @openapi
 * /slide:
 *   get:
 *     tags:
 *      - Slide management
 *     security:
 *      - JWT: []
 *     description: "Retrieve a list of slides."
 *     responses:
 *       200:
 *         description: "Returns an array of slides."
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
 *                   name:
 *                     type: string
 *                     example: "Test"
 *                   active:
 *                     type: boolean
 *                     example: true
 *   put:
 *     tags:
 *       - Slide management
 *     security:
 *       - JWT: []
 *     description: "Update an existing slide."
 *     responses:
 *       200:
 *         description: "Slide updated successfully."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Slide updated successfully."
 *   default:
 *     description: "Handle unsupported HTTP methods."
 *     responses:
 *       405:
 *         description: "Method not allowed. Only PUT and GET methods are allowed."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Only PUT an GET methods allowed"
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
 *                   example: "{error message}"
 */
async function handler(req) {
    try {
        switch(req.method) {
            case "PUT":

                let token = parseCookies(req)?.onboardingToken
                if(await verifyToken(token) === false) {
                    return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
                }

                let roles = await getRole(token);

                if(roles === -1 || !(roles.includes("ADMIN") || roles.includes("MAINTAINER"))) {
                    return new Response(JSON.stringify({message:"Permission denied."}), {status: 403});
                }
                await updateSlide(await readBody(req));
                return new Response(JSON.stringify({message:"Slide updated successfully."}), {status: 200});
            case "GET":
                return new Response(JSON.stringify(await getSlides()), {status: 200});
            default:
                return new Response(JSON.stringify({message:"Only PUT an GET methods allowed"}), {status: 405});
        }
    } catch(err) {
        return new Response(JSON.stringify({message:err.message}), {status: 500});
    }
}

export default eventHandler(handler);
