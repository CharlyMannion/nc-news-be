const commentsRouter = require('express').Router();
const { handle405Error } = require('../errors');
const {
  patchCommentById,
  deleteCommentById,
} = require('../controllers/comments.controllers');

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(handle405Error);

module.exports = commentsRouter;
