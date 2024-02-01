const createUser = async (req, res) => {
  res.json(req?.url);
};
const updateUser = async (req, res) => {
  res.json(req?.url);
};
const getUsers = async (req, res) => {
  res.json(req?.url);
};
const deleteUsers = async (req, res) => res.json(req?.url);

module.exports = {
  createUser,
  updateUser,
  getUsers,
  deleteUsers,
};
