import fs from "fs";
import {getRole, verifyToken} from "~~/server/jwt";
import {updateAtelier, createAtelier, getAtelier, deleteAtelier} from "~~/server/database"


/**
 * @openapi
 * /jpo
 *      get:
 *          tags:
 *              JPO activity management
 *          security:
 *              - JWT: []
 *          description: get a list containing all activities stored in DB
 *          responses:
 *              200:
 *                  description: get a list containing all activities stored in DB
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      description: "id of the activity"
 *                                      example: 1
 *                                  name:
 *                                      type: string
 *                                      description: "name of teacher holding the activity"
 *                                      example: "Stéphane FOSSE"
 *                                  room:
 *                                      type: string
 *                                      description: "name of the room where the activity will take place"
 *                                      example: "204"
 *                                  start:
 *                                      type: string
 *                                      format: datetime
 *                                      description: "date and hour when the activity will start"
 *                                      example: "2025-12-02T09:10:00.000Z"
 *                                  end:
 *                                      type: string
 *                                      format: datetime
 *                                      description: "date and hour when the activity will end"
 *                                      example: "2025-12-02T19:20:00.000Z"
 *              500:
 *                  description : unknown error
 *      put:
 *          tags:
 *              JPO activity management
 *          security:
 *              - JWT: []
 *          request-body:
 *              required: true
 *          parameters:
 *              -in:query
 *              name: "id"
 *              required: false
 *              type: integer
 *              description: id of the activity
 *              example: 1
 *              -in:query
 *              name:"name"
 *              required: false
 *              type: string
 *              description: "name of teacher holding the activity"
 *              example: "Stéphane FOSSE"
 *              -in:query
 *              name:"start"
 *              required: false
 *              type:string
 *              format:date-time
 *              description: "date and hour when the activity will start"
 *              example:"2025-12-02T09:10:00.000Z"
 *              -in:query
 *              name:"end"
 *              required: false
 *              type:string
 *              format:date-time
 *              description: "date and hour when the activity will end"
 *              example:"2025-12-02T19:20:00.000Z"
 *      post:
 *          tags:
 *              JPO activity management
 *          security:
 *              - JWT: []
 *          request-body:
 *              required: true
 *          parameters:
 *              -in:query
 *              name: "id"
 *              required: true
 *              type: integer
 *              description: id of the activity
 *              example: 1
 *              -in:query
 *              name:"name"
 *              required: true
 *              type: string
 *              description: "name of teacher holding the activity"
 *              example: "Stéphane FOSSE"
 *              -in:query
 *              name:"start"
 *              required: true
 *              type:string
 *              format:date-time
 *              description: "date and hour when the activity will start"
 *              example:"2025-12-02T09:10:00.000Z"
 *              -in:query
 *              name:"end"
 *              required: true
 *              type:string
 *              format:date-time
 *              description: "date and hour when the activity will end"
 *              example:"2025-12-02T19:20:00.000Z"
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