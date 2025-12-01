import {getCultureOngoingEvents} from "~~/server/database";

/**
 * @openapi
 * /getOngoingCultureEvents:
 *      get:
 *          tags:
 *              - fetch all the cultural events stored in database
 *          security:
 *           - JWT: []
 *          description: "Get a list containing all cultural events stored in database"
 *          responses:
 *              200:
 *                  description: "return the descripted list"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              properties:
 *                              id:
 *                                  type: integer
 *                                  description : "The id of the cultural event"
 *                                  example: 1
 *                              title:
 *                                  type: string
 *                                  description: "The title of the cultural event"
 *                                  example: "here is my title"
 *                              startTS:
 *                                  type: number
 *                                  format: date-time
 *                                  description : "starting date of the cultural event"
 *                                  example:"2025-12-31T12:55:15.000Z"
 *                              endTS:
 *                                  type: number
 *                                  format: date-time
 *                                  description : "ending date of the cultural event"
 *                                  example:"2025-12-31T12:55:15.000Z"
 *                              startTS:
 *                                  type: number
 *                                  format: date-time
 *                                  description : "day of the cultural event"
 *                                  example:"2025-12-31T12:55:15.000Z"
 *                              description:
 *                                  type: string
 *                                  description: "description of the cultural event"
 *                              image:
 *                                  type: string
 *                                  description: "link of the image linked to the cultural event"
 *                                  example:"image.png"
 */


export default defineEventHandler(async (event) => {
  if (event.req.method === "GET") {
    try {
      const events = await getCultureOngoingEvents();
      return {statusCode: 200, body: JSON.stringify(events)};
    } catch (error) {
      console.error(error);
      return {statusCode: 500, body: JSON.stringify(error)};
    }
  }
});
