import {getConfigValue} from "~~/server/database";

export default defineEventHandler(async (event) => {
    if (event.method !== "GET") {
        return new Response("Method not allowed.", {status: 405})
    }
    let hp_version = await getConfigValue("HPVersion");
    let hp_icals = await getConfigValue("HPIcals");

    return new Response(JSON.stringify({version: hp_version, icals: hp_icals}),{status: 200});
});
