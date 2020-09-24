const connection = require('../db/connection');
const { checkExists } = require('./utils.models');

exports.updateCommentById = (inc_votes, comment_id) => {
  return checkExists('comments', 'comment_id', comment_id)
    .then((res) => {
      if (res) {
        return connection('comments')
          .first()
          .where({ comment_id })
          .increment('votes', inc_votes)
          .returning('*');
      } else {
        return Promise.reject({ status: 404, msg: 'Comment does not exist' });
      }
    })
    .then((comment) => {
      return comment[0];
    });
};
