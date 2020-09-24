require('reflect-metadata');
require('express-async-errors');
require('dotenv/config');

const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');

const logger = require('./logger');

const app = express();

app.use(cors());

//app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.disable('x-powered-by');

app.use(
  morgan(
    ':method :url :remote-addr - :remote-user :status :res[content-length] B :response-time ms',
    { stream: logger.stream },
  ),
);

// serve up production assets
app.use(express.static('build'));

// let the react app to handle any unknown routes
// serve up the index.html if express does'nt recognize the route
const path = require('path');

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const appPort = Number(process.env.PORT || 3031);

app.listen(appPort, () => {
  logger.info(
    `\n${'#'.repeat(100)}\n${' '.repeat(
      26,
    )} Service now running on port '${appPort}' (${
      process.env.NODE_ENV
    }) ${' '.repeat(26)} \n${'#'.repeat(100)}\n`,
  );

});

