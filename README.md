# Northcoders News API

## About

This RESTful API was built for a clone of Reddit and it allows users to interact with articles by posting, voting, commenting and deleting. It was built with Node.js, Express and Knex on top of a PostgresQL database.

The API can be accessed directly by going to:

https://nc-news-jp.herokuapp.com/api

The link above will serve a list of available endpoints and methods.

## Requirements

- Node.js
- PostgreSQL
- Node Package Manager
- Git CLI

## Getting started

In order to get this project running locally:

1. Fork and clone down the repo and cd into that directory.

```
$ git clone https://github.com/JFParrott/nc-news-be
$ cd nc-news-be
```

2. Install the necessary dependencies:

```
$ npm install
```

3. Set up the databases and run the seed files:

```
$ npm run setup-dbs
$ npm run seed-dev && npm run seed-test
```

4. Start the server:

```
$ npm start
```

5. Head over to localhost:9090/api and enjoy!

## Testing

This app has been tested using Jest and Supertest. In order to the run the tests, use the following command:

```
npm test-app
```
