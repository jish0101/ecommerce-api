const notFound = (req, res, next) => {
  const error = new Error(`Not Found ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const schemaErrorHandler = (err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    res.status(400).json({
      type: err.type,
      message: err.error.toString(),
    });
  } else {
    next(err);
  }
};

const errorHandler = (err, req, res, next) => {
  const newStatusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(newStatusCode);
  res.json({
    status: false,
    message: err?.message,
    stack: err?.stack,
  });
  next(err);
};

module.exports = { notFound, errorHandler, schemaErrorHandler };
