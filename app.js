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

//sendEndpoints function in api.controllers.js

//two app-tests to do for when additional properties sent on body for:
//PATCH /api/articles/:article_id
//POST /api/articles/:article_id/comments

app.use('/api', apiRouter);
app.use('/*', invalidEndpointHandler);

app.use(customErrorHandler);
app.use(PSQLErrorHandler);
app.use(send500Error);

module.exports = app;
