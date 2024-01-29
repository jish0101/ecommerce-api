const allowedList = ['http://localhost:8000/'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

module.exports = {
  corsOptions,
  allowedList
};
