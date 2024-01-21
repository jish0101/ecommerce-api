
const createUser = async (req, res) => {
  res.json(req?.url);
};
const updateUser = async (req, res) => {
  res.json(req?.url);
};
const getUsers = async (req, res) => {
  res.json(req?.url);
};
const deleteUsers = async (req, res) => {
  try {
    const {} = req;
  res.json(req?.url);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
  updateUser,
  getUsers,
  deleteUsers,
};
