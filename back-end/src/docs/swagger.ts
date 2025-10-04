import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SpaceZone API",
      version: "1.0.0",
      description: "Documentação da API SpaceZone",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local"
      }
    ],
  },
  apis: ["src/routes/*.ts"]
};

export const swaggerSpec = swaggerJSDoc(options);