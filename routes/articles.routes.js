const articlesRouter = require('express').Router();
const {
  deleteArticleById,
  patchArticleById,
  getArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
} = require('../controllers/articles.controllers');
const { handle405Error } = require('../errors');

articlesRouter
  .route('/:article_id')
  .delete(deleteArticleById)
  .patch(patchArticleById)
  .get(getArticleById)
  .all(handle405Error);

articlesRouter
  .route('/:article_id/comments')
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId)
  .all(handle405Error);

module.exports = articlesRouter;
