const slugify = (string) => {
  if (typeof string !== 'string') {
    return '';
  }

  string = string.replace(/^\s+|\s+$/g, '');
  // Make the string lowercase
  string = string.toLowerCase();
  // Remove accents, swap ñ for n, etc
  const from =
    'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;%';
  const to =
    'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa-------';
  for (let char = 0, letter = from.length; char < letter; char++) {
    string = string.replace(new RegExp(from.charAt(char), 'g'), to.charAt(char));
  }
  // Remove invalid chars
  string = string
    .replace(/[^a-z0-9 -]/g, '')
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-')
    // Collapse dashes
    .replace(/-+/g, '-');

  return string;
};

module.exports = slugify;
