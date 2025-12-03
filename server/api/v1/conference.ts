import {getRole, verifyToken} from "~~/server/jwt";
import {updateConference,createConference,getConference,deleteConference} from "~~/server/database"


export default defineEventHandler(async (event) => {
    let body;
    let method = event.method;
    if (method === "GET") {
        try {
            let GetConferenceList = await getConference(); 
            return new Response(JSON.stringify({content: GetConferenceList}), {status: 200});
        } catch (error: any) {
            return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
        }
    }

    let token = parseCookies(event)?.onboardingToken
    if(await verifyToken(token) === false) {
        return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
    }

    let roles = await getRole(token);

    if(roles === -1 || !(roles.includes("ADMIN") || roles.includes("MAINTAINER"))) {
        return new Response(JSON.stringify({message:"Permission denied."}), {status: 403});
    }

    try {
        body = await readBody(event);
        switch(method) {

            case "POST":
                await createConference(body);
                return new Response(JSON.stringify({message:"Conference created successfully."}), {status: 201});

            case "PUT":
                await updateConference(body);
                return new Response(JSON.stringify({message:"Conference updated successfully."}), {status: 200});
            case "DELETE":
                await deleteConference(body);
                return new Response(JSON.stringify({message:"Conference deleted successfully."}), {status: 200});
            default:
                return new Response(JSON.stringify({message:"Method not allowed. Please read the documentation."}), {status: 405});
        }


    } catch (error: any) {
        return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
    }
})