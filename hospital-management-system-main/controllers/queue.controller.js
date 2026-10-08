const queueService = require("../services/queue.service");

const joinQueue = async (req, res, next) => {
    try {
        const entry = await queueService.joinQueue(req.body);
        res.status(201).json({ success: true, message: "Added to queue successfully", data: entry });
    } catch (error) {
        next(error);
    }
};

const getQueues = async (req, res, next) => {
    try {
        const queues = await queueService.getQueues();
        res.status(200).json({ success: true, message: "Today's queue fetched successfully", data: queues });
    } catch (error) {
        next(error);
    }
};

const getQueueById = async (req, res, next) => {
    try {
        const entry = await queueService.getQueueById(req.params.id);
        res.status(200).json({ success: true, message: "Queue entry fetched successfully", data: entry });
    } catch (error) {
        next(error);
    }
};

const getQueueByDoctor = async (req, res, next) => {
    try {
        const queue = await queueService.getQueueByDoctor(req.params.doctorId);
        res.status(200).json({ success: true, message: "Doctor's queue fetched successfully", data: queue });
    } catch (error) {
        next(error);
    }
};

const callNext = async (req, res, next) => {
    try {
        const entry = await queueService.callNext(req.params.doctorId);
        res.status(200).json({ success: true, message: "Next patient called", data: entry });
    } catch (error) {
        next(error);
    }
};

const completeConsultation = async (req, res, next) => {
    try {
        const entry = await queueService.completeConsultation(req.params.id);
        res.status(200).json({ success: true, message: "Consultation marked completed", data: entry });
    } catch (error) {
        next(error);
    }
};

const skipPatient = async (req, res, next) => {
    try {
        const entry = await queueService.skipPatient(req.params.id);
        res.status(200).json({ success: true, message: "Patient skipped", data: entry });
    } catch (error) {
        next(error);
    }
};

const cancelQueueEntry = async (req, res, next) => {
    try {
        const entry = await queueService.cancelQueueEntry(req.params.id);
        res.status(200).json({ success: true, message: "Queue entry cancelled", data: entry });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    joinQueue,
    getQueues,
    getQueueById,
    getQueueByDoctor,
    callNext,
    completeConsultation,
    skipPatient,
    cancelQueueEntry,
};