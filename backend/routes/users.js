const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkRegex } = require('../utils/constants');
const {
  getUser,
  getUsers,
  getMyself,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getMyself);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkRegex),
  }),
}), updateAvatar);

module.exports = usersRouter;
