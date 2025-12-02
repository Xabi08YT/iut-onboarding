import fs from "fs";
import {getRole, verifyToken} from "~~/server/jwt";
import {updateConfigValue,getConfigValue} from "~~/server/database"

async function handler(req) {
    let body;
    let token = parseCookies(req)?.onboardingToken
    let data

    try {
        switch(req.method) {

            case "PUT":
                if(await verifyToken(token) === false) {
                    return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
                }

                let roles = await getRole(token);

                if(roles === -1 || !(roles.includes("ADMIN") || roles.includes("BDE") || roles.includes("MAINTAINER"))) {
                    return new Response(JSON.stringify({message:"Permission denied."}), {status: 403});
                }
                body = await readBody(req);
                let tmp = JSON.parse(body);
                let data = {key: "lienVideoJpo", value: tmp.value}
                console.error(data)
                await updateConfigValue(data);
                return new Response(JSON.stringify({message:null}), {status: 200});
            
                case "GET":
                let LienVideoJpo = await getConfigValue("lienVideoJpo");
                console.log(LienVideoJpo)
                return new Response(LienVideoJpo.value, {status: 200});
            
                default:
                return new Response(JSON.stringify({message:"Method not allowed. Please read the documentation."}), {status: 405});
        }
    } catch (error) {
        return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
    }
}

export default eventHandler(handler);
