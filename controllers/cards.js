const mongoose = require('mongoose');
const Card = require('../models/card');

const getCard = async (req, res) => {
  const card = await Card.find({});
  res.send(card);
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail(new Error('NotFound'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Некорректный _id', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const likeCard = (req, res) => {
  console.log(req.user._id);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.params.cardId } }, // убрать _id из массива
    { new: true },
  ).orFail(new Error('NotFound'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
      // eslint-disable-next-line max-len
        return res.status(400).send({ message: 'Переданы некорректные данные для удаления лайка', err });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', err });
    });
};

module.exports = {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
