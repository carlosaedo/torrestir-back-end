const supportedStatuses = {
  0: 'Pendente',
  1: 'Em preparação',
  2: 'Despachada',
  3: 'Entregue',
};
const validateStatus = (status) => {
  return supportedStatuses.hasOwnProperty(status);
};

module.exports = { supportedStatuses, validateStatus };
