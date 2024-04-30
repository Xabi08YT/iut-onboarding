import fetch from 'node-fetch';
// const students = require('../students.json').default;
import students from '../students.json'

// eslint-disable-next-line no-unused-vars
export const handler = async (event, context) => {
    try {
        const ticket = event.queryStringParameters.ticket;
        const service = event.queryStringParameters.service;

        console.log(`[ Connexion CAS ]`, ticket, service);

        // Vérification -> la requête reçu a bien les paramètres attendus
        if (ticket == undefined || service == undefined)
            return { statusCode: 400, body: 'Invalid params' };

        // Faire valider le ticket auprès de CAS
        // Si le ticket est valide, la réponse donnée par CAS contient l'idnum lié au ticket
        const response = await validateCASTicket(service, ticket);
        console.log(`CAS response`, response);

        // Dans le cas ou le ticket n'est pas valide (Ou autre erreur), on voit ça dans la réponse
        if (Object.keys(response.serviceResponse).includes('authenticationFailure'))
            return { statusCode: 400, body: JSON.stringify(response) };

        // Récupération de l'idnum donné dans la réponse
        const idnum = response.serviceResponse.authenticationSuccess.user;

        // On cherche l'étudiant associé à cet idnum dans la liste
        // des étudiants de l'IUT
        const flattedStudents = Object.values(students).flat();
        const student = flattedStudents.find(s => s.idnum == idnum);

        if (student == undefined) // Si l'étudiant n'est pas trouvé -> il n'est pas de l'IUT
            return { statusCode: 418, body: JSON.stringify('I\'m a teapot') };

        console.log(`[ Connexion CAS de ${student.displayName} ]`);

        // Renvoyer le données sur l'élève à l'emetteur
        return { statusCode: 200, body: JSON.stringify(student) };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify(error) };
    }
};

const validateCASTicket = (service, ticket) => fetch(
    `https://cas.u-bordeaux.fr/cas/serviceValidate?format=JSON&service=${service}&ticket=${ticket}`
).then(resp => resp.json());