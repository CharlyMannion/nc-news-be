const app = require('../app');
const apiRouter = require('../routes/api.routes');
const listEndpoints = require('express-list-endpoints');

exports.sendEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints: listEndpoints(apiRouter) });
  // listEndpoints(app).then((res) => {
  //   res.send({})
  // });
};
