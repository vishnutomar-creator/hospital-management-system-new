const Admin = require("../models/admin");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response.util");

const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne({ userId: req.user._id }).populate("userId", "-password");
    if (!admin) {
      return errorResponse(res, "Admin profile not found", 404);
    }
    return successResponse(res, admin, "Admin profile fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().populate("userId", "-password");
    return successResponse(res, admins, "Admins fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const assignAdminRole = async (req, res) => {
  try {
    const { userId, permissions, department, superAdmin } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    user.role = "admin";
    await user.save();

    let admin = await Admin.findOne({ userId });
    if (admin) {
      admin.permissions = permissions || admin.permissions;
      admin.department = department || admin.department;
      if (typeof superAdmin === "boolean") admin.superAdmin = superAdmin;
      await admin.save();
    } else {
      admin = await Admin.create({
        userId,
        permissions: permissions || [],
        department: department || "Administration",
        superAdmin: Boolean(superAdmin),
      });
    }

    const populated = await Admin.findById(admin._id).populate("userId", "-password");
    return successResponse(res, populated, "Admin assigned successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  getAdminProfile,
  getAllAdmins,
  assignAdminRole,
};
