const { body, param } = require("express-validator");

const joinQueueValidator = [
    body("patientId").notEmpty().withMessage("Patient ID is required").isMongoId().withMessage("Invalid Patient ID"),
    body("doctorId").notEmpty().withMessage("Doctor ID is required").isMongoId().withMessage("Invalid Doctor ID"),
    body("appointmentId").optional().isMongoId().withMessage("Invalid Appointment ID"),
];

const queueIdValidator = [
    param("id").notEmpty().withMessage("Queue ID is required"),
];

const doctorIdValidator = [
    param("doctorId").notEmpty().withMessage("Doctor ID is required").isMongoId().withMessage("Invalid Doctor ID"),
];

module.exports = {
    joinQueueValidator,
    queueIdValidator,
    doctorIdValidator,
};