const fileSizeLimitErrorHandler = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(413)
        .json({ message: 'Ficheiro demasiado grande.', errorCode: 'FILE_TOO_LARGE' });
    }
    if (err.code === 'MIME_TYPE') {
      return res
        .status(400)
        .json({ message: 'Tipo de ficheiro inválido.', errorCode: 'INVALID_MIME_TYPE' });
    }
    return res
      .status(500)
      .json({ message: 'Erro no upload do ficheiro.', errorCode: 'UPLOAD_ERROR' });
  }
  next();
};

module.exports = fileSizeLimitErrorHandler;
