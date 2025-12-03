/**
 * @openapi
 * /getLogo:
 *  get:
 *      tags:
 *          - Retreive miscellaneous data
 *      summary: "Get the url path to fetch for the logo according to special events"
 *      responses:
 *          200:
 *              description: "Return the path where is stored the IUT logo"
 *              content:
 *                  text/plain:
 *                      type: string
 *                      example: assets/logo_iut.png
 */

export default defineEventHandler(async (event) => {
    if (event.method === "GET") {
        let logo;
        let month = new Date().getMonth().toString();
        switch (month) {
            case "1":
                logo = "assets/logo_iut_nouvelan_NOTEXT.png";
                break;
            case "9":
                logo = "assets/logo_iut_halloween.png";
                break;
            case "11":
                logo = "assets/logo_iut_noel.png";
                break;
            default:
                logo = "assets/logo_iut.png";
        }
        return new Response(logo)
    }
});
