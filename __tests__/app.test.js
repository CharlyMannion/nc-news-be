const app = require('../app.js');
const request = require('supertest');
const connection = require('../db/connection');

beforeEach(() => {
  return connection.seed.run();
});

afterAll(() => {
  return connection.destroy();
});

describe('app', () => {
  it('returns status 404 when given an invalid path', () => {
    return request(app)
      .get('/sheep')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('This page does not exist');
      });
  });
  describe('/api', () => {
    it('returns status 405 when given an invalid method', () => {
      const invalidMethods = ['delete', 'post', 'patch', 'put'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]('/api')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
    describe('/topics', () => {
      it('returns status 405 when given an invalid method', () => {
        const invalidMethods = ['delete', 'patch', 'put'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/topics')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
      describe('GET', () => {
        it('returns status 200 and an object containing an array of topics', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => {
              expect(topics).toHaveLength(3);
              expect(Object.keys(topics[0])).toEqual(
                expect.arrayContaining(['description', 'slug'])
              );
            });
        });
      });
    });

    describe('/users', () => {
      describe('/:username', () => {
        it('returns status 405 when invalid method', () => {
          const invalidMethods = ['delete', 'post', 'patch', 'put'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]('/api/users/sheep')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Method not allowed');
              });
          });
          return Promise.all(methodPromises);
        });
        describe('GET', () => {
          it('returns status 200 and object containing desired user', () => {
            return request(app)
              .get('/api/users/icellusedkars')
              .expect(200)
              .then(({ body: { user } }) => {
                expect(Object.keys(user)).toEqual(
                  expect.arrayContaining(['username', 'name', 'avatar_url'])
                );
                expect(user.username).toBe('icellusedkars');
              });
          });
          it('returns status 404 when user does not exist', () => {
            return request(app)
              .get('/api/users/isellusedkars')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('User does not exist');
              });
          });
        });
      });
    });
    describe('/articles', () => {
      it('returns status 405 when invalid method', () => {
        const invalidMethods = ['delete', 'patch', 'put'];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/articles')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
      describe('GET', () => {
        it('returns status 200 and object containing array of articles which include comment_count, sorted by date in descending order when no queries provided', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toHaveLength(12);
              expect(Object.keys(articles[0])).toEqual(
                expect.arrayContaining([
                  'author',
                  'title',
                  'article_id',
                  'topic',
                  'created_at',
                  'votes',
                  'comment_count',
                ])
              );
              expect(articles).toBeSortedBy('created_at', { descending: true });
            });
        });
        it('returns status 200 and object containing sorted array when sort_by and order queries provided', () => {
          return request(app)
            .get('/api/articles?sort_by=author&order=asc')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy('author');
            });
        });
        it('returns status 200 and object containing only articles by specific user when author query provided', () => {
          return request(app)
            .get('/api/articles?author=icellusedkars')
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article.author).toBe('icellusedkars');
              });
            });
        });
        it('returns status 200 and object containing only articles on specific topic when topic query provided', () => {
          return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article.topic).toBe('mitch');
              });
            });
        });
        it('returns status 200 and object containing empty array when specified author query has no articles', () => {
          return request(app)
            .get('/api/articles?author=lurker')
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({ articles: [] });
            });
        });
        it('returns status 200 and object containing empty array when specified topic query has no articles', () => {
          return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({ articles: [] });
            });
        });
        it('returns status 400 when sort_by column does not exist', () => {
          return request(app)
            .get('/api/articles?sort_by=banana')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad request');
            });
        });
        it('returns status 400 when order query is not asc or desc', () => {
          return request(app)
            .get('/api/articles?order=ascending')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Bad request');
            });
        });
        it('returns status 404 when author in query does not exist', () => {
          return request(app)
            .get('/api/articles?author=banana')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('User does not exist');
            });
        });
        it('returns status 404 when topic in query does not exist', () => {
          return request(app)
            .get('/api/articles?topic=banana')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Topic does not exist');
            });
        });
      });
      describe('POST', () => {
        it('', () => {});
      });
      describe('/:article_id', () => {
        it('returns status 405 when invalid method', () => {
          const invalidMethods = ['post', 'put'];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]('/api/articles/1')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Method not allowed');
              });
          });
          return Promise.all(methodPromises);
        });
        describe('DELETE', () => {
          it('returns status 204 when deleting article with associated comments', () => {
            return request(app).del('/api/articles/1').expect(204);
          });
          it('returns 404 when deleting an article that does not exist', () => {
            return request(app)
              .del('/api/articles/99')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Article does not exist');
              });
          });
          it('returns status 400 when invalid request', () => {
            return request(app)
              .del('/api/articles/thegoodone')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad request');
              });
          });
        });
        describe('PATCH', () => {
          it('returns status 200 and object containing patched article when passed positive vote number', () => {
            return request(app)
              .patch('/api/articles/12')
              .send({ inc_votes: 5 })
              .expect(200)
              .then(({ body: { updatedArticle } }) => {
                expect(Object.keys(updatedArticle)).toEqual(
                  expect.arrayContaining([
                    'author',
                    'title',
                    'article_id',
                    'body',
                    'topic',
                    'created_at',
                    'votes',
                  ])
                );
                expect(updatedArticle.votes).toBe(5);
              });
          });
          it('returns status 200 and object containing patched article when passed negative vote number', () => {
            return request(app)
              .patch('/api/articles/12')
              .send({ inc_votes: -5 })
              .expect(200)
              .then(({ body: { updatedArticle } }) => {
                expect(Object.keys(updatedArticle)).toEqual(
                  expect.arrayContaining([
                    'author',
                    'title',
                    'article_id',
                    'body',
                    'topic',
                    'created_at',
                    'votes',
                  ])
                );
                expect(updatedArticle.votes).toBe(-5);
              });
          });
          it('returns status 404 when invalid article_id', () => {
            return request(app)
              .patch('/api/articles/13')
              .send({ inc_votes: 5 })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Article does not exist');
              });
          });
          it('returns status 400 when article_id is incorrect datatype', () => {
            return request(app)
              .patch('/api/articles/sheep')
              .send({ inc_votes: 5 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad request');
              });
          });
          it('returns status 400 when body does not contain inc_votes key', () => {
            return request(app)
              .patch('/api/articles/12')
              .send({ votes: 5 })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad request');
              });
          });
          it('returns status 400 when inc_votes value is not a number', () => {
            return request(app)
              .patch('/api/articles/12')
              .send({ inc_votes: 'five' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad request');
              });
          });
          it('returns status 400 when additional, not required property on body', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({ inc_votes: 5, name: 'Mitch' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad request');
              });
          });
        });
        describe('GET', () => {
          it('returns status 200 and object containing article with comment count key', () => {
            return request(app)
              .get('/api/articles/1')
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.article_id).toBe(1);
                expect(article.comment_count).toBe('13');
                expect(Object.keys(article)).toEqual(
                  expect.arrayContaining([
                    'author',
                    'title',
                    'article_id',
                    'body',
                    'topic',
                    'created_at',
                    'votes',
                    'comment_count',
                  ])
                );
              });
          });
          it('returns status 404 when article does not exist', () => {
            return request(app)
              .get('/api/articles/15')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Article does not exist');
              });
          });
          it('returns status 400 when article_id is incorrect datatype', () => {
            return request(app)
              .get('/api/articles/fifteen')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe('Bad request');
              });
          });
        });
        describe('/comments', () => {
          it('returns status 405 when invalid method', () => {
            const invalidMethods = ['delete', 'patch', 'put'];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]('/api/articles/1/comments')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Method not allowed');
                });
            });
            return Promise.all(methodPromises);
          });
          describe('POST', () => {
            it('returns status 201 and object containing posted comment', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 'icellusedkars', body: 'Sheeps feet' })
                .expect(201)
                .then(({ body: { postedComment } }) => {
                  expect(Object.keys(postedComment)).toEqual(
                    expect.arrayContaining([
                      'comment_id',
                      'author',
                      'article_id',
                      'votes',
                      'created_at',
                      'body',
                    ])
                  );
                  expect(postedComment.author).toBe('icellusedkars');
                  expect(postedComment.body).toBe('Sheeps feet');
                });
            });
            it('returns status 404 when article does not exist', () => {
              return request(app)
                .post('/api/articles/15/comments')
                .send({ username: 'icellusedkars', body: 'Sheeps feet' })
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Article_id does not exist');
                });
            });
            it('returns status 404 when user does not exist', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({ username: 'isellusedcars', body: 'NB NB' })
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Author does not exist');
                });
            });
            it('returns status 400 when correct keys are not provided on body', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({ user: 'icellusedkars', body: 'Sheeps feet' })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Bad request');
                });
            });
            it('returns status 400 when body values are incorrect datatypes', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({ username: null, body: null })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Bad request');
                });
            });
            it('returns status 400 when additional, not required property on body', () => {
              return request(app)
                .post('/api/articles/1/comments')
                .send({
                  username: 'icellusedkars',
                  body: 'Sheeps feet',
                  name: 'Mitch',
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Bad request');
                });
            });
          });
          describe('GET', () => {
            it('returns status 200 and object containing array of comments, sorted by created_at in descending order when no queries provided', () => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(Object.keys(comments[0])).toEqual(
                    expect.arrayContaining([
                      'comment_id',
                      'votes',
                      'created_at',
                      'author',
                      'body',
                    ])
                  );
                  expect(comments).toBeSortedBy('created_at', {
                    descending: true,
                  });
                  expect(comments).toHaveLength(13);
                });
            });
            it('returns status 200 and object containing array sorted by created_at in ascending order when ascending order query provided', () => {
              return request(app)
                .get('/api/articles/1/comments?order=asc')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).toBeSortedBy('created_at');
                });
            });
            it('returns status 200 and object containing sorted array when sort_by query is provided', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=votes')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).toBeSortedBy('votes', { descending: true });
                });
            });
            it('returns status 200 and object containing sorted array when both sort_by and order queries are provided', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=votes&order=asc')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).toBeSortedBy('votes');
                });
            });
            it('returns status 200 and object containing empty array when article has no comments', () => {
              return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).toEqual([]);
                });
            });
            it('returns status 404 when article does not exist', () => {
              return request(app)
                .get('/api/articles/99/comments')
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Article does not exist');
                });
            });
            it('returns status 400 when article id is wrong datatype', () => {
              return request(app)
                .get('/api/articles/one/comments')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Bad request');
                });
            });
            it('returns status 400 when sort_by value is not valid', () => {
              return request(app)
                .get('/api/articles/1/comments?sort_by=age')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Bad request');
                });
            });
            it('returns status 400 when order query is not asc or desc', () => {
              return request(app)
                .get('/api/articles/1/comments?order=ascending')
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Invalid sorting order');
                });
            });
          });
        });
      });
    });
  });
});
