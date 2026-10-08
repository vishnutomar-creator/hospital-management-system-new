const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema(
    {
        wardName: {
            type: String,
            required: true,
            trim: true,
        },

        wardType: {
            type: String,
            enum: ["General", "ICU", "Private", "SemiPrivate", "Emergency", "Pediatric", "Maternity"],
            required: true,
        },

        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },

        floor: {
            type: String,
            trim: true,
        },

        totalBeds: {
            type: Number,
            required: true,
            min: 1,
        },

        availableBeds: {
            type: Number,
            default: function () {
                return this.totalBeds;
            },
            min: 0,
        },

        inChargeNurseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Nurse",
        },

        dailyCharge: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: ["Active", "UnderMaintenance", "Closed"],
            default: "Active",
        },
    },
    { timestamps: true }
);

const Ward = mongoose.model("Ward", wardSchema);

module.exports = Ward;