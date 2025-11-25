import swaggerJSDoc from "swagger-jsdoc";

export default defineEventHandler(async (event) => {
  const swaggerDefinition = {
    openapi: "3.0.1",
    info: {
      title: "IUT Onboarding API",
      version: "1.0.0",
    },
    servers: [{ url: "/info/api/v1" }],
    schemes:
      process.env.SWAGGER_SCHEMA_HTTPS === "true"
        ? ["https"]
        : ["http", "https"],
    components: {
      securitySchemes: {
        JWT: {
          type: "apiKey",
          description: "JWT authorization of an API",
          name: "Authorization",
          in: "header",
        },
      },
    },
    security: {
      JWT: [],
    },
  };

  const options = {
    swaggerDefinition,
    apis: ["server/api/**/*.js"],
  };

  return swaggerJSDoc(options);
});
