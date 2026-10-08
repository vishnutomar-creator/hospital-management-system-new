const mongoose = require("mongoose");

const accountsReceivableSchema = new mongoose.Schema(
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

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        dueDate: {
            type: Date,
            required: true,
        },

        paidDate: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: ["Pending", "Paid", "Overdue"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

const AccountsReceivable = mongoose.model("AccountsReceivable", accountsReceivableSchema);

module.exports = AccountsReceivable;