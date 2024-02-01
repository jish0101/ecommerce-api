const corsOptions = require('../utils/corsOptions');

const credentials = (req, res, next) => {
  try {
    const { origin } = req.headers;
    if (corsOptions.allowedList.includes(origin)) {
      res.headers('Access-Control-Allow-Credentials', true);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = credentials;
