const getClientIp = (req) => {
  let ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress;

  if (ip) {
    ip = ip.split(',')[0].trim();
    if (ip.includes('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }
  }

  return ip;
};

const getClientIpSocket = (socket) => {
  let ip =
    socket.handshake.headers['x-forwarded-for'] ||
    socket.handshake.headers['x-real-ip'] ||
    socket.handshake.address;

  if (ip) {
    ip = ip.split(',')[0].trim();
    if (ip.includes('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }
  }

  return ip;
};

module.exports = { getClientIp, getClientIpSocket };
