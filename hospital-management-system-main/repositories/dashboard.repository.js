const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");

// Total Patients
const getTotalPatients = async () => {
  return await Patient.countDocuments();
};

// Total Doctors
const getTotalDoctors = async () => {
  return await Doctor.countDocuments();
};

// Today's Appointments
const getTodayAppointments = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return await Appointment.countDocuments({
    appointmentDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
};

// Total Revenue
const getTotalRevenue = async () => {
  const result = await Payment.aggregate([
    {
      $match: {
        status: "paid",
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return result[0]?.totalRevenue || 0;
};

// Upcoming Appointments
const getUpcomingAppointments = async () => {
  return await Appointment.find({
    appointmentDate: {
      $gte: new Date(),
    },
  })
    .populate("patientId", "name")
    .populate("doctorId", "name")
    .sort({
      appointmentDate: 1,
    })
    .limit(10)
    .lean();
};

// Recent Patients
const getRecentPatients = async () => {
  return await Patient.find()
    .populate("userId", "name email phone")
    .sort({
      createdAt: -1,
    })
    .limit(10)
    .lean();
};

// Revenue Analytics
const getRevenueAnalytics = async () => {
  return await Payment.aggregate([
    {
      $match: {
        status: "paid",
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        revenue: {
          $sum: "$amount",
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);
};

// Appointment Statistics
const getAppointmentStatistics = async () => {
  return await Appointment.aggregate([
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
      },
    },
  ]);
};

module.exports = {
  getTotalPatients,
  getTotalDoctors,
  getTodayAppointments,
  getTotalRevenue,
  getUpcomingAppointments,
  getRecentPatients,
  getRevenueAnalytics,
  getAppointmentStatistics,
};