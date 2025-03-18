const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const isImageDark = async (imageUrl, heightParameter = 100) => {
  const image = await loadImage(imageUrl);

  if (heightParameter !== -1) {
    const canvas = createCanvas(image.width, heightParameter);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, heightParameter, 0, 0, image.width, heightParameter);
  } else {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixelData = imageData.data;

  let redTotal = 0,
    greenTotal = 0,
    blueTotal = 0;

  for (let i = 0; i < pixelData.length; i += 4) {
    redTotal += pixelData[i];
    greenTotal += pixelData[i + 1];
    blueTotal += pixelData[i + 2];
  }

  const pixelCount = pixelData.length / 4;
  const redAverage = Math.floor(redTotal / pixelCount);
  const greenAverage = Math.floor(greenTotal / pixelCount);
  const blueAverage = Math.floor(blueTotal / pixelCount);

  const brightness = (redAverage + greenAverage + blueAverage) / 3;

  return brightness < 128 ? true : false;
};

const checkImageOrientation = async (imagePath) => {
  try {
    const image = await loadImage(imagePath);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    const width = canvas.width;
    const height = canvas.height;

    if (width > height) {
      return 'landscape';
    } else if (width < height) {
      return 'portrait';
    } else {
      return 'square';
    }
  } catch (err) {
    return 'Failed to process image';
  }
};

const resizeImage = async (imagePath, targetWidth, outputFilePath) => {
  try {
    const image = await loadImage(imagePath);
    const extension = imagePath.substring(imagePath.lastIndexOf('.') + 1).toLowerCase();

    const canvas = createCanvas(targetWidth, image.height * (targetWidth / image.width));
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(image, 0, 0, targetWidth, image.height * (targetWidth / image.width));

    let resizedBuffer;
    if (extension === 'png') {
      resizedBuffer = canvas.toBuffer('image/png');
    } else if (extension === 'jpg' || extension === 'jpeg') {
      resizedBuffer = canvas.toBuffer('image/jpeg');
    } else if (extension === 'gif') {
      resizedBuffer = canvas.toBuffer('image/gif');
    } else {
      return 'Unsupported image format';
    }

    fs.writeFileSync(outputFilePath, resizedBuffer);

    return outputFilePath;
  } catch (err) {
    return `Failed to resize image: ${imagePath}`;
  }
};

const convertToBlackAndWhite = async (imagePath, outputFilePath) => {
  try {
    const image = await loadImage(imagePath);
    const extension = imagePath.substring(imagePath.lastIndexOf('.') + 1).toLowerCase();

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;

    for (let i = 0; i < pixelData.length; i += 4) {
      const red = pixelData[i];
      const green = pixelData[i + 1];
      const blue = pixelData[i + 2];

      const average = (red + green + blue) / 3;

      pixelData[i] = average; // Red
      pixelData[i + 1] = average; // Green
      pixelData[i + 2] = average; // Blue
    }

    ctx.putImageData(imageData, 0, 0);

    let outputBuffer;
    if (extension === 'png') {
      outputBuffer = canvas.toBuffer('image/png');
    } else if (extension === 'jpg' || extension === 'jpeg') {
      outputBuffer = canvas.toBuffer('image/jpeg');
    } else {
      return 'Unsupported image format';
    }

    fs.writeFileSync(outputFilePath, outputBuffer);

    return `Image converted to black and white and saved: ${outputFilePath}`;
  } catch (err) {
    return `Failed to convert image: ${imagePath}`;
  }
};

const convertToWebp = async (inputPath, outputPath) => {
  try {
    const image = await loadImage(inputPath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const buffer = canvas.toBuffer('image/webp');
    fs.writeFileSync(outputPath, buffer);
    return `Image conversion successful: ${outputPath}`;
  } catch (err) {
    console.error('Error during conversion: ', err);
    return `Error during conversion: ${err}`;
  }
};

module.exports = {
  isImageDark,
  checkImageOrientation,
  resizeImage,
  convertToBlackAndWhite,
  convertToWebp,
};
