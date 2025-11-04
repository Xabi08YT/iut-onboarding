import {getConfigValue, updateConfigValue} from "~~/server/database";
import {parseCookies} from "h3";
import {getRole, verifyToken} from "~~/server/jwt";

export default defineEventHandler(async (event) => {
    switch (event.method) {
        case "GET":
            let hp_version = await getConfigValue("HPVersion");
            let hp_icals = await getConfigValue("HPIcals");

            return new Response(JSON.stringify({version: hp_version, icals: hp_icals}), {status: 200});
        case "PUT":
            let token = parseCookies(event)?.onboardingToken
            if (await verifyToken(token) === false) {
                return new Response(JSON.stringify({message: "Invalid token"}), {status: 401});
            }

            let roles = await getRole(token);

            if (roles === -1 || !(roles.includes("ADMIN") || roles.includes("BDE") || roles.includes("MAINTAINER") || !roles.includes("ENSEIGNANT"))) {
                return new Response(JSON.stringify({message: "Permission denied."}), {status: 403});
            }

            let body = await readBody(event);
            let parsed = JSON.parse(body);

            try {
                await updateConfigValue({key: "HPVersion", value: JSON.stringify(parsed.version)});
                await updateConfigValue({key: "HPIcals", value: JSON.stringify(parsed.icals)})
                return new Response(JSON.stringify({message: "Success"}), {status: 200});
            } catch (error) {
                return new Response(JSON.stringify({message: "Internal server error: Request could not be executed. The request may be invalid or the server encountered a problem."}), {status: 500});
            }
    }
});
