const connection = require('../db/connection');
const { checkExists } = require('./utils.models');

exports.updateCommentById = (body, comment_id) => {
  if (
    body.inc_votes &&
    typeof body.inc_votes === 'number' &&
    Object.keys(body).length === 1
  ) {
    return checkExists('comments', 'comment_id', comment_id)
      .then((res) => {
        if (res) {
          return connection('comments')
            .first()
            .where({ comment_id })
            .increment('votes', body.inc_votes)
            .returning('*');
        } else {
          return Promise.reject({ status: 404, msg: 'Comment does not exist' });
        }
      })
      .then((comment) => {
        return comment[0];
      });
  } else {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
};

exports.delCommentById = (comment_id) => {
  return connection('comments').where({ comment_id }).del();
};
