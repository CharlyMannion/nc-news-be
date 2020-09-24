const { updateCommentById } = require('../models/comments.models.js');

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
