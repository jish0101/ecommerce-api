const expressAsyncHandler = require('express-async-handler');
const multer = require('multer');
const { validateMIMEType } = require('validate-image-type');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { PORT, BASE_URL } = require('../utils/globals');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images/'));
  },
  filename: (req, file, cb) => {
    const uniquesuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniquesuffix}${path.extname(file.originalname)}`);
  },
});

const uploadPhoto = multer({
  storage,
  limits: { fileSize: 5000000 },
});

const imageValidator = expressAsyncHandler(async (req, res, next) => {
  if (req.file) {
    const validationResult = await validateMIMEType(req.file.path, {
      originalFilename: req.file.originalname,
      allowMimeTypes: ['image/jpeg', 'image/png'],
    });
    if (!validationResult.ok) {
      throw new Error('Validaton Error: This image is not valid!');
    }
  }
  const fileName = req?.file?.filename || 'userplaceholder.png';
  const profile = `${BASE_URL}/public/images/${fileName})}`;
  req.body.profile = profile; // setting profile as a link for further handling
  next();
});

const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${file.filename}`);
      fs.unlinkSync(`public/images/products/${file.filename}`);
    }),
  );
  return next();
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/blogs/${file.filename}`);
      fs.unlinkSync(`public/images/blogs/${file.filename}`);
    }),
  );
  return next();
};
module.exports = { uploadPhoto, productImgResize, blogImgResize, imageValidator };
