const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
    {
        assetName: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ["Medical Equipment", "Furniture", "IT Equipment", "Vehicle", "Other"],
            default: "Other",
        },
        purchaseDate: {
            type: Date,
            required: true,
        },
        purchasePrice: {
            type: Number,
            required: true,
            min: 0,
        },
        warrantyExpiry: {
            type: Date,
            default: null,
        },
        location: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["Active", "UnderMaintenance", "Retired"],
            default: "Active",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);
module.exports = Asset;