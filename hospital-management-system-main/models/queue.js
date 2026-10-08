const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },

        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            default: null,
        },

        queueNumber: {
            type: Number,
            required: true,
        },

        queueDate: {
            type: Date,
            required: true,
            default: () => new Date(new Date().setHours(0, 0, 0, 0)),
        },

        status: {
            type: String,
            enum: ["Waiting", "InConsultation", "Completed", "Skipped", "Cancelled"],
            default: "Waiting",
        },

        checkInTime: {
            type: Date,
            default: Date.now,
        },

        calledAt: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Prevent duplicate queue number for same doctor on same day
queueSchema.index({ doctorId: 1, queueDate: 1, queueNumber: 1 }, { unique: true });

const Queue = mongoose.model("Queue", queueSchema);

module.exports = Queue;