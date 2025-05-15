const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      res.status(403).json({ message: 'Access Denied: Admins only' });
    }
  };
};

module.exports = checkRole;