require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const generateDate = require('../utils/generateDate.util');
const ipAddressFormat = require('../utils/ipAddressFormat.util');

const logFilePath = path.join(
  __dirname,
  `../logs/error_${generateDate.getFormattedDateDAY_MONTH_YEAR()}.log`,
);
let accessLogStream;

const initLogStream = () => {
  try {
    const logDir = path.dirname(logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, '', { flag: 'wx' });
    }

    accessLogStream = fs.createWriteStream(logFilePath, { flags: 'a' });
  } catch (err) {
    console.error('Error initializing log stream:', err);
    process.exit(1);
  }
};

initLogStream();

const loggingErrorService = async (err, req, res, next) => {
  try {
    let getUserInfo = 'NO DATA';
    const filteredHeaders = { ...req.headers };
    const filteredBody = { ...req.body };

    if (filteredHeaders.authorization) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      try {
        const authorization = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (authorization) {
          getUserInfo = `{"Email": "${authorization.email}", "UserId": "${authorization.userId}"}`;
        }
      } catch (err) {
        getUserInfo = 'NO DATA';
      }
      filteredHeaders.authorization = '****';
    }

    if (filteredBody.password) {
      filteredBody.password = '****';
    }

    if (filteredBody.oldPassword) {
      filteredBody.oldPassword = '****';
    }

    // Write to local file
    const fileLogEntry =
      `${new Date().toISOString()} - IP: ${ipAddressFormat.getClientIp(req)} - ${req.method} ${
        req.url
      }\n` +
      `ERROR: ${err.stack || err.message || err}\n` +
      `  Protocol: ${req.protocol}\n` +
      `  Host: ${req.get('host')}\n` +
      `  User Agent: ${req.get('user-agent')}\n` +
      `  Referer: ${req.get('referer') || 'N/A'}\n` +
      `  Content-Type: ${req.get('content-type') || 'N/A'}\n` +
      `  Content-Length: ${req.get('content-length') || 'N/A'}\n` +
      `  User Info: ${getUserInfo}\n` +
      `  API Version: ${req.get('api-version') || 'N/A'}\n` +
      `  Origin: ${req.get('origin') || 'N/A'}\n` +
      `  Headers: ${JSON.stringify(filteredHeaders)}\n` +
      `  Query Parameters: ${JSON.stringify(req.query)}\n` +
      `  Body: ${JSON.stringify(filteredBody)}\n\n`;

    console.error('[SERVER - MIDDLEWARE ERROR LOG]: ', fileLogEntry);

    accessLogStream.write(fileLogEntry, 'utf8', (writeError) => {
      if (writeError) {
        console.error('Failed to write to log file:', writeError);
      }

      // Send a response to the client if headers have not been sent yet
      if (!res.headersSent) {
        res.status(500).json({
          err: 'Internal Server Error',
          message: 'Something went wrong on the server.',
        });
      }
    });
  } catch (loggingError) {
    console.error('Error in logging err middleware:', loggingError.stack);

    // Ensure response is sent in case of err in logging
    if (!res.headersSent) {
      res.status(500).json({
        err: 'Internal Server Error',
        message: 'Something went wrong on the server.',
      });
    }
  }
};

module.exports = loggingErrorService;
