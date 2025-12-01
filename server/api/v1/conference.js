import fs from "fs";
import {getRole, verifyToken} from "~~/server/jwt";
import {updateConference,createConference,getConference,deleteConference} from "~~/server/database"

async function handler(req) {
    let body;
    if (req.method === "GET") {
        try {
            let GetConferenceList = await getConference(); 
            return new Response(JSON.stringify({content: GetConferenceList}), {status: 200});
        } catch (error) {
            return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
        }
    }

    let token = parseCookies(req)?.onboardingToken
    if(await verifyToken(token) === false) {
        return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
    }

    let roles = await getRole(token);

    if(roles === -1 || !(roles.includes("ADMIN") || roles.includes("MAINTAINER"))) {
        return new Response(JSON.stringify({message:"Permission denied."}), {status: 403});
    }

    try {
        let roles = await getRole(token);
        switch(req.method) {

            case "POST":
                if(await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
                }
                console.log("a");
                body = await readBody(req);
                console.log("b");
                await createConference(body);
                return new Response(JSON.stringify({message:"Conference created successfully."}), {status: 201});

            case "PUT":
            if(await verifyToken(parseCookies(req)?.onboardingToken) === false) {
            return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
            }
            body = await readBody(req);
            await updateConference(body);
            return new Response(JSON.stringify({message:null}), {status: 200});


           case "DELETE":
            if(await verifyToken(parseCookies(req)?.onboardingToken) === false) {
            return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
            }
            body = await readBody(req);
            await deleteConference(body);
            return new Response(JSON.stringify({message:null}), {status: 200});


                    default:modified
                return new Response(JSON.stringify({message:"Method not allowed. Please read the documentation."}), {status: 405});
        }


    } catch (error) {
        return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
    }
}

export default eventHandler(handler);
