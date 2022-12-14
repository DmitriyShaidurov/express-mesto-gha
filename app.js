const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routesUser = require('./routes/users');
const routesCard = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/notFoundErr');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());

const validateUserSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(
      /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/,
    ),
  }),
});
const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

app.use(cookieParser());
app.use(requestLogger);
app.post('/signin', validateSignin, login);
app.post('/signup', validateUserSignup, createUser);
app.use(auth);
app.use(routesUser);
app.use(routesCard);
app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
