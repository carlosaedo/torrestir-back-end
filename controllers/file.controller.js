const imageProcessor = require('../utils/imageProcessor.util');

const fileUpload = async (req, res, next) => {
  // #swagger.tags = ['Upload']
  try {
    const { compressImage = 'false', deleteOriginalSize = 'false' } = req.query;

    let imagePath, resizedFile;
    if (req.file && req.file.path) {
      imagePath = req.file.path;
    }
    req.setTimeout(60 * 1000);
    if (compressImage === 'true') {
      const originalExtension = imagePath.match(/\.[^/.]+$/)[0];
      const targetWidth = 1250;
      const outputFilePath = imagePath.replace(/\.[^/.]+$/, `_resized${originalExtension}`);

      resizedFile = await imageProcessor.resizeImage(imagePath, targetWidth, outputFilePath);
      if (deleteOriginalSize === 'true') {
        await deleteFilesService.deleteFileService(path.join(__dirname, `../${imagePath}`));
      }
    }

    res.status(200).json({
      message:
        compressImage === 'true'
          ? 'Ficheiro enviado e comprimido com sucesso'
          : 'Ficheiro enviado com sucesso',
      filePath: compressImage === 'true' ? resizedFile : imagePath,
      fileName: req.file.filename,
    });
  } catch (err) {
    next(err);
  }
};

const filesUpload = async (req, res, next) => {
  // #swagger.tags = ['Upload']
  try {
    const fileNames = req.files.map((file) => file.filename);

    const filePaths = req.files.map((file) => file.path);
    const { compressImages = 'false', deleteOriginalSizes = 'false' } = req.query;
    let compressedFiles;
    if (compressImages === 'true') {
      compressedFiles = await Promise.all(
        filePaths.map(async (filePath) => {
          const originalExtension = filePath.match(/\.[^/.]+$/)[0];
          const targetWidth = 1250;
          const outputFilePath = filePath.replace(/\.[^/.]+$/, `_resized${originalExtension}`);

          await imageProcessor.resizeImage(filePath, targetWidth, outputFilePath);
          if (deleteOriginalSizes === 'true') {
            await deleteFilesService.deleteFileService(path.join(__dirname, `../${filePath}`));
          }

          return outputFilePath;
        }),
      );
    }

    res.status(200).json({
      message:
        compressImages === 'true'
          ? 'Ficheros enviados e comprimidos com sucesso'
          : 'Ficheros enviados com sucesso',
      filePaths: compressImages === 'true' ? compressedFiles : filePaths,
      fileNames: fileNames,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { fileUpload, filesUpload };
