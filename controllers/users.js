const mongoose = require('mongoose');
const User = require('../models/user');

const getUser = async (req, res) => {
  const user = await User.find({});
  res.send(user);
};

const getUserById = (req, res) => {
  User.findById(req.params.userId).orFail(new Error('NotFound'))
    // eslint-disable-next-line consistent-return
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'User с указанным _id не найден' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Некорректный _id', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(404).send({ message: 'Ошибка валидации', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};
const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.body.owner, { name: req.body.name, about: req.body.about }).orFail(new Error('NotFound'))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const updateUserAvatar = (req, res) => {
  User.findByIdAndUpdate(req.body.owner, { avatar: req.body.avatar }).orFail(new Error('NotFound'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'User с указанным _id не найден' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Некорректный _id', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

module.exports = {
  getUser,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
