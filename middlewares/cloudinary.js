const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const {
  CLOUDINARY_CLOUD_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_CLOUD_API_KEY,
} = require('../utils/globals');

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_CLOUD_API_KEY,
  api_secret: CLOUDINARY_CLOUD_API_SECRET,
  secure: true,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'EcommerceApp/Users',
    allowedFormats: ['jpeg', 'png', 'jpg'],
    public_id: (req, file) => {
      const originalFileName = file.originalname.split('.').at(0); // Extracting the original file name without extension
      const timestamp = Date.now(); // Getting current timestamp
      return `${originalFileName}_${timestamp}`; // Combining original file name and timestamp
    },
  },
});

module.exports = { cloudinaryStorage };
