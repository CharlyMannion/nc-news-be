const { formatErrorMsg } = require('../utils');

exports.invalidEndpointHandler = (req, res, next) => {
  res.status(404).send({ msg: 'This page does not exist' });
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.PSQLErrorHandler = (err, req, res, next) => {
  const PSQLErrorCodes = {
    '22P02': {
      status: 400,
      msg: 'Bad request',
    },
    42703: {
      status: 400,
      msg: 'Bad request',
    },
    23502: {
      status: 400,
      msg: 'Bad request',
    },
  };
  if (err.code === '23503') {
    const { constraint } = err;
    const formattedErrorMsg = formatErrorMsg(constraint);
    res.status(404).send({ msg: `${formattedErrorMsg} does not exist` });
  } else if (PSQLErrorCodes.hasOwnProperty(err.code)) {
    const { status, msg } = PSQLErrorCodes[err.code];
    res.status(status).send({ msg });
  } else next(err);
};

exports.send500Error = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal server error' });
};

exports.handle405Error = (req, res, next) => {
  res.status(405).send({ msg: 'Method not allowed' });
};
