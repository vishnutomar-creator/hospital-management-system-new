const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
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

    wardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      required: true,
    },

    bedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bed",
      required: true,
    },

    admissionDate: {
      type: Date,
      default: Date.now,
    },

    dischargeDate: {
      type: Date,
      default: null,
    },

    reasonForAdmission: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Admitted", "Discharged", "Transferred"],
      default: "Admitted",
    },

    dischargeSummary: {
      type: String,
      trim: true,
      default: null,
    },

    admittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "admittedByModel",
    },

    admittedByModel: {
      type: String,
      enum: ["Admin", "Doctor"],
    },
  },
  { timestamps: true }
);

const Admission = mongoose.model("Admission", admissionSchema);

module.exports = Admission;