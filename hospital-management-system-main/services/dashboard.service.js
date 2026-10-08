const dashboardRepository = require("../repositories/dashboard.repository");

const getDashboard = async () => {
  const [
    totalPatients,
    totalDoctors,
    todayAppointments,
    totalRevenue,
    upcomingAppointments,
    recentPatients,
    revenueAnalytics,
    appointmentStatistics,
  ] = await Promise.all([
    dashboardRepository.getTotalPatients(),

    dashboardRepository.getTotalDoctors(),

    dashboardRepository.getTodayAppointments(),

    dashboardRepository.getTotalRevenue(),

    dashboardRepository.getUpcomingAppointments(),

    dashboardRepository.getRecentPatients(),

    dashboardRepository.getRevenueAnalytics(),

    dashboardRepository.getAppointmentStatistics(),
  ]);

  return {
    stats: {
      totalPatients,
      totalDoctors,
      todayAppointments,
      totalRevenue,
    },

    upcomingAppointments,

    recentPatients,

    revenueAnalytics,

    appointmentStatistics,
  };
};

module.exports = {
  getDashboard,
};