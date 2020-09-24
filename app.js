const express = require('express');
const app = express();
const apiRouter = require('./routes/api.routes.js');
const {
  invalidEndpointHandler,
  customErrorHandler,
  send500Error,
  PSQLErrorHandler,
} = require('./errors');

app.use(express.json());

//README is missing information - POST /api/articles

//refactor selectArticles at end
//sendEndpoints function in api.controllers.js
//refactor so there is error handling in checkExists function

app.use('/api', apiRouter);
app.use('/*', invalidEndpointHandler);

app.use(customErrorHandler);
app.use(PSQLErrorHandler);
app.use(send500Error);

module.exports = app;
