const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/AppError');

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AppError({ statusCode: 401, message: 'Необходима авторизация' }));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    next(new AppError({ statusCode: 401, message: 'Необходима авторизация' }));
  }

  req.user = payload;

  next();
};

module.exports = {
  auth,
};
