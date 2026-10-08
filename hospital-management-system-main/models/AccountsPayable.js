const mongoose = require("mongoose");

const accountsPayableSchema = new mongoose.Schema(
    {
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },

        invoiceNo: {
            type: String,
            required: true,
            trim: true,
            unique: true,
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
            enum: ["Unpaid", "Paid", "Overdue"],
            default: "Unpaid",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

const AccountsPayable = mongoose.model("AccountsPayable", accountsPayableSchema);

module.exports = AccountsPayable;