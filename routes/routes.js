require('dotenv').config();
const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');

router.use('/api/v1', require('./auth.routes'));
router.use('/api/v1', require('./user.routes'));
router.use('/api/v1', require('./file.routes'));
router.use('/api/v1', require('./order.routes'));

if (process.env.SWAGGER_ENABLED === 'true') {
  const swaggerOptions = {
    swaggerOptions: {
      docExpansion: 'none',
      displayRequestDuration: true,
      deepLinking: true,
      filter: false,
      showExtensions: true,
    },
    customSiteTitle: 'Torrestir Orders API',
  };

  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, swaggerOptions));
}

module.exports = router;
