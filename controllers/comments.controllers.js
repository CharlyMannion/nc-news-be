const { updateCommentById } = require('../models/comments.models.js');

exports.patchCommentById = (req, res, next) => {
  const {
    body: { inc_votes },
    params: { comment_id },
  } = req;
  updateCommentById(inc_votes, comment_id)
    .then((updatedComment) => {
      res.send({ updatedComment });
    })
    .catch(next);
};
