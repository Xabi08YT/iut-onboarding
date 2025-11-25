import {getOngoingEvents} from "~~/server/database";


/**
 * @openapi
 * /getOngoingEvents:
 *      get:
 *          tags:
 *              - Event management
 *          summary: "Get a list containing all ongoing events stored in database"
 *          responses:
 *              200:
 *                  description: "Return the list of ongoing events"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: integer
 *                                          description: "The id of the event"
 *                                          example: 1
 *                                      title:
 *                                          type: string
 *                                          description: "The title of the event"
 *                                          example: "Here is my title"
 *                                      startTS:
 *                                          type: string      
 *                                          format: date-time
 *                                          description: "starting date of the event"
 *                                          example: "2025-12-31T12:55:15.000Z"
 *                                      endTS:
 *                                          type: string
 *                                          format: date-time
 *                                          description: "ending date of the event"
 *                                          example: "2025-12-31T12:55:15.000Z"
 *                                      eventTS:
 *                                          type: string
 *                                          format: date-time
 *                                          description: "day of the event"
 *                                          example: "2025-12-31T12:55:15.000Z"
 *                                      description:
 *                                          type: string
 *                                          description: "description of the event"
 *                                      image:
 *                                          type: string
 *                                          description: "link of the image linked to the event"
 *                                          example: "https://img.com/event.png"
 */
export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    try {
      const events = await getOngoingEvents();
      return { statusCode: 200, body: JSON.stringify(events) };
    } catch (error: any) {
      return { statusCode: 500, body: JSON.stringify(error) };
    }
  }
});