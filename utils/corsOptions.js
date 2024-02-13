const allowedList = ['http://localhost:8000', 'http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedList.indexOf(origin) !== -1) {
      console.log('allowed');
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
