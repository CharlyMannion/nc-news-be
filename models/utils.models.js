const connection = require('../db/connection');

exports.checkExists = (table, column, query) => {
  return connection(table)
    .first()
    .where({ [column]: query });
};
