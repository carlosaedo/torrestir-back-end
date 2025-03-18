require('dotenv').config();
const serverInfo = require('./config/server_info');

const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    version: serverInfo.version, // Custom version number
    title: 'TORRESTIR-ORDERS',
    description: 'TORRESTIR-ORDERS API Documentation',
  },
  servers: [
    {
      url: process.env.BASE_SERVER_URL + ':' + process.env.PORT,
      description: 'TORRESTIR-ORDERS Api Docs',
    },
  ],
  tags: [],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const outputFile = './swagger-output.json';
const routes = ['./routes/routes.js'];

const swaggerBuild = swaggerAutogen(outputFile, routes, doc);
module.exports = swaggerBuild;
