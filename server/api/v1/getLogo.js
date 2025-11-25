/**
 * @openapi
 * /getLogo:
 *      get:
 *          tags:
 *              - IUT logo fetch
 *          security:
 *           - JWT: []
 *          description: "Get a list containing all the events that are currently stored in the database"
 *          responses:
 *              200:
 *                  description: "return the path where is stored the IUT logo"
 *                  content:
 *                      application/json:
 *                          type:string
 *                          description:"path where is stored the IUT logo"
 *                          example:"assets/logo_iut.png"
 */

export default defineEventHandler(async (event) => {
    if (event.req.method === "GET") {
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
