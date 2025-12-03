const CURRENT_WEATHER_URL =
    "https://api.weatherapi.com/v1/current.json?key=72687f6b06f94afa9f7103056220603&q=Gradignan&aqi=no&lang=fr";


/**
 * @openapi
 * /getCurrentWeather:
 *  get:
 *      tags:
 *        - Retreive miscellaneous data
 *      security:
 *      - JWT: []
 *      summary: "Get the current Weather data in the JSON format"
 *      responses:
 *          200:
 *              description: "Return a JSON array containing every event stored in the database"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              weatherText:
 *                                  type: string
 *                                  description: "Describes the actual weather"
 *                                  example: "Pluie légère"
 *                              temperature:
 *                                  type: number
 *                                  description: "Celcius degree temperature"
 *                                  example: 11.1
 */

export default defineEventHandler(async (event) => {
  if (event.method == "GET") {
    try {
      const result = await fetch(CURRENT_WEATHER_URL);
      const data = await result.json();
      return new Response (JSON.stringify({
        weatherText: data.current.condition.text,
        temperature: data.current.temp_c,
      }))
    } catch (error: any) {
      return new Response(JSON.stringify({message:`Erreur lors de la récupération des données météo: ${error}`}), {status: 500})
    }
  }
});