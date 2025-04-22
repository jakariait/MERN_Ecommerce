const AdminModel = require("../models/AdminModel");

const adminService = {
  getAllAdmins: async () => await AdminModel.find(),

  getAdminById: async (id) => await AdminModel.findById(id),

  createAdmin: async (adminData) => await AdminModel.create(adminData),

  updateAdmin: async (id, adminData) =>
    await AdminModel.findByIdAndUpdate(id, adminData, { new: true }),

  deleteAdmin: async (id) => await AdminModel.findByIdAndDelete(id),
};

module.exports = adminService;
