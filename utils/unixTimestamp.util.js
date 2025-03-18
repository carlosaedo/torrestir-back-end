const unixToDate = function unixToDate(unixTimestamp) {
  return new Date(unixTimestamp * 1000);
};

const dateToUnix = function dateToUnix(date) {
  return Math.floor(date.getTime() / 1000);
};

const getUnixTimestamp = function getUnixTimestamp() {
  return Math.floor(Date.now() / 1000);
};

const calculateDaysBetweenUnixTimes = function calculateDaysBetweenUnixTimes(unixTime1, unixTime2) {
  if (unixTime1 > unixTime2) {
    throw new Error('The first timestamp cannot be later than the second timestamp.');
  }
  return parseInt((unixTime2 - unixTime1) / (60 * 60 * 24));
};

module.exports = { unixToDate, dateToUnix, calculateDaysBetweenUnixTimes, getUnixTimestamp };
