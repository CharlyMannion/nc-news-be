const articlesRouter = require('express').Router();
const {
  getArticles,
  deleteArticleById,
  patchArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
} = require('../controllers/articles.controllers');
const { handle405Error } = require('../errors');

articlesRouter.route('/').get(getArticles).all(handle405Error);

articlesRouter
  .route('/:article_id')
  .delete(deleteArticleById)
  .patch(patchArticleById)
  .get(getArticles)
  .all(handle405Error);

articlesRouter
  .route('/:article_id/comments')
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId)
  .all(handle405Error);

module.exports = articlesRouter;
