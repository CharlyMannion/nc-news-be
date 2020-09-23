const { getUserByUsername } = require('../models/users.models');

exports.sendUserByUsername = (req, res, next) => {
  const {
    params: { username },
  } = req;
  getUserByUsername(username)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};
