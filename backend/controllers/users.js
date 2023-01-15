const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const { AppError } = require('../utils/AppError');

const {
  SUCCESS, CREATED,
} = require('../utils/constants');

const getUsers = (req, res, next) => {
  User.find({}).then((users) => {
    res.status(SUCCESS).json(users);
  }).catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new AppError({ statusCode: 404, message: 'Пользователь не найден' }))
    .then((user) => {
      res.status(SUCCESS).json(user);
    }).catch((err) => {
      if (err.name === 'CastError') {
        next(new AppError({ statusCode: 400, message: 'Переданы некорректные данные' }));
      } else {
        next(err);
      }
    });
};

const getMyself = (req, res, next) => {
  User.findById(req.user)
    .orFail(new AppError({ statusCode: 404, message: 'Пользователь не найден' }))
    .then((user) => {
      res.status(SUCCESS).json(user);
    }).catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      name,
      about,
      avatar,
      password: hash,
    }))
    .then(() => res.status(CREATED).send({
      email,
      name,
      about,
      avatar,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new AppError({ statusCode: 409, message: 'Пользователь с таким email уже существует' }));
      } else if (err.name === 'ValidationError') {
        next(new AppError({ statusCode: 400, message: 'Переданы некорректные данные' }));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'very-secret-key', { expiresIn: '7d' });
      res.send({ token });
      console.log(res);
    })
    .catch((e) => {
      next(new AppError({ statusCode: 401, message: e }));
    });
};

const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  }).orFail(new AppError({ statusCode: 404, message: 'Пользователь не найден' }))
    .then((user) => {
      res.status(SUCCESS).json(user);
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        next(new AppError({ statusCode: 400, message: 'Переданы некорректные данные' }));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  }).orFail(new AppError({ statusCode: 404, message: 'Пользователь не найден' }))
    .then((user) => {
      res.status(SUCCESS).json(user);
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        next(new AppError({ statusCode: 400, message: 'Переданы некорректные данные' }));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUser,
  getUsers,
  getMyself,
  updateProfile,
  updateAvatar,
  login,
  createUser,
};
