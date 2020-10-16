const express = require('express');
const app = express();
const apiRouter = require('./routes/api.routes.js');
const {
  invalidEndpointHandler,
  customErrorHandler,
  send500Error,
  PSQLErrorHandler,
  handle405Error,
} = require('./errors');
const listEndpoints = require('express-list-endpoints');

app.use(express.json());

app
  .route('/api')
  .get((req, res, next) => {
    res.send({ endpoints: listEndpoints(app) });
  })
  .all(handle405Error);
app.use('/api', apiRouter);
app.use('/*', invalidEndpointHandler);

app.use(customErrorHandler);
app.use(PSQLErrorHandler);
app.use(send500Error);

module.exports = app;
