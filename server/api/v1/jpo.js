import fs from "fs";
import {getRole, verifyToken} from "~~/server/jwt";
import {updateConference,createConference,getConference,deleteConference} from "~~/server/database"

async function handler(req) {
    console.log("&");
    let body;
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
            
            // Conference Management
             /**case "POST", "PUT":
                if(await verifyToken(token) === false) {
                    return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
                }

                if(roles === -1 || !(roles.includes("ADMIN") || roles.includes("ENSEIGNANT") || roles.includes("MAINTAINER"))) {
                    return new Response(JSON.stringify({message:"Permission denied."}), {status: 403});
                }
                
                body = await readBody(req);
                let tmpC = JSON.parse(body)

                 
                
                if (req.method === "POST") {
                    let dataC = {id: tmpC.id, room: tmpC.room, start: tmpC.start, end: tmpC.end}
                    await updateConference(dataC); 
                }else{
                    let dataC = {room: tmpC.room, start: tmpC.start, end: tmpC.end}
                    await createConference(dataC); 
                }



                return new Response(JSON.stringify({message:null}), {status: 200});    **/

                case "POST":
                if(await verifyToken(parseCookies(req)?.onboardingToken) === false) {
                    return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
                }
               console.log("a");
                body = await readBody(req);
                console.log("b");
                await createConference(body);
                return new Response(JSON.stringify({message:"Conference created successfully."}), {status: 201});

                return new Response(JSON.stringify({message:null}), {status: 200});    


            case "GET":
                let GetConferenceList = await getConference(); 
                return new Response(GetConferenceList.value, {status: 200}); 
            

            case "DELETE":
                let DelConference = await deleteConference(JSON.parse(body).id); 
                return new Response(DelConference.value, {status: 200}); 



            // Atelier Management
            /**case "PUT_ATELIER", "CREATE_ATELIER":
                if(await verifyToken(token) === false) {
                    return new Response(JSON.stringify({message:"Invalid token"}), {status: 401});
                }

                if(roles === -1 || !(roles.includes("ADMIN") || roles.includes("ENSEIGNANT") || roles.includes("MAINTAINER"))) {
                    return new Response(JSON.stringify({message:"Permission denied."}), {status: 403});
                }
                
                body = await readBody(req);
                let tmpA = JSON.parse(body)

                 
                
                if (req.method === "PUT_ATELIER") {
                    let dataA = {id: tmpA.id, room: tmpA.room, start: tmpA.start, end: tmpA.end}
                    await updateAtelier(dataA); 
                }else{
                    let dataA = {room: tmpA.room, start: tmpA.start, end: tmpA.end}
                    await createAtelier(dataA); 
                }

                return new Response(JSON.stringify({message:null}), {status: 200});    

            case "GET_ATELIER":
                let GetAtelierList = await getAtelier(); 
                return new Response(GetAtelierList.value, {status: 200}); 
            

            case "DELETE_ATELIER":
                let DelAtelier = await deleteAtelier(JSON.parse(body).id); 
                return new Response(DelAtelier.value, {status: 200}); **/



            default:
                return new Response(JSON.stringify({message:"Method not allowed. Please read the documentation."}), {status: 405});
        }


    } catch (error) {
        return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
    }
}

export default eventHandler(handler);
