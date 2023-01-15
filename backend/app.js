require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { auth } = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/handleErrors');
const { linkRegex } = require('./utils/constants');
const { AppError } = require('./utils/AppError');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

const allowedCors = ['http://moe-mesto.nomoredomains.club', 'https://moe-mesto.nomoredomains.club', 'localhost:3000', 'http://localhost:3000'];

app.use(cors(allowedCors));

app.use(limiter);

app.use(helmet());
app.disable('x-powered-by');

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());
app.use(bodyParser.json());

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

app.use('*', (req, res, next) => {
  next(new AppError({ statusCode: 404, message: 'Страница не найдена' }));
});

app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
