  /**
   * @openapi
   * /event:
   *    get:
   *      description: "Get a list containing all the users that are currently stored in the database"
   *      responses:
   *        200:
   *          description: "Return a JSON array containing every user stored in the database"
   *        401:
   *          description: "user token has expired"
   *        403:
   *          description: "insufficiant access"
   *    post:
   *      description: "Create and save a new user to the database"
   *      responses:
   *        201:
   *          description: "the object has been saved"
   *        401:
   *          description: "user token has expired"
   *        403:
   *          description: "insufficiant access"
   *    put:
   *      description: "Modify an existing user"
   *      responses:
   *        200:
   *          description: "Event modified"
   *        401:
   *          description: "user token has expired"
   *        403:
   *          description: "insufficiant access"
   *        410:
   *          description: "This event does not exist."
   *    delete:
   *      description: "Deletes a user"
   *        200:
   *          description: "Event deleted"
   *        401:
   *          description: "user token has expired"
   *        403:
   *          description: "insufficiant access"
   *        410:
   *          description: "This user does not exist"
   */
function handler(req) {
  try {
    switch(req.method) {
      case "POST":
        return new Response(JSON.stringify({message:"User created successfully."}), {status: 201});
      case "PUT":
        return new Response(JSON.stringify({message:null}), {status: 200});
      case "DELETE":
        return new Response(JSON.stringify({message:null}), {status: 200});
      case "GET":
        return new Response(JSON.stringify([{id:1, uname:"xgoity", role:"Maintainer"}]), {status: 200});
      default:
        return new Response(JSON.stringify({message:"Method not allowed. Please read the documentation."}), {status: 405});
    }
  } catch (error) {
    return new Response(JSON.stringify({message:`Internal Server Error: ${error.message}`}), {status: 500});
  }
}

export default eventHandler(handler);
