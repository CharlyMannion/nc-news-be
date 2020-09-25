const {
  updateCommentById,
  delCommentById,
} = require('../models/comments.models.js');

exports.patchCommentById = (req, res, next) => {
  const {
    body,
    params: { comment_id },
  } = req;
  updateCommentById(body, comment_id)
    .then((updatedComment) => {
      res.send({ updatedComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const {
    params: { comment_id },
  } = req;
  delCommentById(comment_id)
    .then((deletedRows) => {
      if (deletedRows !== 0) {
        res.sendStatus(204);
      } else {
        return Promise.reject({ status: 404, msg: 'Comment does not exist' });
      }
    })
    .catch(next);
};
