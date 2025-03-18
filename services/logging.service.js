require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const generateDate = require('../utils/generateDate.util');
const ipAddressFormat = require('../utils/ipAddressFormat.util');

const logFilePath = path.join(
  __dirname,
  `../logs/request_${generateDate.getFormattedDateDAY_MONTH_YEAR()}.log`,
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

const loggingService = async (req, res, next) => {
  try {
    let getUserInfo = 'NO DATA';
    const filteredHeaders = { ...req.headers };
    const filteredBody = { ...req.body };

    const nginxHeaders = ['x-real-ip', 'x-forwarded-for', 'x-forwarded-proto', 'via'];

    const isBehindNginx = nginxHeaders.some((header) => (req.headers[header] ? true : false));

    if (filteredHeaders.authorization) {
      if (req.headers['authorization']) {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        try {
          const authorization = jwt.verify(token, process.env.JWT_SECRET_KEY);
          if (authorization) {
            getUserInfo = `{"Email": "${authorization.email}", "UserId": "${authorization.userId}"}`;
          }
        } catch (err) {
          getUserInfo = 'NO DATA';
        }
      }
      filteredHeaders.authorization = '****';
    }

    if (filteredBody.password) {
      filteredBody.password = '****';
    }

    if (filteredBody.oldPassword) {
      filteredBody.oldPassword = '****';
    }

    const logEntryLocal = {
      timestamp: new Date().toISOString(),
      ipAddress: ipAddressFormat.getClientIp(req),
      method: req.method,
      url: req.url,
      protocol: req.protocol,
      host: req.get('host'),
      userAgent: req.get('user-agent'),
      referer: req.get('referer') || 'N/A',
      contentType: req.get('content-type') || 'N/A',
      contentLength: req.get('content-length') || 'N/A',
      headers: filteredHeaders,
      userInfo: getUserInfo,
      queryParameters: req.query,
      requestBody: filteredBody,
      apiVersion: req.get('api-version') || 'N/A',
      origin: req.get('origin') || 'N/A',
    };

    const fileLogEntry =
      `${logEntryLocal.timestamp} - IP: ${logEntryLocal.ipAddress} - ${
        isBehindNginx ? 'Request is being proxied through Nginx.' : 'No reverse proxy detected.'
      } - ${logEntryLocal.method} ${logEntryLocal.url}\n` +
      `  Protocol: ${logEntryLocal.protocol}\n` +
      `  Host: ${logEntryLocal.host}\n` +
      `  User Agent: ${logEntryLocal.userAgent}\n` +
      `  Referer: ${logEntryLocal.referer}\n` +
      `  Content-Type: ${logEntryLocal.contentType}\n` +
      `  Content-Length: ${logEntryLocal.contentLength}\n` +
      `  User Info: ${getUserInfo}\n` +
      `  API Version: ${logEntryLocal.apiVersion}\n` +
      `  Origin: ${logEntryLocal.origin}\n` +
      `  Headers: ${JSON.stringify(logEntryLocal.headers)}\n` +
      `  Query Parameters: ${JSON.stringify(logEntryLocal.queryParameters)}\n` +
      `  Body: ${JSON.stringify(logEntryLocal.requestBody)}\n\n`;

    if (process.env.MIDDLEWARE_LOGS === 'true') {
      console.info('[SERVER - MIDDLEWARE LOG]: ', fileLogEntry);
    }
    accessLogStream.write(fileLogEntry, 'utf8', (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
      return next();
    });
  } catch (err) {
    console.error('Logging err:', err);
    return next();
  }
};

module.exports = loggingService;
