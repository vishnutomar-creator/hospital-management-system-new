const mongoose = require("mongoose");

const generalLedgerSchema = new mongoose.Schema(
    {
        accountCode: {
            type: String,
            required: true,
            trim: true,
        },

        accountName: {
            type: String,
            required: true,
            trim: true,
        },

        debit: {
            type: Number,
            default: 0,
            min: 0,
        },

        credit: {
            type: Number,
            default: 0,
            min: 0,
        },

        transactionDate: {
            type: Date,
            default: Date.now,
        },

        description: {
            type: String,
            trim: true,
        },

        referenceType: {
            type: String,
            enum: ["Billing", "Payment", "PurchaseOrder", "Payroll", "Manual", "Other"],
            default: "Manual",
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

const GeneralLedger = mongoose.model("GeneralLedger", generalLedgerSchema);

module.exports = GeneralLedger;