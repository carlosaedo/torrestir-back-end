const generateUUId = () => {
  let date = new Date().getTime();

  if (global.performance && typeof global.performance.now === 'function') {
    date += performance.now();
  }

  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (character) {
    let randomize = (date + Math.random() * 16) % 16 | 0;
    date = Math.floor(date / 16);
    return (character == 'x' ? randomize : (randomize & 0x3) | 0x8).toString(16);
  });

  return uuid;
};

module.exports = generateUUId;
