const UserModel = require("../models/UserModel");

const userService = {
  getAllUsers: async () => await UserModel.find(),

  getUserById: async (id) => await UserModel.findById(id),

  createUser: async (userData) => await UserModel.create(userData),

  updateUser: async (id, userData) =>
    await UserModel.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    }),

  deleteUser: async (id) => await UserModel.findByIdAndDelete(id),
};

module.exports = userService;
