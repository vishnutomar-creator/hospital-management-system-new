const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      trim: true,
    },

    patientName: {
      type: String,
      trim: true,
    },

    age: {
      type: Number,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      default: "Outpatient",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      sparse: true,
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    bloodGroup: {
      type: String,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
    },

    maritalStatus: {
      type: String,
      enum: [
        "Single",
        "Married",
        "Divorced",
        "Widowed",
      ],
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    emergencyContactName: {
      type: String,
      trim: true,
    },

    emergencyContactPhone: {
      type: String,
      trim: true,
    },

    emergencyContactRelation: {
      type: String,
      trim: true,
    },

    allergies: [
      {
        type: String,
        trim: true,
      },
    ],

    medicalHistory: {
      type: String,
      trim: true,
    },

    insuranceProvider: {
      type: String,
      trim: true,
    },

    insuranceNumber: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;