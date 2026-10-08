const mongoose = require("mongoose");

const operationTheaterSchema = new mongoose.Schema(
    {
        otName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        location: {
            type: String,
            trim: true,
        },

        equipmentAvailable: {
            type: [String],
            default: [],
        },

        status: {   
            type: String,
            enum: ["Available", "Occupied", "UnderMaintenance"],
            default: "Available",
        },
    },
    { timestamps: true }
);

const OperationTheater = mongoose.model("OperationTheater", operationTheaterSchema);

module.exports = OperationTheater;