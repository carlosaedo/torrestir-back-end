// app.js
require('dotenv').config();
const express = require('express');
const compression = require('compression');
const routes = require('./routes/routes');
const path = require('path');
const port = process.env.PORT || 3000;

const serverInfo = require('./config/serverInfoStart');

const rateLimiter = require('./middlewares/rateLimiter.middleware');
const securityCore = require('./middlewares/securityCore.middleware');
const michaelCors = require('./middlewares/michaelCors.middleware');

const loggingService = require('./services/logging.service');
const loggingErrorService = require('./services/loggingError.service');
const serverLog = require('./middlewares/serverLog.middleware');

const app = express();
app.disable('x-powered-by');

app.use(express.json({ limit: '5mb', extended: true, parameterLimit: 50000, timeout: 120000 }));

app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use(compression());

app.set('trust proxy', true);

app.use(rateLimiter);
app.use(securityCore);
app.use(michaelCors.michaelCorsPreflight);
app.use(michaelCors.michaelCors);

app.use(serverLog);

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.clear();

const spinnerFrames = ['|', '/', '-', '\\'];
let spinnerIndex = 0;
let spinnerInterval;

function startSpinner() {
  spinnerInterval = setInterval(() => {
    process.stdout.write(`\r[SERVER]: STARTING... ${spinnerFrames[spinnerIndex]}`);
    spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;
  }, 100);
}

function stopSpinner() {
  clearInterval(spinnerInterval);
  process.stdout.write('\r');
  console.clear();
}

// Start the spinner
startSpinner();

const runtimeVersion = globalThis.Bun
  ? `[SERVER] Running Bun v${Bun.version}`
  : `[SERVER] Running Node.js v${process.versions.node}`;

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: 'Invalid JSON' });
  }
  next();
});

app.use(loggingService);

app.use('/', routes);

app.use((req, res, next) => {
  return res.status(404).json({ message: 'Invalid route or endpoint' });
});

app.use(loggingErrorService);
app.use((err, req, res, next) => {
  res
    .status(500)
    .json({ err: 'Internal Server Error', message: 'Something went wrong on the server.' });
});

app.listen(port, () => {
  stopSpinner();
  console.log(`${serverInfo.serverAsciiArt}`);
  console.log(`${runtimeVersion}`);
  console.log(`[SERVER] EXPRESS started on port ${port}`);
});
