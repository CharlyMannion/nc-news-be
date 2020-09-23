const {
  delArticleById,
  updateArticleById,
  selectArticleById,
  addCommentByArticleId,
} = require('../models/articles.models');

exports.deleteArticleById = (req, res, next) => {
  const {
    params: { article_id },
  } = req;
  delArticleById(article_id)
    .then((deletedRows) => {
      if (deletedRows !== 0) {
        res.sendStatus(204);
      } else {
        return Promise.reject({ status: 404, msg: 'Article does not exist' });
      }
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const {
    params: { article_id },
    body,
  } = req;
  updateArticleById(article_id, body)
    .then((updatedArticle) => {
      res.send({ updatedArticle });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const {
    params: { article_id },
  } = req;
  selectArticleById(article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const {
    params: { article_id },
    body,
  } = req;
  addCommentByArticleId(article_id, body)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {};
