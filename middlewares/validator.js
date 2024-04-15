const { generateErrorMessage } = require('zod-error');

const validator = (schema) => async (req, res, next) => {
  try {
    const options = {
      delimiter: {
        component: ' - ',
      },
      code: {
        enabled: false,
      },
      path: {
        enabled: true,
        transform: ({ label, value }) => `${label}${value}`,
      },
      transform: ({ errorMessage, index }) => `🔑 Error #${index + 1}: ${errorMessage}`,
    };

    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errorMessage = generateErrorMessage(result.error.issues, options);
      throw new Error(errorMessage);
    }

    req.data = result.data;

    next();
  } catch (error) {
    console.log('🚀 ~ validator ~ error:', error);
    next(error);
  }
};

module.exports = { validator };
