const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUser,
} = require('../controllers/users');

router.get('/users/me', getUser);

router.get('/users', getUsers);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateUserAvatar);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string.id().length(24),
  }),
}), getUserById);

module.exports = router;
