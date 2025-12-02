import {AuthenticatedUser, login, LoginResult} from "~~/server/database";
import {createToken, exchangeToken, getRole, verifyToken} from "~~/server/jwt";

const adminPanelRoles = ["BDE", "ENSEIGNANT", "ADMIN"]

interface LoginBody {
  username: string;
  password: string;
}

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
export default defineEventHandler(async (event): Promise<Response> => {
  try {
    const method = event.method;

    switch (method) {
      // Log in
      case "POST": {
        const data = await readBody<LoginBody>(event);
        const res: LoginResult = await login(data.username, data.password);

        if (!res.ok || !res.user) {
          return new Response(
            JSON.stringify({ message: "Incorrect credentials" }),
            { status: 403 }
          );
        }

        const user: AuthenticatedUser = res.user;
        const token = await createToken(res);

        const rolesArray = (Array.isArray(user.role) && user.role.every(item => typeof item === "string")) ? user.role : [];
        const culturePanelPerm =
          rolesArray.includes("CULTURE") || rolesArray.includes("MAINTAINER");

        const adminPanelPerm = rolesArray.some((r) =>
          adminPanelRoles.includes(r)
        );

        let toRedirect: "CHOOSE" | "ADMIN" | "CULTURE";

        if (culturePanelPerm && adminPanelPerm) toRedirect = "CHOOSE";
        else if (adminPanelPerm) toRedirect = "ADMIN";
        else toRedirect = "CULTURE";

        return new Response(JSON.stringify({ goto: toRedirect }), {
          status: 201,
          headers: {
            "Set-Cookie": `onboardingToken=${token}; SameSite=Strict`,
          },
        });
      }

      // Refresh token
      case "PUT": {
        const cookies = parseCookies(event);
        const oldToken = cookies?.onboardingToken;

        const newToken = await exchangeToken(oldToken);
        const isValid = await verifyToken(oldToken);

        if (!isValid || newToken === -1) {
          return new Response(
            JSON.stringify({
              message: "Session expired or token is invalid.",
            }),
            { status: 401 }
          );
        }

        return new Response(
          JSON.stringify({ message: "Token modified successfully." }),
          {
            status: 200,
            headers: {
              "Set-Cookie": `onboardingToken=${newToken}; SameSite=Strict`,
            },
          }
        );
      }

      // Log out
      case "DELETE": {
        const cookies = parseCookies(event);
        const token = cookies?.onboardingToken;

        if (!(await verifyToken(token))) {
          return new Response(JSON.stringify({ message: "Session expired" }), {
            status: 401,
          });
        }

        return new Response("", {
          status: 200,
          headers: { "Set-Cookie": "" },
        });
      }

      // Get role
      case "GET": {
        const cookies = parseCookies(event);
        const token = cookies?.onboardingToken;

        if (!(await verifyToken(token))) {
          return new Response(JSON.stringify({ message: "Session expired" }), {
            status: 401,
          });
        }

        const roles = await getRole(token);

        return new Response(JSON.stringify({ roles }), { status: 200 });
      }

      default:
        return new Response(
          JSON.stringify({
            message: "Method not allowed. Please read the documentation.",
          }),
          { status: 405 }
        );
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: `Internal Server Error: ${error.message}`,
      }),
      { status: 500 }
    );
  }
});