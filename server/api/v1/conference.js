import fs from "fs";
import {getRole, verifyToken} from "~~/server/jwt";
import {updateConference, createConference, getConference, deleteConference} from "~~/server/database"

/**
 * @openapi
 * /conference:
 *      get:
 *          tags:
 *              - JPO conference management   # tags doit être une liste
 *          security:
 *              - JWT: []
 *          description: get a list containing all conferences stored in DB
 *          responses:
 *              200:
 *                  description: get a list containing all conferences stored in DB
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array     # GET renvoie une liste → array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      id: 
 *                                          type: integer
 *                                          description: "id of the conference"
 *                                          example: 1
 *                                      room:
 *                                          type: string
 *                                          description: "name of the room where the conference will take place"
 *                                          example: "204"
 *                                      who:
 *                                          type: string
 *                                          description: "name of teacher holding the conference"
 *                                          example: "Stéphane FOSSE"
 *                                      when:
 *                                          type: string
 *                                          format: date-time
 *                                          description: "date and hour when the conference will start"
 *                                          example: "2025-12-02T09:10:00.000Z"
 *              500:
 *                  description: unknown error
 *
 *      put:
 *          tags:
 *              - JPO conference management
 *          security:
 *              - JWT: []
 *          description: update a conference
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: id of the conference
 *                                  example: 1
 *                              room:
 *                                  type: string
 *                                  description: "name of room holding the conference"
 *                                  example: "204"
 *                              who:
 *                                  type: string
 *                                  description: "name of teacher holding the conference"
 *                                  example: "Stéphane FOSSE"
 *                              when:
 *                                  type: string
 *                                  format: date-time
 *                                  description: "date and hour when the conference will start"
 *                                  example: "2025-12-02T09:10:00.000Z"
 *                          required:
 *                              - id
 *          responses:
 *              200:
 *                  description: conference updated
 *              400:
 *                  description: invalid input
 *              401:
 *                  description: invalid token
 *              403:
 *                  description: permission denied
 *              500:
 *                  description: unknown error
 *
 *      post:
 *          tags:
 *              - JPO conference management
 *          security:
 *              - JWT: []
 *          description: create a conference
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: id of the conference
 *                                  example: 1
 *                              room:
 *                                  type: string
 *                                  description: "name of room holding the conference"
 *                                  example: "204"
 *                              who:
 *                                  type: string
 *                                  description: "name of teacher holding the conference"
 *                                  example: "Stéphane FOSSE"
 *                              when:
 *                                  type: string
 *                                  format: date-time
 *                                  description: "date and hour when the conference will start"
 *                                  example: "2025-12-02T09:10:00.000Z"
 *                          required:
 *                              - id
 *                              - who
 *                              - when
 *          responses:
 *              201:
 *                  description: conference created
 *              400:
 *                  description: invalid input
 *              401:
 *                  description: invalid token
 *              403:
 *                  description: permission denied
 *              500:
 *                  description: unknown error
 *      delete:
 *          tags:
 *              - JPO conference management
 *          security:
 *              - JWT: []
 *          description: delete a conference by id
 *          requestBody:                     # DELETE reçoit aussi un body (cohérent avec POST/PUT)
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  description: id of the conference
 *                                  example: 1
 *                          required:
 *                              - id           # seul champ requis
 *          responses:
 *              200:
 *                  description: conference deleted successfully
 *              400:
 *                  description: invalid input
 *              401:
 *                  description: invalid token
 *              403:
 *                  description: permission denied
 *              404:
 *                  description: conference not found
 *              500:
 *                  description: unknown error

 */
async function handler(req) {
    let body;
    if (req.method === "GET") {
        try {
            let GetConferenceList = await getConference();
            return new Response(JSON.stringify({content: GetConferenceList}), {status: 200});
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
                console.log("a");
                body = await readBody(req);
                console.log("b");
                await createConference(body);
                return new Response(JSON.stringify({message: "Conference created successfully."}), {status: 201});

            case "PUT":
                if (await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
                }
                body = await readBody(req);
                await updateConference(body);
                return new Response(JSON.stringify({message: null}), {status: 200});


            case "DELETE":
                if (await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
                }
                body = await readBody(req);
                await deleteConference(body);
                return new Response(JSON.stringify({message: null}), {status: 200});


            default:
                return new Response(JSON.stringify({message: "Method not allowed. Please read the documentation."}), {status: 405});
        }


    } catch (error) {
        return new Response(JSON.stringify({message: `Internal Server Error: ${error.message}`}), {status: 500});
    }
}

export default eventHandler(handler);
