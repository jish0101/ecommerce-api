const allowedList = ['http://localhost:8000/', 'http://127.0.0.1:5500'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

module.exports = {
  corsOptions,
  allowedList,
};
