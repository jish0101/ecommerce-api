const jsonParser = (keysToParse) => (req, res, next) => {
  try {
    keysToParse.forEach((key) => {
      if (req.body[key] && typeof req.body[key] === 'string') {
        req.body[key] = JSON.parse(req.body[key]);
      }
    });

    console.log(req.body);

    next();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    next({
      status: 400,
      message: `Error parsing JSON for key: ${error.key || 'unknown'}`,
      error: error.message,
    });
  }
};

module.exports = jsonParser;
