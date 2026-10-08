const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
    {
        supplierName: {
            type: String,
            required: true,
            trim: true,
        },
        contactPerson: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        gstin: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },
        category: {
            type: String,
            enum: ["Medicine", "Equipment", "Consumables", "General"],
            default: "General",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;