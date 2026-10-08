const Queue = require("../models/queue");

const getTodayDateRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

const createQueueEntry = async (queueData) => {
    return await Queue.create(queueData);
};

const getTodayQueueCountForDoctor = async (doctorId) => {
    const { start, end } = getTodayDateRange();
    return await Queue.countDocuments({
        doctorId,
        queueDate: { $gte: start, $lte: end },
    });
};

const getQueues = async () => {
    const { start, end } = getTodayDateRange();
    return await Queue.find({ queueDate: { $gte: start, $lte: end } })
        .populate("patientId", "name patientName patientId phone")
        .populate("doctorId", "name doctorId specialization")
        .sort({ queueNumber: 1 });
};

const getQueueById = async (id) => {
    return await Queue.findById(id)
        .populate("patientId", "name patientName patientId phone")
        .populate("doctorId", "name doctorId specialization");
};

const getQueueByDoctor = async (doctorId) => {
    const { start, end } = getTodayDateRange();
    return await Queue.find({
        doctorId,
        queueDate: { $gte: start, $lte: end },
    })
        .populate("patientId", "name patientName patientId phone")
        .sort({ queueNumber: 1 });
};

const getNextWaitingForDoctor = async (doctorId) => {
    const { start, end } = getTodayDateRange();
    return await Queue.findOne({
        doctorId,
        queueDate: { $gte: start, $lte: end },
        status: "Waiting",
    })
        .sort({ queueNumber: 1 })
        .populate("patientId", "name patientName patientId phone");
};

const getInConsultationForDoctor = async (doctorId) => {
    const { start, end } = getTodayDateRange();
    return await Queue.findOne({
        doctorId,
        queueDate: { $gte: start, $lte: end },
        status: "InConsultation",
    });
};

const updateQueueEntry = async (id, updateData) => {
    return await Queue.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};

module.exports = {
    createQueueEntry,
    getTodayQueueCountForDoctor,
    getQueues,
    getQueueById,
    getQueueByDoctor,
    getNextWaitingForDoctor,
    getInConsultationForDoctor,
    updateQueueEntry,
};