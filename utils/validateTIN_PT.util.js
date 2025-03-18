const validateTIN_PT = (tinValue) => {
  const tin = typeof tinValue === 'string' ? tinValue : tinValue.toString();
  const validationSets = {
    one: ['1', '2', '3', '5', '6', '8'],
    two: ['45', '70', '71', '72', '74', '75', '77', '79', '90', '91', '98', '99'],
  };
  if (tin.length !== 9) return false;
  if (
    !validationSets.one.includes(tin.substr(0, 1)) &&
    !validationSets.two.includes(tin.substr(0, 2))
  )
    return false;
  const total =
    tin[0] * 9 +
    tin[1] * 8 +
    tin[2] * 7 +
    tin[3] * 6 +
    tin[4] * 5 +
    tin[5] * 4 +
    tin[6] * 3 +
    tin[7] * 2;
  const modulo11 = Number(total) % 11;
  const checkDigit = modulo11 < 2 ? 0 : 11 - modulo11;
  return checkDigit === Number(tin[8]);
};

module.exports = validateTIN_PT;
