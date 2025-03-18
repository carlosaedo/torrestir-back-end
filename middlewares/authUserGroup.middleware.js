/**
 * This middleware checks if the user is authenticated and if the user belongs to
 * any of the authorized user groups. If the user is not authenticated or the
 * user's group is not in the list of authorized groups, it returns a 401 status
 * code with a message indicating that the user is not authenticated.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function in the stack
 * @param {Array} authorizedUserGroups - An array of strings indicating the user
 *   groups that are authorized to access the route. If not provided, the
 *   middleware will allow any authenticated user to access the route.
 */
const authUserGroups = (authorizedUserGroups = []) => {
  return async (req, res, next) => {
    try {
      if (req.authorization && req.authorization.user_group) {
        if (
          authorizedUserGroups &&
          authorizedUserGroups.length > 0 &&
          authorizedUserGroups.includes(req.authorization.user_group)
        ) {
          if (req.authorization.user_group === 'administrator') {
            req.authorization.administratorTrue = true;
          }
          if (req.authorization.user_group === 'superuser') {
            req.authorization.superuserTrue = true;
          }

          return next();
        }
      }
      return res.status(401).json({ message: 'Falha na autenticação' });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: 'Ups, algo de errado aconteceu no servidor.', errMessage: err.message });
    }
  };
};

module.exports = authUserGroups;
