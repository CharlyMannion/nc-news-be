const connection = require('../db/connection');

exports.getUserByUsername = (username) => {
  return connection('users')
    .select('*')
    .where({ username })
    .then((user) => {
      if (user[0] === undefined) {
        return Promise.reject({ status: 404, msg: 'User does not exist' });
      } else {
        return user[0];
      }
    });
};
