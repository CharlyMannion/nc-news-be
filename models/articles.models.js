const connection = require('../db/connection');
const { checkExists } = require('./utils.models');

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

exports.selectArticles = (article_id, sort_by, order, author, topic) => {
  const sortBy = sort_by || 'created_at';
  const sortOrder = order || 'desc';
  if (sortOrder === 'asc' || sortOrder === 'desc') {
    return connection('articles')
      .select('articles.*')
      .count({ comment_count: 'comments.article_id' })
      .leftJoin('comments', 'articles.article_id', 'comments.article_id')
      .groupBy('articles.article_id')
      .orderBy(sortBy, sortOrder)
      .modify((query) => {
        if (article_id) query.where('articles.article_id', article_id);
        if (author) query.where('articles.author', author);
        if (topic) query.where('articles.topic', topic);
      })
      .then((articles) => {
        return Promise.all([
          articles,
          article_id
            ? checkExists('articles', 'article_id', article_id)
            : false,
          author ? checkExists('users', 'username', author) : false,
          topic ? checkExists('topics', 'slug', topic) : false,
        ]);
      })
      .then(([articles, articleChecker, authorChecker, topicChecker]) => {
        if (articleChecker === undefined)
          return Promise.reject({ status: 404, msg: 'Article does not exist' });
        if (authorChecker === undefined)
          return Promise.reject({ status: 404, msg: 'User does not exist' });
        if (topicChecker === undefined)
          return Promise.reject({ status: 404, msg: 'Topic does not exist' });
        if (authorChecker && articles[0] === undefined) return articles;
        if (topicChecker && articles[0] === undefined) return articles;
        if (!authorChecker && !topicChecker && articles[0] === undefined)
          return Promise.reject({ status: 404, msg: 'Article does not exist' });
        return articles;
      });
  } else {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
};

exports.insertArticle = (articleBody) => {
  const { title, topic, author, body } = articleBody;
  if (title && topic && author && body) {
    return connection('articles')
      .insert(articleBody)
      .returning('*')
      .then((postedArticle) => {
        return postedArticle[0];
      });
  } else {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }
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
  if (order === 'asc' || order === 'desc') {
    return connection('comments')
      .select('comment_id', 'author', 'votes', 'created_at', 'body')
      .where({ article_id })
      .orderBy(sort_by, order)
      .returning('*')
      .then((comments) => {
        return Promise.all([
          comments,
          checkExists('articles', 'article_id', article_id),
        ]);
      })
      .then(([comments, existChecker]) => {
        if (existChecker === undefined) {
          return Promise.reject({ status: 404, msg: 'Article does not exist' });
        } else {
          return comments;
        }
      });
  } else {
    return Promise.reject({ status: 400, msg: 'Invalid sorting order' });
  }
};
