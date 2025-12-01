import * as cheerio from "cheerio";

const TBM_URL = "https://gateway-apim.infotbm.com/maas-web/web/v1/timetables/stops/stop_area:";


/**
 * @openapi
 * /getTBM:
 *    get:
 *      tags:
 *        - fetch bus stop data 
 *      responses:
 *        '200':
 *          description: Prochains départs à l'arrêt
 *          content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  maxItems: 4
 *                  items:
 *                    type: object
 *                    properties:
 *                      line:
 *                        type: string
 *                        example: "L1"
 *                      destination:
 *                        type: string
 *                        example: "Centre Ville"
 *                      departure:
 *                        type: string
 *                        format: date-time
 *                        example: "2025-12-01T14:25:00+01:00"
 */

const fetchTBM = async (stopId) => {
  try {
    const result = await fetch(`${TBM_URL}${stopId}`);
    const text = await result.text();

    const $ = cheerio.load(text);
    const data = $("body").text();
    const json = JSON.parse(data);

    const interesting = await json.nextDepartures.slice(0, 4);
    return interesting;
  } catch (e) {
    throw `Erreur de récupération des données TBM (arrêt: ${stopId}) : ${e}`;
  }
};

const getTBMLineWaitInterval = async (stopId, lineId) => {
  try {
    const data = await fetchTBM(stopId);
    const dep1 = data[0];
    const dep2 = data[2];
    let timeBus1 = dep1.departure;
    let timeBus2 = dep2.departure;
    const date1 = new Date(timeBus1);
    const date2 = new Date(timeBus2);
    const result = Math.abs(date1 - date2);
    return result;
  } catch (e) {
    throw `Erreur de récupération des wait interval TBM (ligne: ${lineId}, arrêt: ${stopId}) : ${e}`;
  }
};

export default defineEventHandler(async (event) => {
  if (event.method == "GET") {
    const query = getQuery(event);
    if (query.stopId == undefined) { // The stop ID is necessary, but not the line ID
        throw Error('Unspecified stop ID');
    }
    let result = []
    if (query.lineId == undefined) {
      result = await fetchTBM(query.stopId);
    } else {
      result = await getTBMLineWaitInterval(query.stopId, query.lineId);
    }
    return new Response(JSON.stringify(result));
  }
});