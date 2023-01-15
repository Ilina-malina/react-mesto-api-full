const Card = require('../models/card');
const { AppError } = require('../utils/AppError');

const {
  SUCCESS,
  CREATED,
} = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({}).populate('owner').then((cards) => {
    res.status(SUCCESS).json(cards);
  }).catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).then(async (card) => {
    await card.populate('owner');
    res.status(CREATED).json(card);
  }).catch((err) => {
    if (err.name === 'ValidationAppError') {
      next(new AppError({ statusCode: 400, message: 'Переданы некорректные данные' }));
    } else {
      next(err);
    }
  });
};

const deleteCard = async (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new AppError({ statusCode: 404, message: 'Карточка не найдена' }))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new AppError({ statusCode: 403, message: 'Ошибка доступа' }));
      } else {
        card.remove()
          .then(() => {
            res.status(SUCCESS).json({ message: 'Карточка удалена!' });
          });
      }
    }).catch((err) => {
      if (err.name === 'CastAppError') {
        next(new AppError({ statusCode: 400, message: 'Переданы некорректные данные' }));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).populate('owner')
    .orFail(new AppError({ statusCode: 404, message: 'Карточка не найдена' }))
    .then((card) => {
      res.status(SUCCESS).json(card);
    })
    .catch((err) => {
      if (err.name === 'CastAppError') {
        next(new AppError({ statusCode: 400, message: 'Переданы некорректные данные' }));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).populate('owner')
    .orFail(new AppError({ statusCode: 404, message: 'Карточка не найдена' }))
    .then((card) => {
      res.status(SUCCESS).json(card);
    })
    .catch((err) => {
      if (err.name === 'CastAppError') {
        next(new AppError({ statusCode: 400, message: 'Переданы некорректные данные' }));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
