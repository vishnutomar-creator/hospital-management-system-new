const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    dosage: {
      type: String,
      required: true,
      trim: true,
    },

    frequency: {
      type: String,
      required: true,
      enum: [
        "once_daily",
        "twice_daily",
        "three_times_daily",
        "four_times_daily",
        "as_needed",
      ],
    },

    timing: {
      type: String,
      enum: [
        "before_meal",
        "after_meal",
        "with_meal",
        "anytime",
      ],
      default: "anytime",
    },

    duration: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      default: null,
    },

    instructions: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const prescriptionSchema = new mongoose.Schema(
  {
    rxId: {
      type: String,
      trim: true,
    },

    recordId: {
      type: String,
      trim: true,
      default: "REC-101",
    },

    patient: {
      type: String,
      trim: true,
    },

    patientName: {
      type: String,
      trim: true,
    },

    medicineName: {
      type: String,
      trim: true,
    },

    dosage: {
      type: String,
      trim: true,
    },

    frequency: {
      type: String,
      trim: true,
      default: "Once daily",
    },

    duration: {
      type: String,
      trim: true,
    },

    instructions: {
      type: String,
      trim: true,
      default: "",
    },

    patientId: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: null,
    },

    doctorId: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: null,
    },

    appointmentId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    diagnosis: {
      type: String,
      trim: true,
      default: "General Consultation",
    },

    symptoms: {
      type: [String],
      default: [],
    },

    medicines: {
      type: Array,
      default: [],
    },

    advice: {
      type: String,
      default: "",
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      default: "Active",
    },

    dispensedAt: {
      type: Date,
      default: null,
    },

    dispensedBy: {
      type: String,
      default: "",
    },

    returnedAt: {
      type: Date,
      default: null,
    },

    returnReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Prescription",
  prescriptionSchema
);