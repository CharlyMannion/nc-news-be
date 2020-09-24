const connection = require('../db/connection');

exports.checkExists = (table, column, query) => {
  return connection(table)
    .first()
    .where({ [column]: query });
  // .then((res) => {
  //   if (res) return res;
  //   else Promise.reject({ status: 404, msg: `${column} does not exist` });
  // });
};
