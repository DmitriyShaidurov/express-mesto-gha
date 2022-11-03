const router = require('express').Router();

const {
  createUser, getUser, getUserById, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUser);

router.post('/users', createUser);

router.get('/users/:userId', getUserById);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
