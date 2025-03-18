const sanitizeUserInput = (input) => {
  const sanitizedInput = input.replace(/<[^>]*>/g, '');

  return sanitizedInput.replace(/[&<>"']/g, function (match) {
    switch (match) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return match;
    }
  });
};

function sanitizeInput(input) {
  return input.replace(/<[^>]*>?/gm, '');
}

module.exports = { sanitizeUserInput, sanitizeInput };
