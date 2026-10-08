const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema(
    {
        bedNumber: {
            type: String,
            required: true,
            trim: true,
        },

        wardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ward",
            required: true,
        },

        bedType: {
            type: String,
            enum: ["General", "ICU", "Private", "SemiPrivate"],
            required: true,
        },

        status: {
            type: String,
            enum: ["Available", "Occupied", "UnderMaintenance", "Reserved"],
            default: "Available",
        },

        currentPatientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            default: null,
        },

        admissionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admission",
            default: null,
        },

        dailyCharge: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

// Prevent duplicate bed number within the same ward
bedSchema.index({ wardId: 1, bedNumber: 1 }, { unique: true });

const Bed = mongoose.model("Bed", bedSchema);

module.exports = Bed;