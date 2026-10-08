const queueRepository = require("../repositories/queue.repository");

const joinQueue = async (queueData) => {
    const { doctorId } = queueData;

    const todayCount = await queueRepository.getTodayQueueCountForDoctor(doctorId);
    const queueNumber = todayCount + 1;

    return await queueRepository.createQueueEntry({
        ...queueData,
        queueNumber,
    });
};

const getQueues = async () => {
    return await queueRepository.getQueues();
};

const getQueueById = async (id) => {
    const entry = await queueRepository.getQueueById(id);
    if (!entry) {
        throw new Error("Queue entry not found");
    }
    return entry;
};

const getQueueByDoctor = async (doctorId) => {
    return await queueRepository.getQueueByDoctor(doctorId);
};

const callNext = async (doctorId) => {
    const alreadyInConsultation = await queueRepository.getInConsultationForDoctor(doctorId);
    if (alreadyInConsultation) {
        throw new Error("Another patient is already in consultation. Complete that first.");
    }

    const next = await queueRepository.getNextWaitingForDoctor(doctorId);
    if (!next) {
        throw new Error("No patients waiting in queue");
    }

    return await queueRepository.updateQueueEntry(next._id, {
        status: "InConsultation",
        calledAt: new Date(),
    });
};

const completeConsultation = async (id) => {
    const entry = await queueRepository.getQueueById(id);
    if (!entry) {
        throw new Error("Queue entry not found");
    }

    if (entry.status !== "InConsultation") {
        throw new Error("This queue entry is not currently in consultation");
    }

    return await queueRepository.updateQueueEntry(id, {
        status: "Completed",
        completedAt: new Date(),
    });
};

const skipPatient = async (id) => {
    const entry = await queueRepository.getQueueById(id);
    if (!entry) {
        throw new Error("Queue entry not found");
    }

    if (!["Waiting", "InConsultation"].includes(entry.status)) {
        throw new Error("Only waiting or in-consultation entries can be skipped");
    }

    return await queueRepository.updateQueueEntry(id, { status: "Skipped" });
};

const cancelQueueEntry = async (id) => {
    const entry = await queueRepository.getQueueById(id);
    if (!entry) {
        throw new Error("Queue entry not found");
    }

    if (entry.status === "Completed") {
        throw new Error("Cannot cancel a completed queue entry");
    }

    return await queueRepository.updateQueueEntry(id, { status: "Cancelled" });
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