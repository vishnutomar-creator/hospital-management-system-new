const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
    {
        itemName: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            enum: ["Medicine", "Equipment", "Consumables", "Surgical", "General"],
            default: "General",
        },

        quantityInStock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        reorderLevel: {
            type: Number,
            required: true,
            default: 10,
            min: 0,
        },

        unitPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        unit: {
            type: String,
            enum: ["Piece", "Box", "Strip", "Bottle", "Vial", "Kg", "Litre"],
            default: "Piece",
        },

        expiryDate: {
            type: Date,
            default: null,
        },

        batchNumber: {
            type: String,
            trim: true,
        },

        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Supplier",
            required: true,
        },

        status: {
            type: String,
            enum: ["Active", "Discontinued"],
            default: "Active",
        },
    },
    { timestamps: true }
);

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

module.exports = InventoryItem;