const allowedList = [
  'http://localhost:8000',
  'http://localhost:5173',
  'https://ecommerce-client-murex.vercel.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedList.indexOf(origin) !== -1) {
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
