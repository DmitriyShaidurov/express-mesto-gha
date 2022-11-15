const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUser,
} = require('../controllers/users');

router.get('/users/me', getUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.get('/users', getUsers);

router.patch('/users/me', celebrate({
  params: Joi.object().keys({
    name: Joi.string().min(2).length(30),
    about: Joi.string().min(2).length(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
