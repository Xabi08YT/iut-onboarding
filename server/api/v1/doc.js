import swaggerJSDoc from "swagger-jsdoc";

let handler =  (_req, _res) => {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "TITLE",
      version: "1.0.0",
    },
    servers: [{ url: "/api/v1" }],
    schemes:
            process.env.SWAGGER_SCHEMA_HTTPS === "true"
              ? ["https"]
              : ["http", "https"],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
    },
    security: {
      ApiKeyAuth: [],
      OAuth2: {},
    },
  };

  const options = {
    swaggerDefinition,
    apis: ["server/api/**/*.js"],
  };

  return swaggerJSDoc(options);
};

export default eventHandler(handler);
