export default defineEventHandler(async (event) => {
    if (event.req.method === "GET") {
        let logo;
        let month = new Date().getMonth().toString();
        switch (month) {
            case "1":
                logo = "/assets/logo_iut_nouvelan_NOTEXT.png";
                break;
            case "9":
                logo = "/assets/logo_iut_halloween.png";
                break;
            case "11":
                logo = "/assets/logo_iut_noel.png";
                break;
            default:
                logo = "/assets/logo_iut.png";
        }
        return new Response(logo)
    }
});
