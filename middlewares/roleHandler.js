const roleHandler = (roles) => (req, res, next) => {
  const role = parseInt(req?.role, 10);
  if (!role) {
    throw Error('Unauthorized');
  }

  if (!roles.includes(role)) {
    res.status(401);
    throw Error(`Member with role: ${role} can not access this route`);
  }
  next();
};

module.exports = roleHandler;
