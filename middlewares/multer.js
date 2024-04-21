const multer = require('multer');
const { cloudinaryStorage } = require('./cloudinary');

const multerInstance = multer({ storage: cloudinaryStorage });

module.exports = { multerInstance };
