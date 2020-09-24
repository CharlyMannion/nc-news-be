const commentsRouter = require('express').Router();
const { handle405Error } = require('../errors');
const { patchCommentById } = require('../controllers/comments.controllers');

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .all(handle405Error);

module.exports = commentsRouter;
