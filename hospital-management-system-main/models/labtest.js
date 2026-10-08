const mongoose = require("mongoose");

const labTestSchema = new mongoose.Schema(
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

        testName: {
            type: String,
            required: true,
            trim: true,
        },

        testCategory: {
            type: String,
            enum: ["Blood", "Urine", "Imaging", "Microbiology", "Biochemistry", "Other"],
            default: "Other",
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

        sampleCollectedAt: {
            type: Date,
            default: null,
        },

        resultDate: {
            type: Date,
            default: null,
        },

        resultValue: {
            type: String,
            trim: true,
            default: null,
        },

        normalRange: {
            type: String,
            trim: true,
            default: null,
        },

        interpretation: {
            type: String,
            enum: ["Normal", "Abnormal", "Critical", null],
            default: null,
        },

        reportFile: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: ["Ordered", "SampleCollected", "InProgress", "Completed", "Cancelled"],
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

const LabTest = mongoose.model("LabTest", labTestSchema);

module.exports = LabTest;