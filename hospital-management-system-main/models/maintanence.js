const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
    {
        assetId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Asset",
            required: true,
        },
        maintenanceDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        cost: {
            type: Number,
            default: 0,
            min: 0,
        },
        nextDueDate: {
            type: Date,
            default: null,
        },
        performedBy: {
            type: String,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
module.exports = Maintenance;