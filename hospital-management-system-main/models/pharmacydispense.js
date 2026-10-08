const mongoose = require("mongoose");

const pharmacyDispenseSchema = new mongoose.Schema(
    {
        prescriptionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Prescription",
            required: true,
        },

        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory",
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        pharmacistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        dispenseDate: {
            type: Date,
            default: Date.now,
        },

        status: {   
            type: String,
            enum: ["Dispensed", "Returned"],
            default: "Dispensed",
        },
    },
    { timestamps: true }
);

const PharmacyDispense = mongoose.model("PharmacyDispense", pharmacyDispenseSchema);

module.exports = PharmacyDispense;