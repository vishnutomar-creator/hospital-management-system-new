const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    recordType: {
      type: String,
      enum: [
        "diagnosis",
        "lab_report",
        "imaging",
        "consultation",
        "follow_up",
        "other",
      ],
      default: "consultation",
    },

    diagnosis: {
      type: String,
      trim: true,
      default: "",
    },

    symptoms: {
      type: [String],
      default: [],
    },

    testName: {
      type: String,
      trim: true,
      default: "",
    },

    testResult: {
      type: String,
      trim: true,
      default: "",
    },

    doctorNotes: {
      type: String,
      trim: true,
      default: "",
    },

    treatment: {
      type: String,
      trim: true,
      default: "",
    },

    attachments: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);