const generateFullDateNoTimeZone = () => {
  const date = new Date();
  let dateString =
    ('0' + date.getDate()).slice(-2) +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    date.getFullYear() +
    ' ' +
    ('0' + date.getHours()).slice(-2) +
    ':' +
    ('0' + date.getMinutes()).slice(-2) +
    ':' +
    ('0' + date.getSeconds()).slice(-2);

  return dateString;
};

const generateFullDate = (timeZone = 'UTC', minutes = 0) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timeZone,
  };

  const formatter = new Intl.DateTimeFormat('pt-PT', options);
  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + minutes);
  const dateString = formatter.format(currentDate);

  return dateString;
};

const generateYear = () => {
  const date = new Date();
  let dateString = date.getFullYear();

  return dateString;
};

const generateYearYYYYMMDD = (addedDays = 0) => {
  const date = new Date();
  let dateString =
    date.getFullYear() +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    ('0' + (date.getDate() + addedDays)).slice(-2);

  return dateString;
};

const getFormattedDateDAY_MONTH_YEAR = (date = new Date()) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}_${month}_${year}`;
};

module.exports = {
  generateFullDateNoTimeZone,
  generateFullDate,
  generateYear,
  generateYearYYYYMMDD,
  getFormattedDateDAY_MONTH_YEAR,
};
