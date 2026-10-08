const mongoose = require("mongoose");

const nurseSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },

        dob: {
            type: Date,
        },

        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },

        wardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ward",
        },

        shift: {
            type: String,
            enum: ["Morning", "Evening", "Night"],
            required: true,
        },

        qualification: {
            type: String,
            trim: true,
        },

        experience: {
            type: Number,
            default: 0,
            min: 0,
        },

        licenseNumber: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },

        status: {
            type: String,
            enum: ["Active", "Inactive", "OnLeave"],
            default: "Active",
        },

        profileImage: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

const Nurse = mongoose.model("Nurse", nurseSchema);

module.exports = Nurse;