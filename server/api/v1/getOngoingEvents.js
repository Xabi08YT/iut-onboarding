import {getOngoingEvents} from "~/server/database";

export default defineEventHandler(async (event) => {
  if (event.req.method === "GET") {
    try {
      const events = await getOngoingEvents();
      return { statusCode: 200, body: JSON.stringify(events) };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify(error) };
    }
  }
});
