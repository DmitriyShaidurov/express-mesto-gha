const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, updateUser, updateUserAvatar, getUser,
} = require('../controllers/users');

router.get('/users/me', getUser);

router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().pattern(/[a-f0-9]{24,24}/).length(24),
  }),
}), getUserById);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
