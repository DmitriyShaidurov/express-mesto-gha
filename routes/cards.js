const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCard);

router.post('/cards', createCard);

router.delete('/cards/:cardId', celebrate({
  body: Joi.object().keys({
    _id: Joi.objectId(),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', likeCard);

router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
