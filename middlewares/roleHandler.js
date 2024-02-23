const roleHandler = (roles) => (req, res, next) => {
  const role = parseInt(req?.role, 10);
  console.log('🚀 ~ roleHandler ~ role:', role);
  if (!role) {
    throw Error('Unauthorized');
  }

  console.log('🚀 ~ roleHandler ~ roles:', roles);
  if (!roles.includes(role)) {
    res.status(401);
    throw Error(`Member with role: ${role} can not access this route`);
  }
  next();
};

module.exports = roleHandler;
