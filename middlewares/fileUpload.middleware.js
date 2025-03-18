const multer = require('multer');
const slugify = require('../utils/slugify.util');
const generateDate = require('../utils/generateDate.util');
const path = require('path');
const fs = require('fs');
const directoryUtil = require('../utils/directory.util');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/x-matroska': 'mkv',
  'video/x-msvideo': 'avi',
  'application/x-zip-compressed': 'zip',
  'application/x-7z-compressed': '7z',
  'application/x-rar-compressed': 'rar',
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const destination = req.query.destinationFolder || 'misc';
    await directoryUtil.checkDirAndCreateUpload(destination);
    cb(null, `./uploads/${destination}`);
  },
  filename: async (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const originalName = path.parse(file.originalname).name;
    const currentDate = slugify(generateDate.generateFullDate());
    const newFileName = slugify(originalName);
    const fileName = `${newFileName}_${currentDate}${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const isValidMime = !!MIME_TYPE_MAP[file.mimetype];
  let err = null;

  if (!isValidMime) {
    err = new Error('Tipo de ficheiro invalido!');
    err.code = 'MIME_TYPE';
  }

  cb(err, isValidMime);
};

const fileUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 1000 },
});

module.exports = fileUpload;
