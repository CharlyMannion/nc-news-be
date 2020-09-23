const data = require('../data/index');
const { topicsData, articlesData, commentsData, usersData } = data;
const {
  formatTime,
  makeRefObj,
  formatComments,
} = require('../utils/data-manipulation');

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return Promise.all([
        knex('topics').insert(topicsData).returning('*'),
        knex('users').insert(usersData).returning('*'),
      ]);
    })
    .then(() => {
      const formattedArticles = formatTime(articlesData);
      return knex('articles').insert(formattedArticles).returning('*');
    })
    .then((articles) => {
      const articleRefObj = makeRefObj(articles, 'title', 'article_id');
      const formattedComments = formatComments(commentsData, articleRefObj);
      const commentsWithDate = formatTime(formattedComments);
      return knex('comments').insert(commentsWithDate).returning('*');
    });
};
