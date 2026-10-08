const mongoose = require("mongoose");

const radiologySchema = new mongoose.Schema(
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

        modality: {
            type: String,
            enum: ["X-Ray", "MRI", "CT", "Ultrasound", "Mammography", "Other"],
            required: true,
        },

        bodyPart: {
            type: String,
            required: true,
            trim: true,
        },

        priority: {
            type: String,
            enum: ["Routine", "Urgent", "STAT"],
            default: "Routine",
        },

        orderDate: {
            type: Date,
            default: Date.now,
        },

        scanDate: {
            type: Date,
            default: null,
        },

        imageURL: {
            type: String,
            default: null,
        },

        reportFile: {
            type: String,
            default: null,
        },

        findings: {
            type: String,
            trim: true,
            default: null,
        },

        impression: {
            type: String,
            enum: ["Normal", "Abnormal", "Critical", null],
            default: null,
        },

        status: {
            type: String,
            enum: ["Ordered", "Scheduled", "InProgress", "Completed", "Cancelled"],
            default: "Ordered",
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            default: null,
        },

        cost: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

const Radiology = mongoose.model("Radiology", radiologySchema);

module.exports = Radiology;