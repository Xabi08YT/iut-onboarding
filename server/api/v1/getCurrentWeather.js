const CURRENT_WEATHER_URL =
  "https://api.weatherapi.com/v1/current.json?key=72687f6b06f94afa9f7103056220603&q=Gradignan&aqi=no&lang=fr";

export default defineEventHandler(async (event) => {
  if (event.method == "GET") {
    try {
      const result = await fetch(CURRENT_WEATHER_URL);
      const data = await result.json();
      return new Response(JSON.stringify({
        weatherText: data.current.condition.text,
        temperature: data.current.temp_c,
      }));
    } catch (e) {
      throw `Erreur de récupération des données météo : ${e}`;
    }
  }
});