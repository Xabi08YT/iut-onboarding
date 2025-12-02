const WEATHER_URL_NEXT_12_HOURS =
  "https://api.weatherapi.com/v1/forecast.json?key=72687f6b06f94afa9f7103056220603&q=Gradignan&aqi=no&lang=fr&hour=";

/**
 * @openapi
 * /getNext12hWeather:
 *      get:
 *          tags:
 *              - Retreive miscellaneous data
 *          summary: "Get a list containing weather data and images to display"
 *          responses:
 *              200:
 *                  description: "Return the expected list"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      Heure:
 *                                          type: integer
 *                                          description : "The hour of the forecast"
 *                                          example: 12
 *                                      icone:
 *                                          type: string
 *                                          description: "A link which stores the icon"
 *                                          example: "//cdn.weatherapi.com/weather/64x64/day/113.png"
 *                                      Temperature:
 *                                          type: number
 *                                          description : "The temperature of the forecast based on the hour"
 *                                          example: 8.7
 *                      
 */
export default defineEventHandler(async (event) => {
    if (event.method == "GET") {
        let weathertab = [];
        let dateT = new Date();
        let hour = dateT.getHours() + 2;
        if (hour % 2 === 1) {
            hour = hour - 1;
        }
        for (let i = hour; i <= hour + 12; i = i + 2) {
            let hourloop = i;
            if (hourloop >= 24) {
                hourloop = hourloop - 24;
            }
            try {
                const result = await fetch(WEATHER_URL_NEXT_12_HOURS + hourloop, {mode: "cors"});
                const data = await result.json();
                weathertab.push({
                    Heure: hourloop,
                    icone: data.forecast.forecastday[0].hour[0].condition.icon,
                    Temperature: data.forecast.forecastday[0].hour[0].temp_c,
                });
            } catch (e) {
                throw `Erreur de récupération des données météo : ${e}`;
            }
        }
        return new Response(JSON.stringify(weathertab));
    }
});