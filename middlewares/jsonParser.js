const jsonParser = (keysToParse) => (req, res, next) => {
  try {
    keysToParse.forEach((key) => {
      if (req.body[key] && typeof req.body[key] === 'string') {
        const parsedJson = JSON.parse(req.body[key]);

        if (parsedJson && typeof parsedJson === 'object') {
          req.body[key] = parsedJson;
        } else {
          throw new Error(`Invalid JSON in ${key}`);
        }
      }
    });

    console.log(req.body);

    next();
  } catch (error) {
    console.error('Error parsing JSON:', error);
    next(error);
  }
};

module.exports = jsonParser;
