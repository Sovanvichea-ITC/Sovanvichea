const Users = require("../../models/users")

const findById = async (id) => {
  try {
    const user = await Users.findById(id);
    return user;
  } catch (err) {
    throw "User is not found"
  }
}

const findAll = async ()=>{
  // to do
}

const updatePass = async () => {
  // to do
}

const update = async () => {
  // to do
}

const remove = async () => {
  // to do
}

module.exports = {
  findById,
  updatePass,
  update,
  remove,
  findAll
}