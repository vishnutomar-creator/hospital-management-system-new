const dashboardService = require("../services/dashboard.service");

const getDashboard = async (req, res, next) => {
  try {
    const dashboardData = await dashboardService.getDashboard();

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};


/// index route me abhi dashboard import nhi hua hai 