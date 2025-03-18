// routes/file.routes.js
const express = require('express');
const router = express.Router();
const fileUpload = require('../middlewares/fileUpload.middleware');
const fileSizeLimitErrorHandler = require('../middlewares/fileUploadErrorHandling.middleware');

const fileController = require('../controllers/file.controller');

router.post(
  '/file/upload',
  fileUpload.single('file'),
  fileSizeLimitErrorHandler,
  fileController.fileUpload,
);
router.post(
  '/files/upload',
  fileUpload.array('file', 10),
  fileSizeLimitErrorHandler,
  fileController.filesUpload,
);

module.exports = router;
