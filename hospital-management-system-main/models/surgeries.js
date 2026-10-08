const mongoose = require("mongoose");

const surgerySchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        primarySurgeonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },

        assistantSurgeonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
        },

        otId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OperationTheater",
        },

        surgeryName: {
            type: String,
            required: true,
            trim: true,
        },

        surgeryDate: {
            type: Date,
            required: true,
        },

        startTime: {
            type: String,
            trim: true,
        },

        endTime: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["Scheduled", "InProgress", "Completed", "Cancelled"],
            default: "Scheduled",
        },

        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const Surgery = mongoose.model("Surgery", surgerySchema);

module.exports = Surgery;