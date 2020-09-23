const usersRouter = require('express').Router();
const { sendUserByUsername } = require('../controllers/users.controllers');
const { handle405Error } = require('../errors');

usersRouter.route('/:username').get(sendUserByUsername).all(handle405Error);

module.exports = usersRouter;
