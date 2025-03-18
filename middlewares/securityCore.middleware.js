const securityCore = (req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'none'; " +
      "default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com unpkg.com; " +
      "style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com unpkg.com; " +
      "img-src 'self' data:; font-src 'self' cdnjs.cloudflare.com unpkg.com; object-src 'none'",
  );
  next();
};

module.exports = securityCore;
