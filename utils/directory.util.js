const fs = require('fs').promises;
//const fs = require('fs/promises');
const path = require('path');

const checkDirAndCreateUpload = async (directoryPath) => {
  try {
    const targetPath = path.join(__dirname, '../uploads', directoryPath);
    await fs.mkdir(targetPath, { recursive: true });
    return true;
  } catch (err) {
    console.error(`Error creating directory: ${err.message}`);
    return false;
  }
};

const checkDirAndCreateData = async (directoryPath) => {
  try {
    const targetPath = path.join(__dirname, '../data', directoryPath);
    await fs.mkdir(targetPath, { recursive: true });
    return true;
  } catch (err) {
    console.error(`Error creating directory: ${err.message}`);
    return false;
  }
};

const checkDirAndCreatePublic = async (directoryPath) => {
  try {
    const targetPath = path.join(__dirname, '../public', directoryPath);
    await fs.mkdir(targetPath, { recursive: true });
    return true;
  } catch (err) {
    console.error(`Error creating directory: ${err.message}`);
    return false;
  }
};

const checkDirExists = async (directoryPath) => {
  try {
    await fs.access(directoryPath, fs.constants.F_OK);
    return true;
  } catch (err) {
    console.error(`Directory does not exist: ${err.message}`);
    return false;
  }
};

module.exports = {
  checkDirAndCreateUpload,
  checkDirAndCreateData,
  checkDirAndCreatePublic,
  checkDirExists,
};
