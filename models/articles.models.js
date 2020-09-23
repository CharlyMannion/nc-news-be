const connection = require('../db/connection');

exports.delArticleById = (article_id) => {
  return connection('articles').where({ article_id }).del();
};

exports.updateArticleById = (article_id, body) => {
  if (
    body.inc_votes &&
    typeof body.inc_votes === 'number' &&
    Object.keys(body).length === 1
  ) {
    return connection('articles')
      .where({ article_id })
      .increment('votes', body.inc_votes)
      .returning('*')
      .then((updatedArticle) => {
        if (updatedArticle[0] === undefined)
          return Promise.reject({ status: 404, msg: 'Article does not exist' });
        else return updatedArticle[0];
      });
  } else {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
};

exports.selectArticleById = (article_id) => {
  return connection('articles')
    .select('articles.*')
    .count({ comment_count: 'comments.article_id' })
    .where('articles.article_id', article_id)
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .then((article) => {
      if (article[0] === undefined)
        return Promise.reject({ status: 404, msg: 'Article does not exist' });
      else return article[0];
    });
};

exports.addCommentByArticleId = (article_id, body) => {
  body.author = body.username;
  delete body.username;
  return connection('comments')
    .insert({ ...body, article_id })
    .returning('*')
    .then((comment) => {
      return comment[0];
    });
};

exports.selectCommentsByArticleId = (article_id, sortBy, sortOrder) => {
  const sort_by = sortBy || 'created_at';
  const order = sortOrder || 'desc';
  return connection('comments')
    .select('comment_id', 'author', 'votes', 'created_at', 'body')
    .where({ article_id })
    .orderBy(sort_by, order)
    .returning('*');
};
