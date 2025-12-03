import {getRole, verifyToken} from "~~/server/jwt";
import {updateAtelier, createAtelier, getAtelier, deleteAtelier} from "~~/server/database"

/**
 * @openapi
 * /atelier:
 *  get:
 *      tags:
 *      - JPO management
 *      summary: "Get the list of all workshops"
 *      responses:
 *          200:
 *              description: "List of all the workshops in the DB"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      description: "ID of the workshop"
 *                                      example: 1
 *                                  name:
 *                                      type: string
 *                                      description: "Name of the workshop"
 *                                      example: "C# programming"
 *                                  room:
 *                                      type: string
 *                                      description: "Room of the workshop"
 *                                      example: "204"
 *                                  start:
 *                                      type: string
 *                                      format: date-time
 *                                      description: "Beginning Timestamp of the workshop (ISO 8601)"
 *                                      example: "2025-12-02T09:10:00.000Z"
 *                                  end:
 *                                      type: string
 *                                      format: date-time
 *                                      description: "Ending Timestamp of the workshop (ISO 8601)"
 *                                      example: "2025-12-02T19:20:00.000Z"
 *          500:
 *              description : "Internal server error"
 *  put:
 *      tags:
 *      - JPO management
 *      summary: "Update an existing workshop"
 *      security:
 *      - JWT: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                              description: "ID of the workshop to update"
 *                              example: 1
 *                          name:
 *                              type: string
 *                              description: "New workshop name"
 *                              example: "Java programming"
 *                          room:
 *                              type: string
 *                              description: "New room"
 *                              example: "205"
 *                          start:
 *                              type: string
 *                              format: date-time
 *                              description: "New beginning timestamp"
 *                              example: "2025-12-02T10:00:00.000Z"
 *                          end:
 *                              type: string
 *                              format: date-time
 *                              description: "New ending timestamp"
 *                              example: "2025-12-02T18:00:00.000Z"
 *      responses:
 *          200:
 *              description: "Successfully updated"
 *          401:
 *              description: "Missing or expired token"
 *          403:
 *              description: "Access denied"
 *          500:
 *              description: "Intenral server error"
 *  post:
 *      tags:
 *      - JPO management
 *      summary: "Create a new workshop"
 *      security:
 *      - JWT: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - name
 *                          - start
 *                          - end
 *                          - room
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: "Name of the workshop"
 *                              example: "Web programming"
 *                          room:
 *                              type: string
 *                              description: "Room"
 *                              example: "207"
 *                          start:
 *                              type: string
 *                              format: date-time
 *                              description: "Beginning timestamp"
 *                              example: "2025-12-03T09:00:00.000Z"
 *                          end:
 *                              type: string
 *                              format: date-time
 *                              description: "Ending timestamp"
 *                              example: "2025-12-03T17:00:00.000Z"
 *      responses:
 *          201:
 *              description: "Created successfully"
 *          401:
 *              description: "Missing or expired token"
 *          403:
 *              description: "Access Denied"
 *          500:
 *              description: "Internal server error"
 *  delete:
 *      tags:
 *      - JPO management
 *      summary: "Delete a workshop"
 *      security:
 *      - JWT: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - id
 *                      properties:
 *                          id:
 *                              type: integer
 *                              description: "ID of the workshop to delete"
 *                              example: 1
 *      responses:
 *          200:
 *              description: "Deleted successfully"
 *          401:
 *              description: "Missing or expired token"
 *          403:
 *              description: "Access Denied"
 *          500:
 *              description: "Internal server error"
 */
async function handler(req) {
    let body;
    if (req.method === "GET") {
        try {
            let GetAtelierList = await getAtelier();
            return new Response(JSON.stringify({content: GetAtelierList}), {status: 200});
        } catch (error) {
            return new Response(JSON.stringify({message: `Internal Server Error: ${error.message}`}), {status: 500});
        }
    }

    let token = parseCookies(req)?.onboardingToken
    if (await verifyToken(token) === false) {
        return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
    }

    let roles = await getRole(token);

    if (roles === -1 || !(roles.includes("ADMIN") || roles.includes("MAINTAINER"))) {
        return new Response(JSON.stringify({message: "Permission denied."}), {status: 403});
    }

    try {
        let roles = await getRole(token);
        switch (req.method) {

            case "POST":
                if (await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
                }
                body = await readBody(req);
                await createAtelier(body);
                return new Response(JSON.stringify({message: "Atelier created successfully."}), {status: 201});

            case "PUT":
                if (await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
                }
                body = await readBody(req);
                await updateAtelier(body);
                return new Response(JSON.stringify({message: null}), {status: 200});

            case "DELETE":
                if (await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
                }
                body = await readBody(req);
                await deleteAtelier(body);
                return new Response(JSON.stringify({message: null}), {status: 200});


            default:
                return new Response(JSON.stringify({message: "Method not allowed. Please read the documentation."}), {status: 405});
        }


    } catch (error) {
        return new Response(JSON.stringify({message: `Internal Server Error: ${error.message}`}), {status: 500});
    }
}

export default eventHandler(handler);