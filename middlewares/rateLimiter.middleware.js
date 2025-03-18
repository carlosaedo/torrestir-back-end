const getIP = require('ipware')().get_ip;
const ipAddressFormat = require('../utils/ipAddressFormat.util');
const requestLimit = new Map();
const MAX_ENTRIES = 500000;
const CLEANUP_THRESHOLD = 1000;
const RATE_LIMIT = 1000;
const TIME_WINDOW = 5000;

let cleanupCounter = 0;

const rateLimiter = (req, res, next) => {
  const { clientIp, clientIpRoutable } = getIP(req);
  const ip = ipAddressFormat.getClientIp(req) || clientIpRoutable || 'unknown';

  const currentTime = Date.now();

  cleanupCounter++;
  if (cleanupCounter >= CLEANUP_THRESHOLD) {
    cleanupCounter = 0;
    for (const [key, value] of requestLimit.entries()) {
      if (currentTime - value.lastRequestTime > TIME_WINDOW) {
        requestLimit.delete(key);
      }
    }
  }

  if (!requestLimit.has(ip)) {
    requestLimit.set(ip, {
      count: 1,
      lastRequestTime: currentTime,
    });
  } else {
    const entry = requestLimit.get(ip);

    if (entry.count >= RATE_LIMIT && currentTime - entry.lastRequestTime < TIME_WINDOW) {
      console.log(`[SERVER] Rate limit exceeded for IP: ${ip}`);
      return res.status(429).send('Demasiados pedidos ao servidor.');
    }

    if (currentTime - entry.lastRequestTime > TIME_WINDOW) {
      entry.count = 1;
      entry.lastRequestTime = currentTime;
    } else {
      entry.count++;
      entry.lastRequestTime = currentTime;
    }

    requestLimit.set(ip, entry);
  }

  if (requestLimit.size > MAX_ENTRIES) {
    const oldestEntries = [...requestLimit.entries()]
      .sort((a, b) => a[1].lastRequestTime - b[1].lastRequestTime)
      .slice(0, requestLimit.size - MAX_ENTRIES);

    for (const [key] of oldestEntries) {
      requestLimit.delete(key);
    }
  }

  next();
};

module.exports = rateLimiter;
