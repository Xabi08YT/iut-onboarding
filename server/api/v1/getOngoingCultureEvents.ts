import {getCultureOngoingEvents} from "~~/server/database";

/**
 * @openapi
 * /getOngoingCultureEvents:
 *      get:
 *          tags:
 *              - Culture meetings management
 *          summary: "Get a list containing all cultural events stored in database"
 *          responses:
 *              200:
 *                  description: "Return the list of ongoing cultural events"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: integer
 *                                          description: "The id of the cultural event"
 *                                          example: 1
 *                                      title:
 *                                          type: string
 *                                          description: "The title of the cultural event"
 *                                          example: "Here is my title"
 *                                      startTS:
 *                                          type: string    # date-time = string
 *                                          format: date-time
 *                                          description: "starting date of the cultural event"
 *                                          example: "2025-12-31T12:55:15.000Z"
 *                                      endTS:
 *                                          type: string
 *                                          format: date-time
 *                                          description: "ending date of the cultural event"
 *                                          example: "2025-12-31T12:55:15.000Z"
 *                                      eventTS:            # correction duplication startTS
 *                                          type: string
 *                                          format: date-time
 *                                          description: "day of the cultural event"
 *                                          example: "2025-12-31T12:55:15.000Z"
 *                                      description:
 *                                          type: string
 *                                          description: "description of the cultural event"
 *                                      image:
 *                                          type: string
 *                                          description: "link of the image linked to the cultural event"
 *                                          example: "https://img.com/event.png"
 */

export default defineEventHandler(async (event) => {
  if (event.method === "GET") {
    try {
      const events = await getCultureOngoingEvents();
      return {statusCode: 200, body: JSON.stringify(events)};
    } catch (error: any) {
      console.error(error);
      return {statusCode: 500, body: JSON.stringify(error)};
    }
  }
});

