const mongoose = require("mongoose");

const insuranceClaimSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        billId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Billing",
            required: true,
        },

        insuranceCompany: {
            type: String,
            required: true,
            trim: true,
        },

        policyNo: {
            type: String,
            required: true,
            trim: true,
        },

        claimAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        approvedAmount: {
            type: Number,
            default: null,
            min: 0,
        },

        submittedDate: {
            type: Date,
            default: Date.now,
        },

        decisionDate: {
            type: Date,
            default: null,
        },

        settledDate: {
            type: Date,
            default: null,
        },

        rejectionReason: {
            type: String,
            trim: true,
            default: null,
        },

        status: {
            type: String,
            enum: ["Submitted", "UnderReview", "Approved", "Rejected", "Settled"],
            default: "Submitted",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

const InsuranceClaim = mongoose.model("InsuranceClaim", insuranceClaimSchema);

module.exports = InsuranceClaim;