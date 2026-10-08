const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
        itemName: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            enum: ["Medicine", "Consumable", "Equipment", "Other"],
            default: "Medicine",
        },

        unit: {
            type: String,
            enum: ["Tablet", "Strip", "Bottle", "Vial", "Box", "Piece"],
            default: "Strip",
        },

        quantityInStock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        reorderLevel: {
            type: Number,
            default: 10,
            min: 0,
        },

        unitPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        expiryDate: {
            type: Date,
        },

        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
        },

        status: {
            type: String,
            enum: ["Active", "Inactive", "OutOfStock", "Expired"],
            default: "Active",
        },
    },
    { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;